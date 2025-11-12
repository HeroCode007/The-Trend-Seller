# -------------------------------
# One-shot Next.js Dev Optimizer
# -------------------------------

Write-Host "Cleaning project..."

# Remove node_modules
if (Test-Path .\node_modules) {
    Remove-Item -Recurse -Force .\node_modules
    Write-Host "Removed node_modules"
}

# Remove lock files if exist
Remove-Item -Force .\package-lock.json, .\yarn.lock -ErrorAction SilentlyContinue
Write-Host "Removed lock files"

# Remove .next cache
if (Test-Path .\.next) {
    Remove-Item -Recurse -Force .\.next
    Write-Host "Removed .next cache"
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Set environment variable to skip type checking (optional but faster)
$env:NEXT_PUBLIC_SKIP_TYPE_CHECK="true"
Write-Host "Type checking skipped for faster dev"

# Start Next.js dev server with Turbopack
Write-Host "Starting Next.js dev server with Turbopack..."
npx next dev --turbo
