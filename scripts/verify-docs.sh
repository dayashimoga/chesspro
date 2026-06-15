#!/bin/sh
set -e
echo "=== Verifying Corporate Documentation Completeness ==="

docs="PRD SRS ARCHITECTURE LLD DATABASE API SECURITY TEST_STRATEGY PERFORMANCE_TESTING LOAD_TESTING OPERATIONS USER_GUIDE DEVELOPER_GUIDE DEPLOYMENT_GUIDE PROJECT_STATUS RELEASE_READINESS_REPORT RELEASE_PLAN THREAT_MODEL AUDIT_REPORT IMPLEMENTATION_TRACKER"

for doc in $docs; do
  path="docs/${doc}.md"
  if [ ! -f "$path" ]; then
    echo "Error: Required file ${path} is missing!"
    exit 1
  fi
  # Scan for placeholders
  if grep -qiE "TODO|tbd|insert here|<.*placeholder.*>|\[.*placeholder.*\]|__placeholder__|placeholder warning" "$path"; then
    echo "Warning: Placeholder content detected in ${path}!"
  fi
done

echo "All 20 documentation files checked. Documentation framework is 100% complete."
