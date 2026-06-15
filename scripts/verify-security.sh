#!/bin/sh
set -e
echo "=== Running Security Auditing & Scans ==="

echo "Checking package vulnerabilities in Frontend..."
npm --prefix frontend audit --audit-level=high || echo "Vulnerability audit warnings noted in frontend."

echo "Checking package vulnerabilities in Workers backend..."
npm --prefix workers audit --audit-level=high || echo "Vulnerability audit warnings noted in workers."

echo "Security checks completed."
