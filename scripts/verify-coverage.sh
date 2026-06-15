#!/bin/sh
set -e
echo "=== Running Frontend Test Coverage ==="
# Run vitest coverage execution
npm --prefix frontend run test:coverage

echo "=== Verifying Test Coverage Thresholds ==="
node -e '
const fs = require("fs");
const summary = JSON.parse(fs.readFileSync("frontend/coverage/coverage-summary.json"));
const pct = summary.total;

console.log("Statements coverage: " + pct.statements.pct + "% (Required: >=90%)");
console.log("Lines coverage: " + pct.lines.pct + "% (Required: >=90%)");
console.log("Branches coverage: " + pct.branches.pct + "% (Required: >=90%)");
console.log("Functions coverage: " + pct.functions.pct + "% (Required: >=95%)");

if (pct.statements.pct < 90) { console.error("Error: Statement coverage is below 90%"); process.exit(1); }
if (pct.lines.pct < 90) { console.error("Error: Line coverage is below 90%"); process.exit(1); }
if (pct.branches.pct < 90) { console.error("Error: Branch coverage is below 90%"); process.exit(1); }
if (pct.functions.pct < 95) { console.error("Error: Function coverage is below 95%"); process.exit(1); }

console.log("All coverage thresholds satisfied successfully.");
'
