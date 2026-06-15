# Test Strategy & Coverage Policy — ChessOS Pro

## 1. Coverage Targets & Pipelines
We enforce strict coverage constraints. The CI/CD pipeline will fail immediately if these thresholds are violated:

| Metric | Target | Verification Tool |
|--------|--------|-------------------|
| **Unit Coverage** | >= 90% | Vitest Coverage |
| **Branch Coverage** | >= 90% | Vitest Coverage |
| **Function Coverage**| >= 95% | Vitest Coverage |
| **Critical Paths** | 100% | Playwright E2E |

---

## 2. Testing Typology

### Unit Tests (Vitest)
Targeting core algorithms: minimax scoring heuristics, SM-2 calculation schedules, FEN mirroring mappings, and coordinate validations.

### Integration Tests (Vitest)
Targeting controller response states, authentication JWT guards, and Cloudflare D1 database queries.

### End-to-End Tests (Playwright)
Testing active student flows:
- Authenticating, opening Guided Puzzle, and completing the 7 steps.
- Calculation lab opacity fading, clicks, and coordinate reviews.

### Visual Regression Tests (Playwright Screenshots)
Comparing visual layouts to baseline cards to ensure no UI breakage during changes.

### Accessibility Tests (axe-core)
Automated lighthouse accessibility checks in CI.

---

## 3. Automation Scripts
Execute standard make definitions to run tests locally:
- `make verify` - Runs complete code checks and test coverage verification.
- `make test-coverage` - Generates HTML reporting of coverage in `coverage/index.html`.
