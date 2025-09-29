---
sidebar_position: 10
sidebar_label: Example catalogue
---

# Example catalogue

Every file in the `Examples` folder is runnable. Use them as living documentation and copy the patterns that match your scenario.

| Example | What it demonstrates |
| --- | --- |
| `Program.cs` | Entry point that chains multiple demos together. Inspect it to see how each scenario is executed. |
| `FunctionCallStateExample` | Classic activity chaining pattern with retry-friendly `context.CallAsync` calls and replay-safe logging. |
| `AutoRegistrationExample` | Attribute-based discovery with `[Function]`, `[OrchestrationTrigger]`, and `[FunctionTrigger]` so you can register entire assemblies via reflection. |
| `SimpleTypedOrchestratorDemo` | Typed orchestrators, typed inputs, and replay-safe logging via `context.GetLogger()`. |
| `ExternalEventsExample` | Human approval workflow that waits for external events and demonstrates event queuing. |
| `TimerOrchestrationExample` | Durable timers for reminders and long sleeps. |
| `SubOrchestratorExample` | Parent orchestrator delegating work to sub-orchestrators and aggregating results. |
| `SqliteExample` | Parallel activity execution, activity result tracking, and querying state directly from the store. |
| `ConcurrentExample` | Multi-host execution against a shared SQLite database, showcasing lease acquisition and renewal. |
| `MetricsExample` | Wiring the OpenTelemetry meter to Prometheus and emitting orchestration metrics. |
| `OpenTelemetryCollectorExample` | Shipping traces to an OpenTelemetry Collector and exporting them to Jaeger/OTLP. |
| `AzureCompatibilityExample` | Running the Azure adapter side-by-side with the core runtime so existing tooling continues to work. |
| `OrchestrationClientExample` | Using `IOrchestrationClient` and the Azure-compatible adapter via dependency injection. |
| `DisposableLeaseExample` | Implementing temporary exclusive access to resources from within orchestrations using the lease helpers. |
| `ChaosEngineeringExample` | (Conditional build) Fault injection and recovery patterns to test resilience. |
| `WebApiExample` and `FullFeaturedWebAppExample` | End-to-end ASP.NET Core hosting, management API routing, and dependency injection setup. |

Clone the `Asynkron.DurableFunctions.Public` repository and run `dotnet run --project Examples` to explore these scenarios locally.
