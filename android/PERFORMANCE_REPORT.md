# AI Engine Performance Report

Generated automatically on: 2026-06-22T08:32:13.729084

## Performance Targets & Latency Benchmarks

| Difficulty | Target Latency | Measured (Avg) | Status |
| --- | --- | --- | --- |
| Difficulty 1 | <100ms | 3ms | ✅ PASS |
| Difficulty 2 | <300ms | 10ms | ✅ PASS |
| Difficulty 3 | <800ms | 75ms | ✅ PASS |
| Difficulty 4 | <1500ms | 958ms | ✅ PASS |
| Difficulty 5 | N/A | 10519ms | ❌ FAIL |

## Analysis Details
- Evaluated 3 distinct board states (Starting, Middlegame, and Tactical positions).
- Search algorithm uses Alpha-Beta pruning, Move Ordering, and Transposition Table cache.
- Memory usage and CPU utilization remain highly optimized due to the persistent Isolate background worker.
