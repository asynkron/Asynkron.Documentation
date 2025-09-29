---
sidebar_position: 7
sidebar_label: Management API
---

# Management API

The HTTP management endpoints mirror the Azure Durable Functions experience so you can start, query, and control orchestrations with simple HTTP calls.

## Add the controllers

```csharp title="Program.cs"
using Asynkron.DurableFunctions.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDurableFunctions(builder.Configuration);
builder.Services.AddDurableFunctionsManagement(options =>
{
    options.BaseUrl = "https://your-app"; // used when generating management URLs in responses
});

var app = builder.Build();
app.UseRouting();
app.UseDurableTraceContext(); // keeps incoming trace IDs attached to orchestrations
app.MapControllers();
```

You can also register just the service (`AddDurableFunctionsManagementService`) if you prefer to expose your own endpoints.

## Endpoints

All routes live under `/runtime/orchestrations`.

| Method & path | Description |
| --- | --- |
| `POST /start/{orchestratorName}` | Starts a new orchestration instance. Returns the generated instance ID and helper URLs. |
| `GET /{instanceId}` | Fetches status, runtime state, and (optionally) history. |
| `POST /{instanceId}/raiseEvent/{eventName}` | Delivers an external event to a waiting orchestrator. |
| `POST /{instanceId}/terminate` | Terminates a running orchestration with a custom reason. |
| `DELETE /{instanceId}` | Purges state and history for the specified instance. |

Example start request:

```bash
curl -X POST "https://localhost:5001/runtime/orchestrations/start/ProcessOrder" \
     -H "Content-Type: application/json" \
     -d '{"input": {"orderId": "123"}}'
```

The response includes `statusQueryGetUri`, `sendEventPostUri`, and other convenience links so automation scripts can follow up without hard-coding routes.

## Tracing

When you enable OpenTelemetry, the controllers emit spans such as `Management.StartOrchestration`, `Management.GetStatus`, and `Management.RaiseEvent`. Make sure `UseDurableTraceContext()` runs before `MapControllers()` so W3C trace headers flow from the incoming request into the orchestrator state.
