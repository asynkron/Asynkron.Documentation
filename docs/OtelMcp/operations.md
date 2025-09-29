---
sidebar_position: 4
sidebar_label: Operations
title: Operations
---

# Operating Asynkron.OtelMcp

Keep the collector, storage, and query services reliable as telemetry volume grows.

## Scaling guidance

- **Collectors** – Run at least three replicas with pod anti-affinity and autoscaling on CPU and queue depth.
- **Storage** – Choose between bundled ClickHouse, managed data warehouses, or your existing observability lake. Partition by tenant, service, and time.
- **Ingestion gateways** – Terminate TLS at the edge and enforce rate limits per API token.

## Maintenance tasks

- Rotate API keys and MCP credentials.
- Compact or archive cold data based on retention policies.
- Upgrade collectors with rolling deployments, validating compatibility with your exporters.

Use the provided dashboards to track pipeline pressure, batch flush latency, and MCP agent throughput.
