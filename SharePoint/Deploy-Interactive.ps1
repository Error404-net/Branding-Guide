#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Interactive Error404 Template Store Deployment Wizard
    
.DESCRIPTION
    Step-by-step guided deployment to M365 SharePoint.
    Prompts for tenant URL, site, and configuration before deploying.

.PARAMETER ClientId
    Entra ID App Registration client ID used for Connect-PnPOnline -Interactive. Microsoft
    retired the shared "PnP Management Shell" multi-tenant app in September 2024, so
    PnP.PowerShell now needs your own app registration's client ID — one per tenant.
    If omitted and $env:PNP_CLIENTID isn't set, the script offers to register one for you
    (needs Global Admin). Works against any tenant — see README.md.
#>

param(
    [string]$ClientId = $env:PNP_CLIENTID
)

# ============================================================================
# SETUP & COLORS
# ============================================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$colors = @{
    Info    = 'Cyan'
    Success = 'Green'
    Warning = 'Yellow'
    Error   = 'Red'
    Prompt  = 'Magenta'
}

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('Info', 'Success', 'Warning', 'Error', 'Prompt')]
        [string]$Level = 'Info'
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] " -NoNewline
    Write-Host $Message -ForegroundColor $colors[$Level]
}

# ============================================================================
# BANNER
# ============================================================================

Clear-Host
Write-Host @"

╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║           SharePoint Template Store — Deployment Wizard                  ║
║           Microsoft 365                                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# ============================================================================
# CHECK PREREQUISITES
# ============================================================================

Write-Log "Checking prerequisites..." -Level Info
Write-Host ""

# Check PowerShell version
if ($PSVersionTable.PSVersion.Major -lt 7) {
    Write-Log "Warning: PowerShell 7+ recommended (you have $($PSVersionTable.PSVersion.Major))" -Level Warning
}

# Check PnP module
$pnpModule = Get-Module -ListAvailable PnP.PowerShell -ErrorAction SilentlyContinue
if (-not $pnpModule) {
    Write-Log "✗ PnP.PowerShell not found" -Level Error
    Write-Host ""
    Write-Log "Install with:" -Level Info
    Write-Host "  Install-Module PnP.PowerShell -Force" -ForegroundColor Green
    Write-Host ""
    exit 1
}

Write-Log "✓ PowerShell version: $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)" -Level Success
Write-Log "✓ PnP.PowerShell module available" -Level Success
Write-Host ""

. "$PSScriptRoot/lib/PnPConnect.Helpers.ps1"

# ============================================================================
# TARGET SITE
# ============================================================================

Write-Log "====== STEP 1: TARGET SITE ======" -Level Prompt
Write-Host ""

$tenantName = Read-CleanHost "Tenant name (e.g., 'contoso' from contoso.sharepoint.com)"
if (-not $tenantName) {
    Write-Log "✗ Tenant name is required" -Level Error
    exit 1
}
$tenantName = ConvertTo-TenantPrefix -TenantName $tenantName
$tenantAdminUrl = "https://$tenantName-admin.sharepoint.com"

try {
    $ClientId = Get-PnPClientId -ClientId $ClientId -TenantName $tenantName
    $siteUrl = Select-PnPSiteUrl -TenantName $tenantName -ClientId $ClientId
} catch {
    Write-Log "✗ $_" -Level Error
    exit 1
}

Write-Log "Connecting to site..." -Level Info
try {
    Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
    # Connect-PnPOnline can "succeed" (acquire a token) against a site that doesn't
    # actually exist — a typo or an invisible character riding along in a pasted URL.
    # Verify it for real now instead of finding out four prompts later at upload time.
    Get-PnPWeb -ErrorAction Stop | Out-Null
    Write-Log "✓ Connected to site" -Level Success
} catch {
    Write-Log "✗ Failed to connect to site '$siteUrl': $_" -Level Error
    exit 1
}

Write-Host ""

# ============================================================================
# CONFIGURATION
# ============================================================================

Write-Log "====== STEP 2: CONFIGURATION ======" -Level Prompt
Write-Host ""

$pageName = Read-CleanHost "Page name (default: 'template-store')"
if (-not $pageName) { $pageName = "template-store" }

$pageTitle = Read-CleanHost "Page title (default: 'Template Store')"
if (-not $pageTitle) { $pageTitle = "Template Store" }

$visitorGroup = Read-CleanHost "Group to grant access (default: 'Everyone Except External Users')"
if (-not $visitorGroup) { $visitorGroup = "Everyone Except External Users" }

$themeChoice = Read-CleanHost "Apply a theme? (n)one / (c)orporate B&W / (d)igital color, default: n"
$themeChoice = switch ($themeChoice) {
    { $_ -in 'c', 'corporate' } { 'Corporate' }
    { $_ -in 'd', 'digital' }   { 'Digital' }
    default                     { $null }
}

Write-Host ""

# ============================================================================
# SUMMARY
# ============================================================================

