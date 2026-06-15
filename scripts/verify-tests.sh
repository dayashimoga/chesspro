#!/bin/sh
set -e
echo "=== Running Frontend Tests (Vitest) ==="
npm --prefix frontend run test
echo "=== All Tests Completed Successfully ==="
