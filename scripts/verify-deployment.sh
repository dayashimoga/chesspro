#!/bin/sh
set -e
echo "=== Verifying Deployment Readiness ==="

# Check frontend build succeeds
echo "Checking frontend build..."
if [ -d "frontend/dist" ]; then
  echo "✓ Frontend dist directory exists"
  
  # Check critical build artifacts
  if [ -f "frontend/dist/index.html" ]; then
    echo "✓ index.html present in build"
  else
    echo "✗ index.html missing from build"
    exit 1
  fi
else
  echo "⚠ Frontend dist not found. Building..."
  cd frontend && npm run build && cd ..
  if [ -d "frontend/dist" ]; then
    echo "✓ Frontend build succeeded"
  else
    echo "✗ Frontend build failed"
    exit 1
  fi
fi

# Check Cloudflare Workers configuration
echo "Checking workers configuration..."
if [ -f "workers/wrangler.toml" ]; then
  echo "✓ wrangler.toml present"
else
  echo "✗ wrangler.toml missing"
  exit 1
fi

# Check database schema
if [ -f "workers/schema.sql" ]; then
  echo "✓ Database schema present"
else
  echo "✗ Database schema missing"
  exit 1
fi

# Check Docker configuration
echo "Checking Docker configuration..."
if [ -f "docker-compose.yml" ]; then
  echo "✓ docker-compose.yml present"
else
  echo "⚠ docker-compose.yml missing (optional)"
fi

if [ -f "Dockerfile.dev" ]; then
  echo "✓ Dockerfile.dev present"
else
  echo "⚠ Dockerfile.dev missing (optional)"
fi

# Check CI/CD pipeline
echo "Checking CI/CD pipeline..."
if [ -f ".github/workflows/ci.yml" ]; then
  echo "✓ GitHub Actions CI pipeline present"
else
  echo "✗ CI pipeline missing"
  exit 1
fi

echo "=== Deployment Readiness Verification Complete ==="