Write-Log "====== DEPLOYMENT SUMMARY ======" -Level Prompt
Write-Host ""
Write-Host "  Site:        $siteUrl" -ForegroundColor Cyan
Write-Host "  Page:        $pageTitle" -ForegroundColor Cyan
Write-Host "  Group:       $visitorGroup" -ForegroundColor Cyan
Write-Host "  Apply theme: $(if($themeChoice){$themeChoice}else{'No'})" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-CleanHost "Proceed with deployment? (y/n)"
if ($confirm -ne 'y') {
    Write-Log "Cancelled by user" -Level Warning
    exit 0
}

Write-Host ""

# ============================================================================
# DEPLOYMENT
# ============================================================================

Write-Log "====== DEPLOYMENT IN PROGRESS ======" -Level Prompt
Write-Host ""

# Step 1: Upload HTML
Write-Log "1/4 Uploading template store HTML..." -Level Info

try {
    # Get the HTML file
    $htmlPath = Split-Path -Parent $PSCommandPath
    $htmlFile = "$htmlPath/error404-sharepoint-template-store.html"
    
    if (-not (Test-Path $htmlFile)) {
        # Try current directory
        $htmlFile = "./error404-sharepoint-template-store.html"
        if (-not (Test-Path $htmlFile)) {
            Write-Log "✗ HTML file not found" -Level Error
            Write-Log "Looking for: error404-sharepoint-template-store.html" -Level Info
            exit 1
        }
    }
    
    # A freshly-provisioned site (e.g. one Brand Center just created) may not have
    # a "Site Assets" library yet — Add-PnPFile 404s against a folder that doesn't exist.
    if (-not (Get-PnPList -Identity "SiteAssets" -ErrorAction SilentlyContinue)) {
        New-PnPList -Title "SiteAssets" -Template DocumentLibrary -ErrorAction Stop | Out-Null
        Write-Log "  Created 'SiteAssets' library (didn't exist yet)" -Level Info
    }

    $file = Add-PnPFile -Path $htmlFile -Folder "SiteAssets"
    $fileUrl = $file.ServerRelativeUrl
    # ServerRelativeUrl is relative to the tenant root (already includes /sites/<name>/...),
    # not relative to $siteUrl — concatenating $siteUrl + $fileUrl would duplicate that segment.
    $tenantRootUrl = $siteUrl -replace '(^https://[^/]+).*', '$1'
    $directLink = "$tenantRootUrl$fileUrl"

    Write-Log "✓ File uploaded: $fileUrl" -Level Success
} catch {
    Write-Log "✗ Upload failed: $_" -Level Error
    exit 1
}

Write-Host ""

# Step 2: Create page
Write-Log "2/4 Creating page..." -Level Info

try {
    # Check if page exists
    $existingPages = Get-PnPListItem -List "Site Pages" `
        -Query "<Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>$pageName.aspx</Value></Eq></Where>" `
        -ErrorAction SilentlyContinue
    
    if ($existingPages) {
        Write-Log "  Removing existing page..." -Level Warning
        Remove-PnPListItem -List "Site Pages" -Identity $existingPages.Id -Force
        Start-Sleep -Seconds 2
    }

    $page = Add-PnPPage -Name $pageName -LayoutType "SingleWebPartAppPage"
    $pageUrl = "$siteUrl/sitepages/$pageName.aspx"

    # A page with no content, left unpublished, is what "Save as template" finds nothing
    # usable in — give it a real link to the uploaded page and publish it for real.
    Add-PnPPageTextPart -Page $pageName -Text "<p><a href='$directLink'>Open the Template Store</a></p>" -ErrorAction Stop
    Set-PnPPage -Identity $pageName -Publish -ErrorAction Stop

    Write-Log "✓ Page created and published: $pageUrl" -Level Success
} catch {
    Write-Log "✗ Page creation failed: $_" -Level Error
    Write-Log "  (Manual embed still works — see instructions below)" -Level Warning
}

Write-Host ""

# Step 3: Set page title
Write-Log "3/4 Setting page title..." -Level Info

try {
    $pageItem = Get-PnPListItem -List "Site Pages" `
        -Query "<Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>$pageName.aspx</Value></Eq></Where>" `
        -ErrorAction SilentlyContinue
    
    if ($pageItem) {
        $pageItem["Title"] = $pageTitle
        $pageItem.Update()
        Invoke-PnPQuery
        Write-Log "✓ Page title set: $pageTitle" -Level Success
    }
} catch {
    Write-Log "⚠ Could not set page title (non-critical)" -Level Warning
}

Write-Host ""

