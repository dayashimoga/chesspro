# ChessOS Pro Enterprise — Makefile Hooks

.PHONY: setup start stop start-backend stop-backend lint format test-unit test-e2e test-coverage verify up down

# Setup dependencies for frontend and workers via Docker
setup:
	@echo "Installing frontend dependencies inside docker container..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npm install
	@echo "Installing workers backend dependencies inside docker container..."
	docker run --rm -v $(CURDIR):/app -w /app/workers node:22-alpine npm install

# Start using docker-compose (recommended)
up:
	docker compose up -d

# Stop using docker-compose
down:
	docker compose down

# Start the frontend dev server in background
start:
	@echo "Starting local frontend dev server environment on port 3105..."
	docker run -d --name chessos-frontend-dev -v $(CURDIR):/app -w /app/frontend -p 3105:3105 node:22-alpine npx vite --host 0.0.0.0 --port 3105

# Stop the frontend dev server
stop:
	docker stop chessos-frontend-dev 2>/dev/null || true
	docker rm chessos-frontend-dev 2>/dev/null || true

# Start the workers backend api locally in background
start-backend:
	@echo "Starting local workers API dev server on port 8787..."
	docker run -d --name chessos-backend-dev -v $(CURDIR):/app -w /app/workers -p 8787:8787 node:22-alpine npx wrangler dev --ip 0.0.0.0

# Stop the backend dev server
stop-backend:
	docker stop chessos-backend-dev 2>/dev/null || true
	docker rm chessos-backend-dev 2>/dev/null || true

# Run ESLint validation checks
lint:
	@echo "Checking codebase quality linters..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npm run lint

# Run TypeScript type checking
typecheck:
	@echo "Running TypeScript type checker..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npx tsc --noEmit

# Format code with Prettier
format:
	@echo "Auto-formatting codebase files..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npx prettier --write .

# Run Unit tests via Vitest
test-unit:
	@echo "Running Vitest test execution..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npx vitest run

# Run E2E tests via Playwright
test-e2e:
	@echo "Running Playwright E2E browser tests..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend mcr.microsoft.com/playwright:v1.49.0-noble npx playwright test

# Generate coverage reporting metrics
test-coverage:
	@echo "Generating Vitest coverage reports..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npx vitest run --coverage

# Complete validation task
verify:
	@echo "Starting full platform verification suite..."
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-tests.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-coverage.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-security.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-performance.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-accessibility.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-docs.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-architecture.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-deployment.sh
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine sh scripts/verify-release.sh
	@echo "All verification pipelines completed successfully!"
