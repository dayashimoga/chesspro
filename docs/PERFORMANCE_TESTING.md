# Performance Testing Specification — ChessOS Pro

This document specifies the performance benchmarks, testing tools, and optimization policies for the ChessOS Pro platform.

---

## 1. Frontend Performance Benchmarks (Lighthouse & Web Vitals)

All client-side applications compiled via Vite must achieve and maintain the following Core Web Vitals thresholds:

| Metric | Target Value | Description |
|--------|--------------|-------------|
| **Lighthouse Score** | >= 95 / 100 | Overall performance, accessibility, best practices, and SEO. |
| **First Contentful Paint (FCP)** | < 1.5s | Time until the browser renders the first piece of DOM content. |
| **Largest Contentful Paint (LCP)** | < 2.5s | Time until the main content of the page is fully loaded. |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Visual stability of the page structure during rendering. |
| **Time to Interactive (TTI)** | < 2.0s | Time until the page becomes fully responsive to user input. |
| **Bundle Size (JS)** | < 300KB (Gzip) | Main application chunk size limit to minimize network delays. |

### Client-Side Optimizations
- **Code Splitting**: Dynamic imports for routes (`Dashboard`, `Lessons`, `Puzzles`) to compile separate lazy-loaded chunks.
- **Asset Compression**: SVG vector rendering for coordinates and chess pieces instead of heavy PNG sprites.
- **Cache Control**: Cloudflare CDN rules cache static assets (`.js`, `.css`, fonts) at the edge.

---

## 2. Backend API Response Benchmarks

NestJS API gateway endpoints are monitored for latency and throughput:

- **P95 Latency**: < 300ms for all authenticated database transaction requests (e.g. login, logging puzzle attempts).
- **P99 Latency**: < 500ms under standard local load testing scenarios.
- **WebSocket Throughput**: Live chess coordinate updates via socket gateway must broadcast to subscribers within < 50ms.

---

## 3. Stockfish Engine Calculation Speeds

To ensure browser thread safety and fast calculation execution during guided solves and analysis:
- **Multi-PV Search Depth**: 15 plies reached within < 800ms for standard middlegame positions.
- **Web Worker Threading**: Stockfish WASM compiled thread runs in a background Web Worker to ensure the browser UI thread maintains a solid 60 FPS refresh rate.
