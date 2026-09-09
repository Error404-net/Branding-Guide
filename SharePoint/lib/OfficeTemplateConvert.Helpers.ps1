<#
.SYNOPSIS
    Converts a regular Office document to a real Office template (.docx -> .dotx,
    .pptx -> .potx, .xlsx -> .xltx) so it actually shows up in the OfficeTemplateLibrary
    New-document gallery. Dot-source, don't run directly.

.DESCRIPTION
    A .dotx/.potx/.xltx differs from its .docx/.pptx/.xlsx counterpart in exactly one way:
    a content-type declaration inside the OOXML zip package's [Content_Types].xml, on the
    Override entry for the main document/presentation/workbook part. Nothing else about the
    file format changes. This edits that one string and renames the extension — verified
    against this repo's actual office-templates/*.docx and *.pptx files.

    Source files are never modified — always copy to a scratch directory first and pass
    that copy in as -Path, or call via ConvertTo-OfficeTemplateFile which does this for you.
#>

$script:OfficeTemplateContentTypeMap = @{
    '.docx' = @{
        Extension = '.dotx'
        From      = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'
        To        = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml'
    }
    '.pptx' = @{
        Extension = '.potx'
        From      = 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'
        To        = 'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml'
    }
    '.xlsx' = @{
        Extension = '.xltx'
        From      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'
        To        = 'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml'
    }
}

<#
.SYNOPSIS
    Copies $Path into $DestinationDirectory, converting it to template format (.dotx/.potx/
    .xltx) if it's a convertible Office document. Any other file type (e.g. .thmx, a file
    already in template format) is copied through unchanged. Returns the resulting path.
#>
function ConvertTo-OfficeTemplateFile {
    param(
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][string]$DestinationDirectory
    )

    $ext = [System.IO.Path]::GetExtension($Path).ToLowerInvariant()
    $map = $script:OfficeTemplateContentTypeMap[$ext]
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($Path)

    if (-not $map) {
        $destPath = Join-Path $DestinationDirectory (Split-Path -Leaf $Path)
        Copy-Item -Path $Path -Destination $destPath -Force
        return $destPath
    }

    $destPath = Join-Path $DestinationDirectory "$baseName$($map.Extension)"
    Copy-Item -Path $Path -Destination $destPath -Force

    Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction SilentlyContinue
    $zip = [System.IO.Compression.ZipFile]::Open($destPath, [System.IO.Compression.ZipArchiveMode]::Update)
    try {
        $entry = $zip.GetEntry('[Content_Types].xml')
        if (-not $entry) {
            throw "'$Path' has no [Content_Types].xml — not a valid OOXML package."
        }

        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()

        if ($content -notmatch [regex]::Escape($map.From)) {
            throw "Expected content type not found in '$Path' — its internal format may have changed since this was written; conversion aborted rather than guessing."
        }
        $content = $content -replace [regex]::Escape($map.From), $map.To

        $entry.Delete()
        $newEntry = $zip.CreateEntry('[Content_Types].xml')
        $writeStream = $newEntry.Open()
        $writer = New-Object System.IO.StreamWriter($writeStream)
        $writer.Write($content)
        $writer.Close()
        $writeStream.Close()
    } finally {
        $zip.Dispose()
    }

    return $destPath
}
