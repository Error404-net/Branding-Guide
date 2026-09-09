<#
.SYNOPSIS
    Shared helpers for the scripts in this folder. Dot-source, don't run directly:
        . "$PSScriptRoot/lib/PnPConnect.Helpers.ps1"

    Tenant-agnostic on purpose — every script in this folder passes in its own -SiteUrl,
    so the same helpers work against any Microsoft 365 tenant, not just this one.
#>

<#
.SYNOPSIS
    Strips invisible Unicode (zero-width spaces, bidi marks like U+200E, BOMs) and trims.
    A pasted URL can carry these completely invisibly — it looks identical on screen but
    no longer matches the real site, so requests against it 404.
#>
function ConvertTo-CleanString {
    param([string]$Value)
    if ($null -eq $Value) { return $Value }
    return ($Value -replace '[\p{Cf}\p{Cc}]', '').Trim()
}

<#
.SYNOPSIS
    Read-Host, run through ConvertTo-CleanString. Every prompt in this folder should read
    input through this instead of raw Read-Host — see ConvertTo-CleanString.
#>
function Read-CleanHost {
    param([string]$Prompt)
    return ConvertTo-CleanString (Read-Host $Prompt)
}

<#
.SYNOPSIS
    Normalizes whatever format a tenant name was typed/pasted in down to the bare prefix
    (e.g. "contoso") that the rest of this folder's scripts build URLs from.

.DESCRIPTION
    People paste this in every format Microsoft itself shows it in: the bare prefix, the
    full https://contoso.sharepoint.com site URL, the -admin variant, or the tenant's
    contoso.onmicrosoft.com primary domain (what Entra ID shows). Accept all of them rather
    than erroring on whichever one wasn't expected.
#>
function ConvertTo-TenantPrefix {
    param([Parameter(Mandatory)][string]$TenantName)

    $t = $TenantName.Trim()
    $t = $t -replace '^https?://', ''
    $t = $t -replace '-admin\.sharepoint\.com.*$', ''
    $t = $t -replace '\.sharepoint\.com.*$', ''
    $t = $t -replace '\.onmicrosoft\.com.*$', ''
    return $t.Trim('/')
}

function Get-TenantNameFromSiteUrl {
    param([Parameter(Mandatory)][string]$SiteUrl)

    $SiteUrl = $SiteUrl.Trim()
    if ($SiteUrl -notmatch '^https://([^./]+)\.sharepoint\.com') {
        throw "Could not parse a tenant name out of '$SiteUrl' — expected https://<tenant>.sharepoint.com/..."
    }
    return $Matches[1]
}

<#
.SYNOPSIS
    Resolves the Entra ID app client ID to use with Connect-PnPOnline -Interactive,
    registering a new app on the spot if none is configured.

.DESCRIPTION
    Microsoft retired the shared multi-tenant "PnP Management Shell" app in September 2024 —
    every tenant now needs its own Entra ID app registration for interactive PnP login.
    This is a one-time-per-tenant action requiring Global Administrator.

    Resolution order: -ClientId param > $env:PNP_CLIENTID > interactive registration prompt.
