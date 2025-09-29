---
sidebar_position: 5
sidebar_label: Configuration
---

# Configuration

The configuration system mirrors modern ASP.NET Core conventions. Bind strongly typed options, validate them on startup, and the runtime refuses to boot if something important is missing.

## Register options with validation

```csharp title="Program.cs"
using Asynkron.DurableFunctions.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDurableFunctions(builder.Configuration); // registers runtime + validates options
```

Configuration lives under the `DurableFunctions` section. The defaults are production-friendly, but you can override the properties that matter.

```json title="appsettings.json"
{
  "DurableFunctions": {
    "Storage": {
      "Provider": "PostgreSQL",
      "PostgreSQL": {
        "ConnectionString": "Host=localhost;Database=durablefunctions;Username=user;Password=pass;SSL Mode=Require;",
        "RequireSsl": true,
        "ValidateConnectivity": true
      }
    },
    "Runtime": {
      "HostId": "worker-01",
      "LeaseTimeout": "00:00:30",
      "LeaseRenewalInterval": "00:00:10",
      "PollingInterval": "00:00:00.100",
      "MaxConcurrentOrchestrations": 100
    },
    "Security": {
      "MaxInputSize": 65536,
      "MaxSerializationDepth": 32,
      "ValidateInputs": true
    }
  }
}
```

Validation catches typos (for example, missing `HostId` or invalid connection strings) during startup rather than at 3 a.m. in production.

## Runtime options

| Option | Why it matters |
| --- | --- |
| `HostId` | Identifies the worker in logs and lease records. Must be unique across all hosts. |
| `LeaseTimeout` & `LeaseRenewalInterval` | Control multi-host safety. Shorter leases recover faster after crashes; longer leases reduce database churn. |
| `PollingInterval` | Lower values reduce latency but increase database load. The default `100ms` is a good starting point. |
| `MaxConcurrentOrchestrations` | Limit to protect downstream systems. When set, the runtime pauses polling when the limit is reached. |

## Storage providers

| Provider | When to use | Key settings |
| --- | --- | --- |
| `SQLite` | Local development, embedded appliances, or lightweight single-node deployments. | `ConnectionString` must include `Data Source`. Combine with `Cache=Shared` and `Journal Mode=WAL` when multiple workers share a file. |
| `PostgreSQL` | Production-grade clusters that need high availability and observability. | Provide a full connection string. Enable SSL (`RequireSsl`) and optionally set `ValidateConnectivity` to true to fail fast when credentials are wrong. |
| `InMemory` | Tests and throwaway prototypes. | No extra configuration. Data is lost on restart. |

Both relational providers migrate the schema automatically. With concurrency stores the following columns appear in the `DurableFunctionStates` table: `Version`, `LeaseOwner`, `LeaseExpiresAt`. Indexes back these columns so lease lookups stay fast.

## Security limits

Durable workflows often accept large payloads. Apply limits to keep requests reasonable and guard against runaway recursion.

- `MaxInputSize` – rejects payloads larger than the configured number of bytes.
- `MaxSerializationDepth` – prevents deserialising deeply nested JSON structures.
- `ValidateInputs` – enable to perform schema validation and reject invalid payloads before execution.

Combine these with web-host level limits (for example, Kestrel request size limits) for layered defence.
