# Load & Stress Testing Specification — ChessOS Pro

This document specifies the guidelines, load parameters, and stress testing targets for the ChessOS Pro application.

---

## 1. Load Simulation Profiles

We simulate user traffic using automated HTTP load generators to test system performance at scale:

| Profile | Target Users | Type | Target Throughput | Acceptable Error Rate |
|---------|--------------|------|-------------------|-----------------------|
| **Baseline Load** | 100 concurrent users | Daily average traffic | 150 requests/sec | < 0.01% |
| **Peak Load** | 500 concurrent users | Weekly peak traffic | 750 requests/sec | < 0.05% |
| **Stress Threshold** | 1000 concurrent users | High event load | 1500 requests/sec | < 0.10% |
| **Exhaustion Limit** | 5000 concurrent users | DDoS / Viral traffic | 7500 requests/sec | < 1.00% |

---

## 2. Metrics & Targets

During load tests, the system must adhere to these limits:

- **CPU Utilization (Workers)**: Automated execution scaling prevents edge CPU thread saturation.
- **D1 Read/Write Limits**: Database reads are optimized via query caches to prevent SQLite/D1 connection locks.
- **Latency under stress (1000 users)**:
  - Average latency: < 200ms
  - P95 latency: < 400ms
  - P99 latency: < 750ms

---

## 3. Resilience & Chaos Scenarios

To verify system stability during partial infrastructure outages, the following chaos conditions are simulated:
- **D1 Database Latency Spikes**: Backend handles query retries with exponential backoff.
- **Worker Crashes**: Web client gracefully recovers from connection drops and switches to local offline analysis mode.
- **Stockfish Worker Failure**: If browser Stockfish worker fails to load, client falls back to pure minimax local calculations to ensure zero user disruption.
