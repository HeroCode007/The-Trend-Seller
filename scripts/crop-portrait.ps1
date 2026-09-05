Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "trend-seller-automation\avatar-ads\assets\saif-avatar-base.jpg"
$destPath = Join-Path (Split-Path $srcPath) "saif-avatar-portrait.jpg"

$src = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image: $($src.Width) x $($src.Height)"

# Face and chest region (crop upper portion with head and shoulders)
# The image is 576x1024 (or similar vertical)
$cropX = [int]($src.Width * 0.15)
$cropY = [int]($src.Height * 0.02)
$cropWidth = [int]($src.Width * 0.70)
$cropHeight = [int]($cropWidth * 1.25) # 4:5 portrait ratio for avatar engines

if (($cropY + $cropHeight) -gt $src.Height) {
    $cropHeight = $src.Height - $cropY
}

$rect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropWidth, $cropHeight
$bmp = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$graphics.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $cropWidth, $cropHeight), $rect, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$graphics.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Host "Successfully generated portrait avatar crop: $destPath ($cropWidth x $cropHeight)"
