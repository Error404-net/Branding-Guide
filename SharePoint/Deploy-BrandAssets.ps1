#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Uploads this repo's brand resource folders to a document library on the Brand Center
    site, mirroring the local folder structure.

.DESCRIPTION
    Separate from Register-OrgTemplateLibrary.ps1 on purpose: that one uploads Office
    document templates into an OAL-registered "Templates" library specifically so they show
    up in Word/Excel/PowerPoint's New-document gallery. This one is a plain browsable
    resource library for everything else — logos, social/Discord/OBS assets, Entra branding
    exports, email templates — none of which belong in an Office-template gallery.

    Uploads every file under each folder in -Folders, recreating the same relative folder
    structure inside -LibraryName on the target site. -ExcludeRelativePaths skips exact
    duplicates that already exist elsewhere (default: obs/assets/logos, which mirrors
    assets/ byte-for-byte per this repo's own obs/README notes).

    office-templates/ is deliberately not in the default folder list — those already live in
    the Templates library from Register-OrgTemplateLibrary.ps1; uploading them again here
    would just duplicate them under a different library.

    -RegisterCdnOrigin registers -LibraryName as a Public CDN origin (Add-PnPTenantCdnOrigin)
    after upload. A plain SharePoint library requires login to view — files in it are not
    reachable by anonymous/external consumers at all. A handful of what's in here needs to
    be: the Discord theme CSS is fetched directly by the Discord client, and email templates
    reference images that need to load in recipients' email clients. Neither can authenticate
    to SharePoint. Off by default because it makes every file in the library anonymously
    readable over the internet — a real access-scope change, not just a convenience toggle.

.EXAMPLE
    ./Deploy-BrandAssets.ps1

.EXAMPLE
    ./Deploy-BrandAssets.ps1 -RegisterCdnOrigin

.EXAMPLE
    ./Deploy-BrandAssets.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide" `
        -Folders @('logos', 'social') -LibraryName "Resources"
#>

param(
    [string]$SiteUrl,
    [string]$TenantName,
    [string]$ClientId = $env:PNP_CLIENTID,
    [string]$LibraryName = "Brand Assets",
    [string]$SourceRoot = (Split-Path -Parent $PSScriptRoot),
    [string[]]$Folders = @('logos', 'entra-m365', 'email-templates', 'social', 'discord', 'obs', 'assets'),
    [string[]]$ExcludeRelativePaths = @('obs/assets/logos'),
    [switch]$RegisterCdnOrigin
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

# ============================================================================
# TARGET SITE
# ============================================================================

if ($SiteUrl) {
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
    $tenantName = ConvertTo-TenantPrefix -TenantName $TenantName
    try {
        $ClientId = Get-PnPClientId -ClientId $ClientId -TenantName $tenantName
        $SiteUrl = Select-PnPSiteUrl -TenantName $tenantName -ClientId $ClientId
    } catch {
        Write-Log "✗ $_" -Level Error
        exit 1
    }
}
$tenantAdminUrl = "https://$tenantName-admin.sharepoint.com"

# ============================================================================
# BUILD FILE LIST
# ============================================================================

$filesToUpload = foreach ($folder in $Folders) {
    $folderPath = Join-Path $SourceRoot $folder
    if (-not (Test-Path $folderPath)) {
        Write-Log "  Skipping '$folder' — not found at $folderPath" -Level Warning
        continue
    }
    Get-ChildItem -Path $folderPath -Recurse -File | ForEach-Object {
        $relative = [System.IO.Path]::GetRelativePath($SourceRoot, $_.FullName) -replace '\\', '/'
        $excluded = $false
        foreach ($ex in $ExcludeRelativePaths) {
            if ($relative -like "$ex*") { $excluded = $true; break }
        }
        if (-not $excluded) {
            [PSCustomObject]@{ FullPath = $_.FullName; RelativePath = $relative }
        }
    }
}

if (-not $filesToUpload) {
    Write-Log "✗ No files found under: $($Folders -join ', ')" -Level Error
    exit 1
}

Write-Log "Site:    $SiteUrl" -Level Info
Write-Log "Library: $LibraryName" -Level Info
Write-Log "Found $($filesToUpload.Count) file(s) across $($Folders.Count) folder(s)" -Level Info
Write-Host ""

# ============================================================================
# UPLOAD
# ============================================================================

try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
    # Connect-PnPOnline can "succeed" (acquire a token) against a site that doesn't
    # actually exist — verify it for real before uploading hundreds of files against it.
    Get-PnPWeb -ErrorAction Stop | Out-Null

    $folderCache = @{}
    $count = 0
    foreach ($f in $filesToUpload) {
        $destFolderRel = (Split-Path -Parent $f.RelativePath) -replace '\\', '/'
        if (-not $folderCache.ContainsKey($destFolderRel)) {
            $folderCache[$destFolderRel] = Initialize-PnPFolderPath -LibraryName $LibraryName -RelativePath $destFolderRel
        }
        Add-PnPFile -Path $f.FullPath -Folder $folderCache[$destFolderRel] -ErrorAction Stop | Out-Null
        $count++
        Write-Log "  ✓ ($count/$($filesToUpload.Count)) $($f.RelativePath)" -Level Success
    }
} catch {
    Write-Log "✗ Upload failed: $_" -Level Error
    exit 1
} finally {
    Disconnect-PnPOnline
}

Write-Host ""
Write-Log "Done. $($filesToUpload.Count) file(s) uploaded to '$LibraryName' on $SiteUrl" -Level Success

# ============================================================================
# CDN ORIGIN (optional — tenant admin)
# ============================================================================

if ($RegisterCdnOrigin) {
    Write-Host ""
    Write-Log "Registering '$LibraryName' as a Public CDN origin..." -Level Info
    Write-Log "  Makes every file in it anonymously readable over the internet, no SharePoint" -Level Warning
    Write-Log "  login required. Requires SharePoint Administrator or Global Administrator" -Level Warning
    Write-Log "  and a second sign-in to tenant admin." -Level Warning

    $sitePathMatch = [regex]::Match($SiteUrl, '/sites/.+$')
    if (-not $sitePathMatch.Success) {
        Write-Log "✗ Could not derive the site-relative path from '$SiteUrl'" -Level Error
        exit 1
    }
    $originPath = "$($sitePathMatch.Value.TrimStart('/'))/$LibraryName"

    try {
        Connect-PnPOnline -Url $tenantAdminUrl -Interactive -ClientId $ClientId -ErrorAction Stop

        if (-not (Get-PnPTenantCdnEnabled -CdnType Public -ErrorAction SilentlyContinue)) {
            Set-PnPTenantCdnEnabled -CdnType Public -Enable $true -ErrorAction Stop
        }
        Add-PnPTenantCdnOrigin -CdnType Public -OriginUrl $originPath -ErrorAction Stop

        Write-Log "✓ Registered '$originPath' as a Public CDN origin" -Level Success
        Write-Log "  CDN URL prefix: https://public-cdn.sharepointonline.com/$tenantName.sharepoint.com/$originPath/..." -Level Info
        Write-Log "  Allow up to 15 minutes to propagate." -Level Info
    } catch {
        Write-Log "✗ CDN origin registration failed: $_" -Level Error
        exit 1
    } finally {
        Disconnect-PnPOnline
    }
}