# Step 4: Apply theme
# Both palettes registered as separate identities so a tenant ends up with both as
# selectable options (Site Settings > Change the look) regardless of which one this
# run applies here — not just the one picked this time.
$themes = @{
    Corporate = @{
        Identity   = "Error404-Corporate"
        IsInverted = $false
        Palette    = @{
            "themePrimary"      = "#000000"
            "themeLighterAlt"   = "#F5F5F5"
            "themeLighter"      = "#EEEEEE"
            "themeLight"        = "#FFFFFF"
            "themeTertiary"     = "#666666"
            "themeSecondary"    = "#333333"
            "themeDarkAlt"      = "#1A1A1A"
            "themeDark"         = "#000000"
            "neutralLighter"    = "#F5F5F5"
            "neutralLight"      = "#EEEEEE"
            "neutralQuaternary" = "#CCCCCC"
            "neutralTertiary"   = "#999999"
            "neutralPrimary"    = "#000000"
            "neutralDark"       = "#1A1A1A"
            "black"             = "#000000"
            "white"             = "#FFFFFF"
        }
    }
    # Arcade New Wave — same slot structure as Corporate above, tone-for-tone swapped
    # in from this repo's own already contrast-verified tokens (DESIGN.md §1), not a
    # generated tint ramp: themePrimary is the brand accent, the theme*/neutral* dark<->
    # light slots take DESIGN.md's measured surface/text tokens in the same relative
    # positions Corporate uses for black/white, and black/white take the base surface
    # and brightest text as their literal (not semantically-inverted) values.
    Digital = @{
        Identity   = "Error404-Digital"
        IsInverted = $true
        Palette    = @{
            "themePrimary"      = "#4DE1FF"
            "themeLighterAlt"   = "#170C38"
            "themeLighter"      = "#1C1044"
            "themeLight"        = "#231451"
            "themeTertiary"     = "#8A83B8"
            "themeSecondary"    = "#C9C3EF"
            "themeDarkAlt"      = "#E8E4FF"
            "themeDark"         = "#F4F1FF"
            "neutralLighter"    = "#170C38"
            "neutralLight"      = "#1C1044"
            "neutralQuaternary" = "#8A83B8"
            "neutralTertiary"   = "#C9C3EF"
            "neutralPrimary"    = "#F4F1FF"
            "neutralDark"       = "#E8E4FF"
            "black"             = "#231451"
            "white"             = "#F4F1FF"
        }
    }
}

if ($themeChoice) {
    $theme = $themes[$themeChoice]
    Write-Log "4/4 Applying '$($theme.Identity)' theme..." -Level Info

    try {
        # Set-PnPWebTheme applies a theme BY NAME — it has to already be registered on the
        # tenant, or this silently does nothing. Registering one is a tenant-admin action
        # (Add-PnPTenantTheme requires the tenant admin site, not the regular site
        # connection), and makes the theme selectable on every site in the tenant, not
        # just this one — a separate sign-in, on top of what site-level deployment
        # normally needs.
        Write-Log "  Registering the theme tenant-wide requires SharePoint Administrator" -Level Warning
        Write-Log "  or Global Administrator, and a separate sign-in to tenant admin." -Level Warning
        $tenantAdminConn = Connect-PnPOnline -Url $tenantAdminUrl -Interactive -ClientId $ClientId -ReturnConnection -ErrorAction Stop
        Add-PnPTenantTheme -Identity $theme.Identity -Palette $theme.Palette -IsInverted $theme.IsInverted `
            -Overwrite -Connection $tenantAdminConn -ErrorAction Stop

        Set-PnPWebTheme -Theme $theme.Identity -ErrorAction Stop
        Write-Log "✓ Theme registered tenant-wide and applied to this site" -Level Success
    } catch {
        Write-Log "⚠ Theme application failed: $_" -Level Warning
    }
} else {
    Write-Log "4/4 (Skipped theme application)" -Level Info
}

Write-Host ""

# ============================================================================
# COMPLETION
# ============================================================================

Write-Log "====== DEPLOYMENT COMPLETE ======" -Level Success
Write-Host ""

$embedCode = @"
<iframe
  src="$directLink"
  style="width: 100%; height: 100vh; border: none;"
  title="Error404 Template Store"
/>
"@

Write-Host "✓ Template Store is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "DIRECT LINK:" -ForegroundColor Cyan
Write-Host "  $directLink" -ForegroundColor Yellow
Write-Host ""
Write-Host "PAGE LINK:" -ForegroundColor Cyan
Write-Host "  $pageUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "EMBED CODE (for other pages):" -ForegroundColor Cyan
Write-Host $embedCode -ForegroundColor Yellow
Write-Host ""

# Copy link to clipboard
$directLink | Set-Clipboard
Write-Log "✓ Direct link copied to clipboard" -Level Success

Write-Host ""
Write-Log "NEXT STEPS:" -Level Prompt
Write-Host "  1. Open: $pageUrl" -ForegroundColor White
Write-Host "  2. If blank, add 'Embed' web part with the code above" -ForegroundColor White
Write-Host "  3. Test on desktop and mobile" -ForegroundColor White
Write-Host "  4. Share link with your team" -ForegroundColor White
Write-Host "  5. Add to quick links / favorites" -ForegroundColor White
Write-Host ""

Write-Log "All done! 🎉" -Level Success

Disconnect-PnPOnline
