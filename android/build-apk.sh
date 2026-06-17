#!/bin/bash
# Build the ChessOS Pro Android APK and AAB locally using Docker

set -e

# Change directory to script directory
cd "$(dirname "$0")"

echo "Checking if Docker daemon is running..."
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Building Docker image 'chessos-mobile-builder'..."
docker build -t chessos-mobile-builder -f Dockerfile .

echo "Running compilation inside Docker container..."
docker run --rm -v "$(pwd):/app" chessos-mobile-builder

SOURCE_APK="build/app/outputs/flutter-apk/app-release.apk"
TARGET_APK="build/app/outputs/flutter-apk/chessos.apk"

SOURCE_AAB="build/app/outputs/bundle/release/app-release.aab"
TARGET_AAB="build/app/outputs/flutter-apk/chessos.aab"

SUCCESS=true

if [ -f "$SOURCE_APK" ]; then
    # Copy and rename to chessos.apk
    cp "$SOURCE_APK" "$TARGET_APK"
    echo -e "\n🎉 Success! APK generated and renamed to:"
    echo "$TARGET_APK"
else
    echo "Error: Could not find generated APK at $SOURCE_APK"
    SUCCESS=false
fi

if [ -f "$SOURCE_AAB" ]; then
    # Copy and rename to chessos.aab
    cp "$SOURCE_AAB" "$TARGET_AAB"
    echo -e "\n🎉 Success! AAB generated and renamed to:"
    echo "$TARGET_AAB"
else
    echo "Error: Could not find generated AAB at $SOURCE_AAB"
    SUCCESS=false
fi

if [ "$SUCCESS" = false ]; then
    exit 1
fi
