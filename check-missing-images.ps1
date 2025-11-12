# ----------------------------------------
# Check missing or mismatched images
# ----------------------------------------

Write-Host "Checking image references in products.js..."

# Path to products.js
$productFile = ".\lib\products.js"

# Folder where images are stored
$imageFolder = ".\public\images"

# Get all image references from products.js
$usedImages = Select-String -Path $productFile -Pattern '/images/([^'']+)' | ForEach-Object {
    $_.Matches.Groups[1].Value
}

# Get all actual images in public/images
$actualImages = Get-ChildItem $imageFolder | ForEach-Object { $_.Name }

# Compare and find missing images
$missing = $usedImages | Where-Object { $actualImages -notcontains $_ }

if ($missing.Count -eq 0) {
    Write-Host "All images exist and match exactly. No issues found."
} else {
    Write-Host "Missing or mismatched images:"
    foreach ($img in $missing) {
        Write-Host "- $img"
    }
    Write-Host ""
    Write-Host "⚠ Please rename or add these images to $imageFolder exactly as listed above."
}
