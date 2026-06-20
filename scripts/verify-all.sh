#!/bin/sh
# ChessOS Pro Complete Platform Verification Suite
set -e

echo "================================================================="
echo "=== STARTING FULL CHESSOS PRO PLATFORM VALIDATION SUITE ==="
echo "================================================================="

echo ""
echo "1. Running Frontend TypeScript Type Checks..."
npm --prefix frontend run typecheck

echo ""
echo "2. Running ESLint Code Quality Audits..."
npm --prefix frontend run lint

echo ""
echo "3. Running Vitest Unit & Integration Tests..."
npm --prefix frontend run test

echo ""
echo "4. Verifying Features Scaffolding..."
sh scripts/verify-features.sh

echo ""
echo "5. Validating Content Databases..."
sh scripts/verify-content.sh

echo ""
echo "6. Auditing Security Policies..."
sh scripts/verify-security.sh

echo ""
echo "7. Verifying Performance Thresholds..."
sh scripts/verify-performance.sh

echo ""
echo "8. Auditing Accessibility (A11y)..."
sh scripts/verify-accessibility.sh

echo ""
echo "9. Checking Documentation Completeness..."
sh scripts/verify-docs.sh

echo ""
echo "10. Auditing Architecture & Dependency Structure..."
sh scripts/verify-architecture.sh

echo ""
echo "11. Validating Deployment Specifications..."
sh scripts/verify-deployment.sh

echo ""
echo "12. Validating Mobile Parity & Configurations..."
sh scripts/verify-mobile.sh

echo ""
echo "13. Checking Release Manifest & Bundles..."
sh scripts/verify-release.sh

echo ""
echo "================================================================="
echo "🎉 ALL CHESSOS PRO PIPELINES AND AUDITS VERIFIED SUCCESSFUL! 🎉"
echo "================================================================="
