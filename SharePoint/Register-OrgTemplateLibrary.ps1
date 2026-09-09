#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Registers a document library on a Brand Center / Organization Assets Library (OAL)
    site as the tenant's Office Template Library.

.DESCRIPTION
    All OAL libraries (images, templates, fonts, brand kit) must live on the same site —
    the one the tenant's Brand Center was created on (Global Admin > Settings > Org settings >
    Brand center; Microsoft's own suggested site name is "Brand Guide", which is why enabling
    Brand Center creates a site that looks just like this).

    This script:
      1. Ensures a document library exists on that site for templates (creates it via PnP if
         missing — plain site-owner permission, no tenant admin needed for this part), then
         uploads local template files into it (optionally into a subfolder).
      2. Registers that library tenant-wide via PnP's Add-PnPOrgAssetsLibrary -OrgAssetType
         OfficeTemplateLibrary (connects to the tenant admin site — requires SharePoint
         Administrator or Global Administrator, and Public CDN consent, which Brand Center
         setup already grants). Uses PnP throughout, not the classic
         Microsoft.Online.SharePoint.PowerShell module — that one is Windows-only and does
         not work on macOS/Linux PowerShell 7.

    Parameterized by -SiteUrl so it's reusable for other orgs/tenants — just pass a different
    Brand Center site URL. -LocalTemplatesPath / -DestinationFolder control what gets uploaded
    and where within the library it lands.

    When -OrgAssetType is OfficeTemplateLibrary, .docx/.pptx/.xlsx files are converted to real
    template format (.dotx/.potx/.xltx) before upload — a plain .docx never shows up in the
    New-document gallery, only a true template does. Source files are never modified; a
    converted copy is uploaded instead. Disable with -SkipConversion.

.EXAMPLE
    ./Register-OrgTemplateLibrary.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide"

.EXAMPLE
    ./Register-OrgTemplateLibrary.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide" `
        -LibraryName "Templates" -LocalTemplatesPath "./contoso-templates" -DestinationFolder "Contoso"

.EXAMPLE
    # Registration only, no upload
    ./Register-OrgTemplateLibrary.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide" -SkipUpload
#>

param(
    [string]$SiteUrl,
    [string]$TenantName,
    [string]$ClientId = $env:PNP_CLIENTID,
    [string]$LibraryName = "Templates",
    [ValidateSet('ImageDocumentLibrary', 'OfficeTemplateLibrary', 'OfficeFontLibrary', 'BrandKitLibrary')]
    [string]$OrgAssetType = 'OfficeTemplateLibrary',
    [ValidateSet('Public', 'Private')]
    [string]$CdnType = 'Public',
    [string]$ThumbnailUrl,
    [string]$LocalTemplatesPath,
    [string]$DestinationFolder,
    [switch]$SkipUpload,
    [switch]$SkipConversion
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Write-Log {
    param([string]$Message, [ValidateSet('Info', 'Success', 'Warning', 'Error')] [string]$Level = 'Info')
    $c = @{ Info = 'Cyan'; Success = 'Green'; Warning = 'Yellow'; Error = 'Red' }
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] " -NoNewline
    Write-Host $Message -ForegroundColor $c[$Level]
}

# ============================================================================
# PREREQUISITES
# ============================================================================

if (-not (Get-Module -ListAvailable PnP.PowerShell)) {
    Write-Log "✗ PnP.PowerShell not found — install with: Install-Module PnP.PowerShell -Force" -Level Error
    exit 1
}
Write-Log "✓ Required modules present" -Level Success

. "$PSScriptRoot/lib/PnPConnect.Helpers.ps1"
. "$PSScriptRoot/lib/OfficeTemplateConvert.Helpers.ps1"

# ============================================================================
# TARGET SITE
# ============================================================================

if ($SiteUrl) {
    # -SiteUrl passed explicitly (e.g. scripted/repeat runs) — skip the search picker.
    $SiteUrl = ConvertTo-CleanString -Value $SiteUrl
    try {
        $tenantName = Get-TenantNameFromSiteUrl -SiteUrl $SiteUrl
        $ClientId = Get-PnPClientId -ClientId $ClientId -TenantName $tenantName
    } catch {
        Write-Log "✗ $_" -Level Error
        exit 1
    }
} else {
    if (-not $TenantName) {
        $TenantName = Read-CleanHost "Tenant name (e.g., 'contoso' from contoso.sharepoint.com)"
    }
    if (-not $TenantName) {
        Write-Log "✗ Tenant name is required" -Level Error
        exit 1
    }
    $TenantName = ConvertTo-TenantPrefix -TenantName $TenantName
    try {
        $ClientId = Get-PnPClientId -ClientId $ClientId -TenantName $TenantName
        $SiteUrl = Select-PnPSiteUrl -TenantName $TenantName -ClientId $ClientId
    } catch {
        Write-Log "✗ $_" -Level Error
        exit 1
    }
    $tenantName = $TenantName
}
$tenantAdminUrl = "https://$tenantName-admin.sharepoint.com"
$libraryUrl = "$SiteUrl/$LibraryName"

# Default local source: this repo's office-templates/ folder, next to this script.
# Only used as a default — if it doesn't exist and the caller didn't ask for it
# explicitly, upload is skipped rather than treated as an error (other orgs won't have it).
$usingDefaultLocalPath = -not $LocalTemplatesPath
if (-not $LocalTemplatesPath) {
    $LocalTemplatesPath = Join-Path (Split-Path -Parent $PSCommandPath) "../office-templates"
}
$LocalTemplatesPath = [System.IO.Path]::GetFullPath($LocalTemplatesPath)

