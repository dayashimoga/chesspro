# build-apk.ps1
# Build the ChessOS Pro Android APK and AAB locally using Docker

$ErrorActionPreference = "Stop"

# Ensure we run in the directory of the script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Checking if Docker daemon is running..." -ForegroundColor Cyan
& docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

Write-Host "Building Docker image 'chessos-mobile-builder'..." -ForegroundColor Cyan
& docker build -t chessos-mobile-builder -f Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker image build failed."
    exit 1
}

Write-Host "Running compilation inside Docker container..." -ForegroundColor Cyan
# Mount current directory to /app in the container
& docker run --rm -v "${PWD}:/app" chessos-mobile-builder

if ($LASTEXITCODE -ne 0) {
    Write-Error "Compilation inside Docker container failed."
    exit 1
}

$sourceApk = Join-Path $PWD "build\app\outputs\flutter-apk\app-release.apk"
$targetApk = Join-Path $PWD "build\app\outputs\flutter-apk\chessos.apk"

$sourceAab = Join-Path $PWD "build\app\outputs\bundle\release\app-release.aab"
$targetAab = Join-Path $PWD "build\app\outputs\flutter-apk\chessos.aab"

$success = $true

if (Test-Path $sourceApk) {
    # Copy and rename to chessos.apk
    Copy-Item -Path $sourceApk -Destination $targetApk -Force
    Write-Host "`n🎉 Success! APK generated and renamed to:" -ForegroundColor Green
    Write-Host "$targetApk" -ForegroundColor Yellow
} else {
    Write-Error "Could not find generated APK at $sourceApk"
    $success = $false
}

if (Test-Path $sourceAab) {
    # Copy and rename to chessos.aab
    Copy-Item -Path $sourceAab -Destination $targetAab -Force
    Write-Host "`n🎉 Success! AAB generated and renamed to:" -ForegroundColor Green
    Write-Host "$targetAab" -ForegroundColor Yellow
} else {
    Write-Error "Could not find generated AAB at $sourceAab"
    $success = $false
}

if (-not $success) {
    exit 1
}
