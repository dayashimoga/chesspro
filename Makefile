# ChessOS Pro Enterprise — Makefile Hooks

.PHONY: setup start test-unit test-e2e test-coverage lint format verify

# Setup dependencies via Docker node environment
setup:
	@echo "Installing dependencies inside docker container..."
	docker run --rm -v $(CURDIR):/app -w /app node:22-alpine npm install

# Start concurrently the frontend and backend servers
start:
	@echo "Starting local dev server environment..."
	docker run -d --name chessos-dev -v $(CURDIR):/app -w /app -p 3105:3105 node:22-alpine npx vite --host 0.0.0.0 --port 3105

# Run ESLint validation checks
lint:
	@echo "Checking codebase quality linters..."
	docker run --rm -v $(CURDIR):/app -w /app/frontend node:22-alpine npm run lint

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
	docker run --rm -v $(CURDIR):/app -w /app/frontend npx vitest run --coverage

# Complete validation task
verify: test-unit
	@echo "Verification checks passing successfully!"

