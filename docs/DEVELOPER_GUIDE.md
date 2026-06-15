# Developer Setup & Contribution Guide — ChessOS Pro

This document outlines instructions for local development, testing, and deployment.

---

## 1. Prerequisites
- **Docker** (to run node, npm, and wrangler commands without local installations).
- **Git**

---

## 2. Local Environment Setup

Since ChessOS follows a zero-local-dependency guideline, all tooling runs inside Docker containers.

### Initial Setup
To pull standard image dependencies and install packages:
```bash
# Windows PowerShell / CMD
docker run --rm -v ${PWD}:/app -w /app/frontend node:22-alpine npm install
docker run --rm -v ${PWD}:/app -w /app/workers node:22-alpine npm install
```

### Running the Frontend Dev Server
To spin up the Vite development server (mapping port 3105):
```bash
docker run --name chessos-frontend -d --rm -v ${PWD}:/app -w /app/frontend -p 3105:3105 node:22-alpine npm run dev -- --host 0.0.0.0
```
Open `http://localhost:3105` in your browser.

### Running the Workers API locally
To run wrangler dev to test the API endpoints locally:
```bash
docker run --name chessos-backend -d --rm -v ${PWD}:/app -w /app/workers -p 8787:8787 node:22-alpine npx wrangler dev --ip 0.0.0.0
```
This runs the local API server on `http://localhost:8787`.

---

## 3. Testing & Coverage Analysis

To execute unit and integration test suites:
```bash
docker run --rm -v ${PWD}:/app -w /app/frontend node:22-alpine npx vitest run
```

To run coverage audits:
```bash
docker run --rm -v ${PWD}:/app -w /app/frontend node:22-alpine npx vitest run --coverage
```

---

## 4. Code Quality & Formatting
To validate linter checks:
```bash
docker run --rm -v ${PWD}:/app -w /app/frontend node:22-alpine npm run lint
```

To auto-format code using Prettier:
```bash
docker run --rm -v ${PWD}:/app -w /app/frontend node:22-alpine npx prettier --write .
```
