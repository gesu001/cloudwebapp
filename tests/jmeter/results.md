# JMeter Load Test Evidence

Test plan: `webapp feeds Request.jmx` (Apache JMeter 5.6.3), run from a laptop against the deployed API.

## Thread groups (staged ramp-up)

| Thread Group | Users | Ramp-up |
|---|---|---|
| Thread Group1 | 1 | 1 s |
| Thread Group2 | 10 | 5 s |
| Thread Group3 | 100 | 10 s |
| Thread Group4 | 1000 | 30 s |
| Thread Group5 | 10000 | 60 s |

## Summary report (2026-08-17)

| Label | # Samples | Average (ms) | Min | Max | Std. Dev. | Error % | Throughput | Received KB/sec | Sent KB/sec |
|---|---|---|---|---|---|---|---|---|---|
| HTTP Request1 | 1 | 674 | 674 | 674 | 0.00 | 0.00% | 1.5/sec | 13.78 | 0.2x |
| HTTP Request10 | 10 | 1460 | 5 | 2689 | 689.29 | 10.00% | 1.5/sec | 13.21 | 0.2x |
| HTTP Request100 | 100 | 3104 | 0 | 42092 | 4869.31 | 24.00% | 2.1/sec | 16.21 | 0.24 |
| HTTP Request1000 | 1000 | 12422 | 1 | 42225 | 14790.75 | 32.40% | 13.9/sec | 98.55 | 1.3x |
| HTTP Request10000 | 9797 | 15617 | 0 | 57935 | 15118.01 | 23.10% | 95.1/sec | 735.88 | 10.7x |
| **TOTAL** | **10908** | **15195** | **0** | **57935** | **15097.87** | **23.95%** | **105.7/sec** | **812.11** | **11.8x** |

Notes:
- The 10000-user group reported 9797 samples at the time of capture; the run had not fully drained (top toolbar showed 203/11111 threads still active).
- Add the raw `.jtl` result file and the Summary Report / Aggregate Report / Response Time Graph screenshots to this folder to complete the submission evidence.
