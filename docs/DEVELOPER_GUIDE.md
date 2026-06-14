# Developer Setup & Contribution Guide — ChessOS Pro

## 1. Development Prerequisites
- **Docker** v20+ (for launching containers without local node/npm).
- **Git** v2.25+

---

## 2. Local Environment Setup
To initialize and boot up the development server locally, execute:
```bash
make setup
```
This triggers Docker container composition, installs dependencies, and runs the database seed.

### Running Dev Servers
To launch the Vite frontend and NestJS backend servers concurrently in background:
```bash
make start
```
Servers will bind as follows:
- Frontend Client: `http://localhost:3105`
- Backend API Gateway: `http://localhost:3000`

---

## 3. Testing & Coverage Analysis
To execute the testing suites locally:
- **Unit and Integration Tests (Vitest):**
  ```bash
  make test-unit
  ```
- **End-to-End Tests (Playwright):**
  ```bash
  make test-e2e
  ```
- **Coverage Audits:**
  Verify that the Vitest reports show:
  - Unit Coverage >= 90%
  - Branch Coverage >= 90%
  - Function Coverage >= 95%

---

## 4. Code Quality & Formatting
- **Linter Checks:** Run ESLint across all files: `make lint`
- **Formatter Auto-Fix:** Format JS/TS source files with Prettier: `make format`
