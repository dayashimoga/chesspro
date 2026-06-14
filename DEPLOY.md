# ChessOS — Cloudflare Pages Deployment Guide

## Quick Deploy (3 Steps)

### 1. Push to GitHub
```bash
# Initialize git and push
git init
git add .
git commit -m "ChessOS v1.0 — Chess Mastery Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chessos.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `npm install && npx vite build`
   - **Build output directory:** `dist`
   - **Node.js version:** `22` (set in Environment Variables: `NODE_VERSION` = `22`)
5. Click **Save and Deploy**

### 3. Done!
Your site will be live at `https://chessos.pages.dev` (or your custom domain).

## Custom Domain (Optional)
1. In Cloudflare Pages project settings → **Custom Domains**
2. Add your domain (e.g., `chessos.yourdomain.com`)
3. Cloudflare handles SSL automatically

## Environment Variables
No environment variables needed — the app is fully static and client-side.

## Build Details
- Build time: ~1 second
- Output size: ~240KB (gzipped: ~70KB)
- No server-side code — pure static files
- All chess logic runs client-side
- Progress stored in browser localStorage

## SPA Routing Fix
For hash-based routing (which ChessOS uses), no special configuration is needed.
All routes work automatically since they use `#` prefixed paths.

## Updating
Simply push to your GitHub `main` branch. Cloudflare Pages automatically rebuilds and deploys.
