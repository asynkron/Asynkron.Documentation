---
sidebar_position: 8
sidebar_label: Observability
---

# Observability

The runtime emits both traces and metrics via `System.Diagnostics`. Hook those signals into your monitoring stack to see orchestration lifecycles, activity timings, and management calls.

## Distributed tracing

OpenTelemetry support is baked in through the `Asynkron.DurableFunctions` activity source.

```csharp title="Program.cs"
using OpenTelemetry.Trace;

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddSource("Asynkron.DurableFunctions")
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddConsoleExporter()); // swap for Jaeger, OTLP, etc.

var app = builder.Build();
app.UseDurableTraceContext(); // capture incoming traceparent headers
```

Key spans:

- `orchestration.start` / `orchestration.complete` – emitted around each orchestrator execution.
- `orchestration.call` – wraps every activity or sub-orchestrator call.
- `orchestration.event.receive` – recorded when an external event is delivered.
- `state.save`, `state.load`, `state.remove` – track persistence operations.
- `Management.*` – emitted by the HTTP management controllers.

Add a sampler if you need to reduce trace volume:

```csharp
tracing.SetSampler(new TraceIdRatioBasedSampler(0.1)); // capture 10% of traces
```

## Metrics

The runtime uses a `Meter` named `Asynkron.DurableFunctions`. Attach your exporter of choice.

```csharp title="MetricsExample.cs"
services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddMeter("Asynkron.DurableFunctions")
        .AddPrometheusExporter());
```

Notable instruments:

| Metric | Type | What it tells you |
| --- | --- | --- |
| `orchestrations.started` / `completed` / `failed` | Counter | Volume and health of orchestrations per function name and host. |
| `orchestrations.duration` | Histogram | Execution time distribution, great for SLOs. |
| `functions.calls` / `functions.failures` | Counter | Activity throughput and failure rate. |
| `state.save.duration` | Histogram | Persistence latency. Spikes usually indicate storage contention. |
| `lease.active_count` | UpDownCounter | Number of orchestration leases currently held; helps spot runaway hosts. |

Expose the metrics endpoint (for example, `/metrics` via the Prometheus exporter) so your monitoring system can scrape it.