#>
function Get-PnPClientId {
    param(
        [string]$ClientId,
        [Parameter(Mandatory)][string]$TenantName,
        [string]$ApplicationName = "PnP.PowerShell"
    )

    if ($ClientId) { return $ClientId }
    $TenantName = ConvertTo-TenantPrefix -TenantName $TenantName

    Write-Host ""
    Write-Host "No Entra ID app client ID configured (-ClientId / `$env:PNP_CLIENTID)." -ForegroundColor Yellow
    Write-Host "Microsoft retired the shared multi-tenant 'PnP Management Shell' app in Sept 2024 —" -ForegroundColor Yellow
    Write-Host "every tenant now needs its own app registration for interactive PnP login." -ForegroundColor Yellow
    Write-Host ""
    $answer = Read-CleanHost "Register one now for '$TenantName.onmicrosoft.com'? Needs Global Admin. (y/n)"
    if ($answer -ne 'y') {
        throw "No client ID available. See README.md 'One-time tenant setup' for the manual command."
    }

    Write-Host "Registering Entra ID app '$ApplicationName' — this opens an interactive sign-in..." -ForegroundColor Cyan
    $result = Register-PnPEntraIDAppForInteractiveLogin -ApplicationName $ApplicationName -Tenant "$TenantName.onmicrosoft.com" -ErrorAction Stop

    # ponytail: the cmdlet's return shape isn't consistently documented across PnP.PowerShell
    # versions, so try the known candidate property names before falling back to asking.
    $newClientId = $null
    foreach ($prop in 'ClientId', 'AzureAppId', 'AppId', 'ApplicationId') {
        if ($result.PSObject.Properties.Name -contains $prop -and $result.$prop) {
            $newClientId = $result.$prop
            break
        }
    }
    if (-not $newClientId) {
        Write-Host ($result | Format-List | Out-String)
        $newClientId = Read-CleanHost "Couldn't auto-detect the client ID above — paste the Application (client) ID"
    }

    $env:PNP_CLIENTID = $newClientId
    Write-Host "✓ Registered. Client ID: $newClientId (set as `$env:PNP_CLIENTID for this session)" -ForegroundColor Green
    Write-Host "  To persist across sessions, add to your shell profile:" -ForegroundColor Green
    Write-Host "    `$env:PNP_CLIENTID = `"$newClientId`"" -ForegroundColor Green
    Write-Host ""

    return $newClientId
}

# ponytail: Submit-PnPSearchQuery's row objects aren't documented as hashtable vs.
# PSObject across PnP.PowerShell versions, so check both shapes before giving up.
function Get-PnPSearchRowValue {
    param($Row, [string]$Name)
    if ($Row -is [System.Collections.IDictionary] -and $Row.Contains($Name)) { return $Row[$Name] }
    if ($Row.PSObject.Properties.Name -contains $Name) { return $Row.$Name }
    return $null
}

<#
.SYNOPSIS
    Signs in to a tenant's root site, then lets the caller search for the target site by
    name instead of hand-typing/pasting a full site URL — avoids the class of error where a
    stray space or typo in a pasted URL breaks the tenant-name regex.

.DESCRIPTION
    Connects once to https://<TenantName>.sharepoint.com, then repeatedly prompts for a
    search term and lists matching sites (SharePoint search, no tenant-admin role needed —
    just whatever the signed-in user can already see). A brand-new site can take time to be
    crawled and show up in search, so a full URL can be pasted at the same prompt as an
    escape hatch — same for search errors (e.g. missing Sites.Search.All consent).

    Reconnecting to the chosen site afterward (the caller's job, same as before) reuses the
    token PnP already cached for this login, so it normally won't prompt for sign-in again.
#>
function Select-PnPSiteUrl {
    param(
        [Parameter(Mandatory)][string]$TenantName,
        [Parameter(Mandatory)][string]$ClientId
    )

    $TenantName = ConvertTo-TenantPrefix -TenantName $TenantName
    $rootUrl = "https://$TenantName.sharepoint.com"
    Write-Host "Signing in to $rootUrl..." -ForegroundColor Cyan
    Connect-PnPOnline -Url $rootUrl -Interactive -ClientId $ClientId -ErrorAction Stop
    Write-Host "✓ Connected" -ForegroundColor Green

    while ($true) {
        Write-Host ""
        $searchTerm = Read-CleanHost "Search for a site by name (or paste a full site URL directly)"
        if (-not $searchTerm) { continue }
        if ($searchTerm -match '^https://') { return $searchTerm }

        try {
            $results = Submit-PnPSearchQuery -Query "contentclass:STS_Site Title:*$searchTerm*" `
                -SelectProperties "Title", "Path" -MaxResults 10 -ErrorAction Stop
        } catch {
            Write-Host "Site search failed: $_" -ForegroundColor Yellow
            Write-Host "Paste the full site URL instead:" -ForegroundColor Yellow
            $manualUrl = Read-CleanHost "Site URL"
            if ($manualUrl) { return $manualUrl }
            continue
        }

        $rows = $results.ResultRows
        if (-not $rows -or $rows.Count -eq 0) {
            Write-Host "No sites found matching '$searchTerm'." -ForegroundColor Yellow
            Write-Host "A brand-new site can take a while to appear in search — paste its full URL instead if you know it." -ForegroundColor Yellow
            continue
        }

        for ($i = 0; $i -lt $rows.Count; $i++) {
            $title = Get-PnPSearchRowValue -Row $rows[$i] -Name 'Title'
            $path = Get-PnPSearchRowValue -Row $rows[$i] -Name 'Path'
            Write-Host "  $($i + 1). $title" -ForegroundColor Cyan
            Write-Host "     $path" -ForegroundColor Gray
        }
        Write-Host ""
        $choice = Read-CleanHost "Select a site number (or press Enter to search again)"
        if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $rows.Count) {
            return Get-PnPSearchRowValue -Row $rows[[int]$choice - 1] -Name 'Path'
        }
    }
}

<#
.SYNOPSIS
    Ensures a document library exists and a nested folder path inside it exists, creating
    whatever's missing one level at a time (Add-PnPFolder only creates a single level per
    call). Returns the full library-relative path (e.g. "Brand Assets/logos/png") so the
    caller can pass it straight to Add-PnPFile -Folder.
#>
function Initialize-PnPFolderPath {
    param(
        [Parameter(Mandatory)][string]$LibraryName,
        [string]$RelativePath = ""
    )

    if (-not (Get-PnPList -Identity $LibraryName -ErrorAction SilentlyContinue)) {
        New-PnPList -Title $LibraryName -Template DocumentLibrary -ErrorAction Stop | Out-Null
    }

    $current = $LibraryName
    foreach ($segment in ($RelativePath -split '[\\/]' | Where-Object { $_ })) {
        $parent = $current
        $current = "$current/$segment"
        if (-not (Get-PnPFolder -Url $current -ErrorAction SilentlyContinue)) {
            Add-PnPFolder -Name $segment -Folder $parent -ErrorAction Stop | Out-Null
        }
    }
    return $current
}
