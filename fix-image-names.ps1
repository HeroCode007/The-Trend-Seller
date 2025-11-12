# ----------------------------------------
# Sync image filenames with products.js
# ----------------------------------------

Write-Host "Checking image names in products.js..."

# Correct path to products.js
$productFile = ".\lib\products.js"

# Folder where images are stored
$imageFolder = ".\public\images"

# Extract image filenames from products.js
$usedImages = Select-String -Path $productFile -Pattern '/images/([^'']+)' | ForEach-Object {
    $_.Matches.Groups[1].Value
}

if ($usedImages.Count -eq 0) {
    Write-Host "No image references found in products.js"
    exit
}

Write-Host "Found $($usedImages.Count) image references"

# Rename files to match exactly
foreach ($img in $usedImages) {
    $expectedPath = Join-Path $imageFolder $img
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($img)
    $ext = [System.IO.Path]::GetExtension($img)

    # Check for matching file ignoring case
    $actualFile = Get-ChildItem $imageFolder | Where-Object {
        $_.BaseName -ieq $baseName -and $_.Extension -ieq $ext
    }

    if ($actualFile) {
        $actualPath = $actualFile.FullName
        if ($actualFile.Name -ne $img) {
            Rename-Item -Path $actualPath -NewName $img -Force
            Write-Host "Renamed $($actualFile.Name) -> $img"
        }
    } else {
        Write-Host "Image not found for: $img"
    }
}

Write-Host "Image name synchronization complete!"
