---
sidebar_position: 5
sidebar_label: Reference
---

# Configuration reference

This appendix summarizes ports, environment variables, and configuration schema sections for Asynkron.OtelMcp.

## Ports

| Service | Default port | Protocol |
| --- | --- | --- |
| OTLP gRPC ingest | `4317` | gRPC |
| OTLP HTTP ingest | `4318` | HTTP |
| MCP API | `7443` | HTTPS |
| Admin UI | `7600` | HTTPS |

## Environment variables

- `OTELMCP_STORAGE_URL` – Primary storage endpoint.
- `OTELMCP_MCP_TOKEN` – Shared secret for MCP clients.
- `OTELMCP_FEATURE_FLAGS` – Comma-separated feature toggles.

## Collector blocks

```yaml
exporters:
  clickhouse:
    endpoint: https://example.telemetry.internal
    auth:
      username: ${CLICKHOUSE_USERNAME}
      password: ${CLICKHOUSE_PASSWORD}
processors:
  batch:
    timeout: 5s
    send_batch_size: 1024
receivers:
  otlp:
    protocols:
      grpc:
      http:
```

Refer to the OpenTelemetry Collector documentation for additional receivers and processor options.
