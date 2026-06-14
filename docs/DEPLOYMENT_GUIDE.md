# Cloudflare Deployment Guide — ChessOS Pro

This guide outlines the steps to build, test, and deploy the ChessOS Pro platform to Cloudflare Pages (Frontend), Workers (API), and D1 (Database).

---

## 1. Local Development Setup

To spin up both frontend and backend locally using Docker:

### Prerequisites
- Docker v20+
- Git

### Build & Run
1. Pull the repository.
2. Initialize database:
   ```bash
   docker run --rm -v ${pwd}:/app -w /app/backend node:22 npx prisma db push
   ```
3. Start the development servers:
   - **Frontend React**: Run on port 3105.
   - **Backend NestJS**: Run on port 3005.

---

## 2. Staging Deployment (Cloudflare Preview)

Every branch push (excluding `main`) triggers automated preview builds:

- **Frontend Pages**: Cloudflare Pages automatically builds changes and serves them under a unique preview URL (e.g. `branch-name.chessos.pages.dev`).
- **Backend Worker**: Deployed to wrangler staging environments:
  ```bash
  npx wrangler deploy --env staging
  ```
- **Database D1**: Preview database migrations are run against the staging D1 database:
  ```bash
  npx wrangler d1 migrations apply staging-db --remote
  ```

---

## 3. Production Deployment (Cloudflare Production)

To deploy the production-ready platform:

1. **Prisma SQLite client build**:
   ```bash
   npm run build
   ```
2. **Deploy Frontend to Cloudflare Pages**:
   Upload the compiled static bundle in `frontend/dist/` directly via the Cloudflare Dashboard or Wrangler CLI:
   ```bash
   npx wrangler pages deploy frontend/dist --project-name chessos-pro
   ```
3. **Deploy Database Schema to Cloudflare D1**:
   ```bash
   npx wrangler d1 migrations apply chessos-db-prod --remote
   ```
4. **Deploy Backend Worker**:
   ```bash
   npx wrangler deploy --env production
   ```
