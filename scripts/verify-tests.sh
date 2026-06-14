#!/bin/sh
set -e
echo "=== Running Frontend Tests (Vitest) ==="
npx vitest run --dir frontend/src

echo "=== Running Backend Tests (Jest) ==="
npm --prefix backend run test
