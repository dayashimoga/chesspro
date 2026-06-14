# Operational Guide — ChessOS Pro

## 1. Cloudflare Pages & Workers Deployment
The application utilizes Cloudflare's serverless edge infrastructure.

### Frontend (Cloudflare Pages)
- Build command: `npm run build` inside `frontend/`
- Output directory: `dist`
- Deploy trigger: Pushing to `main` executes Pages deploy hook.

### Backend Workers (wrangler config)
Deployment command:
```bash
npx wrangler deploy --env production
```
Wrangler environment bindings:
- `D1_DATABASE` - Edge SQL database.
- `R2_BUCKET` - Asset storage.

---

## 2. Telemetry & Monitoring Metrics
To measure site operations and latencies, we configure Cloudflare Analytics:
- **Request Volume:** Total edge requests, errors (5xx/4xx ratios).
- **CPU Time:** Edge execution timings (target < 50ms).
- **Core Web Vitals:** Cumulative Layout Shift (CLS), Largest Contentful Paint (LCP) reported from browser analytics.

---

## 3. Database Backups & Recovery
- **D1 SQL Database Backups:** Automated daily edge snapshots managed in the Cloudflare Dashboard.
- **Manual Backups:** Can be exported via Wrangler CLI tool:
  ```bash
  npx wrangler d1 backup create PRODUCTION_DB
  ```
- **Disaster Recovery Steps:**
  1. Fetch list of snapshots: `npx wrangler d1 backup list PRODUCTION_DB`
  2. Restore chosen version: `npx wrangler d1 backup restore PRODUCTION_DB <BACKUP_ID>`
