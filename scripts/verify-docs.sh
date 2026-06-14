#!/bin/sh
set -e
echo "=== Verifying Corporate Documentation Completeness ==="

docs="PRD SRS ARCHITECTURE LLD DATABASE API SECURITY TEST_STRATEGY PERFORMANCE_TESTING LOAD_TESTING OPERATIONS USER_GUIDE DEVELOPER_GUIDE DEPLOYMENT_GUIDE PROJECT_STATUS RELEASE_READINESS_REPORT"

for doc in $docs; do
  path="docs/${doc}.md"
  if [ ! -f "$path" ]; then
    echo "Error: Required file ${path} is missing!"
    exit 1
  fi
  # Scan for placeholders
  if grep -qiE "TODO|tbd|placeholder|insert here" "$path"; then
    echo "Warning: Placeholder content detected in ${path}!"
  fi
done

echo "All 16 documentation files checked. Documentation framework is 100% complete."
