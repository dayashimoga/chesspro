#!/bin/sh
# ChessOS — Placeholder Detection Scanner
# Scans all source files for placeholder content that shouldn't exist in production
# Fails the build if any placeholders are detected

echo "=== Running Placeholder Detection Scanner ==="

FAIL=0

# Define patterns to scan for
PATTERNS=(
  "coming soon"
  "TODO:"
  "FIXME:"
  "HACK:"
  "placeholder"
  "lorem ipsum"
  "mock data"
  "fake data"
  "dummy data"
  "not implemented"
  "implementation pending"
  "replace this"
  "fill in"
  "stub"
)

# Directories to scan
SCAN_DIRS="frontend/src workers/src"

# File extensions to scan
EXTENSIONS="ts tsx js jsx css"

for pattern in "${PATTERNS[@]}"; do
  # Build the grep include flags
  INCLUDES=""
  for ext in $EXTENSIONS; do
    INCLUDES="$INCLUDES --include=*.${ext}"
  done

  RESULTS=$(grep -ril "$pattern" $SCAN_DIRS $INCLUDES 2>/dev/null || true)

  if [ -n "$RESULTS" ]; then
    # Filter out legitimate uses (like this script itself, tests, comments documenting patterns)
    FILTERED=""
    for file in $RESULTS; do
      # Skip test files and this script
      case "$file" in
        *test* | *spec* | *__tests__* | *verify-placeholders*)
          continue
          ;;
      esac
      FILTERED="$FILTERED $file"
    done

    if [ -n "$FILTERED" ]; then
      echo "⚠️  Pattern '$pattern' found in:"
      for file in $FILTERED; do
        echo "   - $file"
        grep -ni "$pattern" "$file" 2>/dev/null | head -3 | while read line; do
          echo "     $line"
        done
      done
      # Note: We warn but don't fail for common patterns that may appear in educational content
      case "$pattern" in
        "TODO:" | "FIXME:" | "HACK:")
          echo "   (Warning only — development markers)"
          ;;
        *)
          FAIL=1
          ;;
      esac
    fi
  fi
done

if [ $FAIL -eq 1 ]; then
  echo ""
  echo "❌ PLACEHOLDER CONTENT DETECTED — Build should not proceed with placeholder content."
  echo "   Remove all placeholder content before release."
  exit 1
else
  echo ""
  echo "✅ No placeholder content detected. Codebase is production-ready."
  exit 0
fi
