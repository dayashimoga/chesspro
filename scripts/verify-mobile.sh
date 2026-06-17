#!/bin/sh
# ChessOS Pro Mobile Scaffolding & Build Verification Script

set -e

echo "=== Starting ChessOS Mobile Codebase & Build Validation ==="

FILES="
android/pubspec.yaml
android/lib/main.dart
android/android/app/build.gradle
android/android/app/src/main/AndroidManifest.xml
android/android/app/src/main/kotlin/com/chessos/pro/MainActivity.kt
android/android/app/src/main/res/values/styles.xml
android/android/app/src/main/res/drawable/launch_background.xml
android/android/app/src/main/res/drawable/ic_launcher.xml
android/android/app/debug.keystore
android/Dockerfile
android/build-apk.ps1
android/build-apk.sh
"

ALL_PASSED=true

for FILE in $FILES; do
    if [ -f "$FILE" ]; then
        echo "✅ Found: $FILE"
    else
        echo "❌ Missing critical mobile component: $FILE"
        ALL_PASSED=false
    fi
done

ASSETS="
android/assets/images/.gitkeep
android/assets/puzzles/.gitkeep
android/assets/openings/.gitkeep
android/assets/fonts/chess-pieces.ttf
"

for ASSET in $ASSETS; do
    if [ -f "$ASSET" ]; then
        echo "✅ Found asset: $ASSET"
    else
        echo "❌ Missing placeholder asset: $ASSET"
        ALL_PASSED=false
    fi
done

if [ "$ALL_PASSED" = "true" ]; then
    echo "🎉 Mobile integrity verification PASSED successfully!"
    exit 0
else
    echo "😭 Mobile integrity verification FAILED. Please resolve missing assets/configs."
    exit 1
fi