$destinationFolderPath = if ($DestinationFolder) { "$LibraryName/$DestinationFolder" } else { $LibraryName }

Write-Log "Site:          $SiteUrl" -Level Info
Write-Log "Library:       $libraryUrl" -Level Info
Write-Log "Tenant admin:  $tenantAdminUrl" -Level Info
if (-not $SkipUpload) {
    Write-Log "Upload from:   $LocalTemplatesPath" -Level Info
    Write-Log "Upload to:     $destinationFolderPath" -Level Info
}
Write-Host ""

# ============================================================================
# STEP 1: ENSURE THE LIBRARY EXISTS AND UPLOAD TEMPLATES (site-level — PnP)
# ============================================================================

Write-Log "1/2 Ensuring '$LibraryName' library exists on the site..." -Level Info
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
    # Connect-PnPOnline can "succeed" (acquire a token) against a site that doesn't
    # actually exist — a typo or an invisible character riding along in a pasted URL.
    # Verify it for real now instead of surfacing a confusing list/upload error later.
    Get-PnPWeb -ErrorAction Stop | Out-Null

    $list = Get-PnPList -Identity $LibraryName -ErrorAction SilentlyContinue
    if (-not $list) {
        New-PnPList -Title $LibraryName -Template DocumentLibrary -ErrorAction Stop | Out-Null
        Write-Log "✓ Created library '$LibraryName'" -Level Success
    } else {
        Write-Log "✓ Library '$LibraryName' already exists" -Level Success
    }

    if (-not $SkipUpload) {
        if (-not (Test-Path $LocalTemplatesPath)) {
            if ($usingDefaultLocalPath) {
                Write-Log "  No local templates folder at '$LocalTemplatesPath' — skipping upload" -Level Warning
            } else {
                Write-Log "✗ -LocalTemplatesPath '$LocalTemplatesPath' does not exist" -Level Error
                exit 1
            }
        } else {
            if ($DestinationFolder -and -not (Get-PnPFolder -Url "$LibraryName/$DestinationFolder" -ErrorAction SilentlyContinue)) {
                Add-PnPFolder -Name $DestinationFolder -Folder $LibraryName -ErrorAction Stop | Out-Null
                Write-Log "✓ Created folder '$destinationFolderPath'" -Level Success
            }

            $files = Get-ChildItem -Path $LocalTemplatesPath -File
            $convert = ($OrgAssetType -eq 'OfficeTemplateLibrary') -and -not $SkipConversion
            $uploadDir = $null
            if ($convert) {
                $uploadDir = Join-Path ([System.IO.Path]::GetTempPath()) "org-templates-$([guid]::NewGuid())"
                New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null
            }

            try {
                Write-Log "  Uploading $($files.Count) file(s) to '$destinationFolderPath'..." -Level Info
                foreach ($f in $files) {
                    $uploadPath = $f.FullName
                    if ($convert) {
                        $uploadPath = ConvertTo-OfficeTemplateFile -Path $f.FullName -DestinationDirectory $uploadDir
                    }
                    Add-PnPFile -Path $uploadPath -Folder $destinationFolderPath -ErrorAction Stop | Out-Null
                    $uploadName = Split-Path -Leaf $uploadPath
                    if ($uploadName -ne $f.Name) {
                        Write-Log "  ✓ $uploadName (converted from $($f.Name))" -Level Success
                    } else {
                        Write-Log "  ✓ $uploadName" -Level Success
                    }
                }
            } finally {
                if ($uploadDir) { Remove-Item -Path $uploadDir -Recurse -Force -ErrorAction SilentlyContinue }
            }
        }
    }
} catch {
    Write-Log "✗ Failed to ensure library / upload: $_" -Level Error
    exit 1
} finally {
    Disconnect-PnPOnline
}

Write-Host ""

# ============================================================================
# STEP 2: REGISTER AS AN ORGANIZATION ASSETS LIBRARY (tenant-level — PnP, tenant admin site)
# ============================================================================

Write-Log "2/2 Registering as tenant Organization Assets Library ($OrgAssetType)..." -Level Info
Write-Log "  Requires SharePoint Administrator or Global Administrator" -Level Warning

try {
    Connect-PnPOnline -Url $tenantAdminUrl -Interactive -ClientId $ClientId -ErrorAction Stop

    $params = @{
        LibraryUrl   = $libraryUrl
        OrgAssetType = $OrgAssetType
        CdnType      = $CdnType
    }
    if ($ThumbnailUrl) { $params.ThumbnailUrl = $ThumbnailUrl }

    Add-PnPOrgAssetsLibrary @params -ErrorAction Stop
    Write-Log "✓ Registered $libraryUrl as $OrgAssetType" -Level Success

    Write-Host ""
    Get-PnPOrgAssetsLibrary | Format-Table LibraryUrl, OrgAssetType, CdnType -AutoSize
} catch {
    Write-Log "✗ Registration failed: $_" -Level Error
    Write-Log "  Common cause: Public CDN not yet consented for this tenant — enable via" -Level Warning
    Write-Log "  M365 admin center > Settings > Org settings > Brand center." -Level Warning
    exit 1
} finally {
    Disconnect-PnPOnline
}

Write-Host ""
Write-Log "Done. Allow up to 24 hours for templates to appear in Word/Excel/PowerPoint." -Level Success
if ($OrgAssetType -eq 'OfficeTemplateLibrary' -and -not $SkipConversion -and -not $SkipUpload) {
    Write-Log "Uploaded .docx/.pptx/.xlsx files were converted to real templates" -Level Info
    Write-Log "(.dotx/.potx/.xltx) automatically — your local source files are untouched." -Level Info
}
