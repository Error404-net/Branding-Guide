ERROR404.NET — SharePoint Deployment Scripts
====================================================================
Three independent PowerShell scripts for deploying the Error404 brand
assets to a Microsoft 365 / SharePoint tenant. All tenant-agnostic --
every tenant-specific value is a required parameter/prompt, so the
same scripts work against any org's tenant.

FILES
-----
Deploy-Interactive.ps1
    Uploads error404-sharepoint-template-store.html and builds a Site
    Page that embeds it. Result: a browsable page on the target site
    -- click a link to see/download templates. Needs: site owner or
    member.

Register-OrgTemplateLibrary.ps1
    Creates a "Templates" library, uploads office-templates/* into it,
    registers it tenant-wide via PnP's Add-PnPOrgAssetsLibrary. Result:
    templates appear in the File > New gallery in Word/Excel/
    PowerPoint, tenant-wide. Needs: SharePoint Administrator or Global
    Administrator. PnP only -- no Windows-only dependency.

Deploy-BrandAssets.ps1
    Uploads logos/, entra-m365/, email-templates/, social/, discord/,
    obs/, assets/ into a "Brand Assets" library, mirroring local folder
    structure (deduped, see FORMAT GOTCHA below). Plain browsable
    library -- not Office-template-gallery content, so it's separate
    from Register-OrgTemplateLibrary.ps1. Optional -RegisterCdnOrigin
    puts it on the Public CDN; see CDN below. Needs: site owner or
    member for the upload, SharePoint Administrator or Global
    Administrator only if -RegisterCdnOrigin is used.

lib/PnPConnect.Helpers.ps1
    Shared helpers dot-sourced by both scripts above -- not run
    directly. Resolves the Entra ID app client ID (registering one
    interactively if none is configured), then signs in to the tenant
    root and lets you search for the target site by name instead of
    hand-typing a full site URL.

lib/OfficeTemplateConvert.Helpers.ps1
    Dot-sourced by Register-OrgTemplateLibrary.ps1 only -- not run
    directly. Converts .docx/.pptx/.xlsx to real template format
    (.dotx/.potx/.xltx) before upload; see FORMAT GOTCHA below.

These scripts are complementary, not alternatives -- run one or both
depending on what you want.

PREREQUISITES
-------------
  PowerShell 7+ (pwsh)                          both scripts
  PnP.PowerShell                                 both scripts, only dependency

    Install-Module PnP.PowerShell -Force

Each script checks for this on startup and prints the install command
if it's missing. Deliberately PnP-only, not the classic
Microsoft.Online.SharePoint.PowerShell ("SharePoint Online Management
Shell") module -- that one is Windows-only (built on .NET Framework)
and does not work on macOS/Linux PowerShell 7 at all, even though
`Install-Module` for it succeeds there. PnP.PowerShell has its own
equivalents (Add-PnPOrgAssetsLibrary etc.) for everything that module
would otherwise be needed for, so it's never required here.

ONE-TIME SETUP PER TENANT: ENTRA ID APP REGISTRATION
------------------------------------------------------
Microsoft retired the shared multi-tenant "PnP Management Shell" app
in September 2024. Every tenant now needs its own Entra ID app
registration for Connect-PnPOnline -Interactive to work -- without one
you'll see:

    > Please specify a valid client id for an Entra ID App
      Registration.

You don't need to do this manually -- both scripts detect a missing
client ID and offer to register one for you interactively (needs
Global Admin). It prints an Application (client) ID and sets
$env:PNP_CLIENTID for the rest of the session.

To do it yourself instead, or to reuse one client ID across a shell
profile or CI environment:

    Register-PnPEntraIDAppForInteractiveLogin -ApplicationName "PnP.PowerShell" -Tenant <tenant>.onmicrosoft.com
    $env:PNP_CLIENTID = "<the id it printed>"

Resolution order in both scripts: -ClientId <id> parameter >
$env:PNP_CLIENTID > interactive registration prompt. One app
registration per tenant is enough -- reuse the same client ID for
every script, every run, against that tenant.

USAGE
-----
Deploy-Interactive.ps1

    ./Deploy-Interactive.ps1
    ./Deploy-Interactive.ps1 -ClientId "<id>"

    Prompts for a tenant name (e.g. 'contoso'), signs in once, then
    prompts for a search term and lists matching sites to pick from --
    no need to hand-type/paste a full site URL. A full URL can still
    be pasted at that same prompt (needed for a brand-new site search
    hasn't indexed yet). After picking, prompts for page
    name/title/visitor group/theme.

    The page gets a link to the uploaded HTML, not the page inline --
    Add-PnPPageWebPart's embed-webpart JSON schema isn't reliably
    documented, so this doesn't guess at it. For a true inline embed,
    add an "Embed" web part yourself in the page editor using the
    EMBED CODE this script prints at the end.

    Answering 'c' or 'd' at the theme prompt registers a tenant-wide
    theme (Add-PnPTenantTheme) -- needs a second sign-in to tenant
    admin, SharePoint Administrator or Global Administrator -- and
    makes it selectable on every site in the tenant (Site Settings >
    Change the look), not just this one:

      c / corporate  "Error404-Corporate" -- B&W, IsInverted=false
      d / digital    "Error404-Digital"   -- Arcade New Wave color,
                                             IsInverted=true

    Both palettes are defined in the script regardless of which one
    you pick this run, so re-running with the other letter registers
    the second one without re-doing anything -- a tenant ends up with
    both available as options over two runs (or one run per theme).
    Palette values come straight from this repo's own already
    contrast-verified tokens (DESIGN.md Section 1), not a generated
    tint ramp.

Register-OrgTemplateLibrary.ps1

    ./Register-OrgTemplateLibrary.ps1
        Prompts for a tenant name, then the same search-and-pick flow
        as above; uploads ./office-templates into a "Templates"
        library on the chosen site.

    ./Register-OrgTemplateLibrary.ps1 -TenantName "contoso"
        Skips the tenant-name prompt, still runs the site picker.

    ./Register-OrgTemplateLibrary.ps1 `
        -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide" `
        -LocalTemplatesPath "./contoso-templates" `
        -DestinationFolder "Contoso"
        Non-interactive: -SiteUrl skips tenant prompt and site picker
        entirely (scripted/repeat runs, CI).

    ./Register-OrgTemplateLibrary.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide" -SkipUpload
        Registration only, skip the upload.

Deploy-BrandAssets.ps1

    ./Deploy-BrandAssets.ps1
        Prompts for a tenant name, then the same search-and-pick flow
        as above; uploads logos/, entra-m365/, email-templates/,
        social/, discord/, obs/, assets/ into a "Brand Assets" library,
        mirroring local folder structure.

    ./Deploy-BrandAssets.ps1 -RegisterCdnOrigin
        Same, then also registers the library as a Public CDN origin.
        See CDN below before using this -- it makes those files
        anonymously readable over the internet.

    ./Deploy-BrandAssets.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/BrandGuide" `
        -Folders @('logos', 'social') -LibraryName "Resources"
        Non-interactive, and only two of the folders.

PARAMETERS (Register-OrgTemplateLibrary.ps1)
-----------------------------------------------
-SiteUrl              default: (none -- runs the tenant/search picker)
    The OAL/Brand Center site -- all org asset libraries (images,
    templates, fonts) must live on this one site. Pass it directly to
    skip the tenant-name prompt and site picker entirely.

-TenantName           default: prompts if -SiteUrl is also omitted
    Short tenant name (e.g. 'contoso'), used to sign in and search for
    the site. Ignored if -SiteUrl is passed.

-ClientId             default: $env:PNP_CLIENTID
    See Entra ID app registration above.

-LibraryName          default: Templates
    Document library name on that site.

-OrgAssetType         default: OfficeTemplateLibrary
    Also: ImageDocumentLibrary, OfficeFontLibrary, BrandKitLibrary.

-CdnType              default: Public
    Brand Center requires Public CDN.

-LocalTemplatesPath   default: ./office-templates next to this script
    Local folder to upload. A non-default path that doesn't exist is
    an error; the default silently skips upload if absent.

-DestinationFolder    default: (library root)
    Optional subfolder inside the library, e.g. Templates/Contoso.

-SkipUpload           default: off
    Registration only.

-SkipConversion       default: off
    Upload .docx/.pptx/.xlsx as-is instead of converting to template
    format first. See FORMAT GOTCHA below -- normally leave this off.

-ThumbnailUrl         default: (gray card)
    Background image for the library's card in the file picker.

FORMAT GOTCHA
-------------
Only true Office template files show up in the New-document gallery:
.dotx (Word), .xltx (Excel), .potx (PowerPoint). Plain .docx/.xlsx/
.pptx upload fine but won't appear there -- it's a single content-type
string inside the OOXML zip package, nothing else differs.

Handled automatically: when -OrgAssetType is OfficeTemplateLibrary (the
default), every .docx/.pptx/.xlsx in the upload is converted to a real
template on the fly before upload -- your local source files are never
touched, only the uploaded copy changes. Disable with -SkipConversion
if you'd rather upload the originals unmodified.

PARAMETERS (Deploy-BrandAssets.ps1)
------------------------------------
-SiteUrl / -TenantName / -ClientId
    Same as Register-OrgTemplateLibrary.ps1 above.

-LibraryName          default: Brand Assets
    Document library name on that site. Separate from the "Templates"
    library Register-OrgTemplateLibrary.ps1 creates -- this one is a
    plain browsable library, not an Office-template gallery source.

-SourceRoot           default: this repo's root (one level up from
                      SharePoint/)
    Where -Folders are resolved from.

-Folders              default: logos, entra-m365, email-templates,
                      social, discord, obs, assets
    Which top-level folders to upload, recursively, mirroring their
    local structure inside -LibraryName. office-templates/ is
    deliberately not in this list -- see FILES above.

-ExcludeRelativePaths default: obs/assets/logos
    Relative paths (prefix-matched) to skip. The default skips a
    byte-for-byte duplicate of assets/ that lives under obs/ for OBS's
    own use -- see obs/README.txt.

-RegisterCdnOrigin    default: off
    See CDN below. A real access-scope change, not a convenience
    toggle -- stays off unless you explicitly ask for it.

CDN
---
CDN is per-library, not per-site or automatic. Registering an OAL
library (Register-OrgTemplateLibrary.ps1, -CdnType Public) makes it a
CDN origin; a plain library created any other way (Deploy-BrandAssets.ps1
without -RegisterCdnOrigin) is not on the CDN and requires a SharePoint
login to view, full stop -- including for scripts, embeds, and any
external client.

That matters here specifically: some of what's in "Brand Assets" is
meant to be fetched by things that cannot authenticate to SharePoint at
all -- the Discord theme CSS is loaded directly by the Discord client,
and email templates reference images that need to render in recipients'
email clients. Neither works from a normal (non-CDN) library URL; both
need Public CDN.

-RegisterCdnOrigin on Deploy-BrandAssets.ps1 handles this: registers
"<site>/<LibraryName>" as a Public CDN origin (Add-PnPTenantCdnOrigin),
enabling Public CDN tenant-wide first if it isn't already (it likely
already is, from Register-OrgTemplateLibrary.ps1's OAL registration).
Requires SharePoint Administrator or Global Administrator and a second
sign-in to tenant admin, same as the theme step in Deploy-Interactive.ps1.

This makes every file in the library anonymously readable by anyone on
the internet with the URL -- appropriate for public brand collateral
(which is what's here, and what's already published in this public
GitHub repo), not for anything that shouldn't be world-readable. Don't
point -Folders/-LibraryName at anything else without considering that.

Once registered, files are reachable at:
    https://public-cdn.sharepointonline.com/<tenant>.sharepoint.com/sites/<site>/<LibraryName>/<path>
(printed by the script after registration). Allow up to 15 minutes to
propagate. The normal SharePoint URL keeps working too (still requires
login) -- the CDN URL is the one to actually hand to Discord, put in
email HTML, etc.

TROUBLESHOOTING
----------------
- "Please specify a valid client id for an Entra ID App Registration"
  -- see the Entra ID section above; you need a client ID for this
  tenant.
- Registration fails with a CDN-related error -- Public CDN isn't
  consented for the tenant yet. Enable via M365 admin center >
  Settings > Org settings > Brand center.
- Add-PnPOrgAssetsLibrary permission errors -- you need SharePoint
  Administrator or Global Administrator; site-owner permission isn't
  enough for that step (it connects to the tenant admin site).
- New library/template changes not visible yet -- Organization Assets
  Library changes can take a couple of hours up to 24 hours to
  propagate to Word/Excel/PowerPoint.
- Site picker finds nothing for a site you know exists -- a brand-new
  site can take a while to be crawled into search. Paste the full
  site URL at the same search prompt instead of a search term.
- Site picker errors instead of searching -- the Entra app may be
  missing the delegated Sites.Search.All permission/consent. Paste
  the full site URL at the same prompt as a workaround; the search
  step is a convenience, not a requirement.
