---
sidebar_position: 4
sidebar_label: Hosting the runtime
---

# Hosting the runtime

You can embed the runtime into anything from a background worker to a full ASP.NET Core application. The examples highlight the patterns that matter in production.

## Minimal console host

Use a console app when you want a single-process worker that owns orchestration execution. `DurableFunctionDemo` shows the bare essentials.

```csharp title="DurableFunctionDemo.cs"
using var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
var logger = loggerFactory.CreateLogger<DurableFunctionRuntime>();

var stateStore = new InMemoryStateStore(); // swap for SQLite or PostgreSQL in production
var runtime = new DurableFunctionRuntime(stateStore, logger, loggerFactory: loggerFactory);

runtime.RegisterJsonFunction("SayHello", (_, input) =>
{
    Console.WriteLine($"Hello, {input}!");
    return Task.FromResult($"Greeted {input}");
});

await runtime.RunAndPollAsync(cts.Token); // polls storage and executes orchestrations
```

The polling loop blocks until the cancellation token is triggered. Wrap it inside a hosted service if you need lifetime management.

## Dependency injection and hosted services

`OrchestrationClientExample` wires everything through the generic host so you can lean on configuration, logging, and health checks.

```csharp title="OrchestrationClientExample.cs"
Host.CreateDefaultBuilder()
    .ConfigureServices(services =>
    {
        services.AddSingleton<IStateStore>(_ => new InMemoryStateStore());

        services.AddSingleton<DurableFunctionRuntime>(provider =>
        {
            var store = provider.GetRequiredService<IStateStore>();
            var logger = provider.GetRequiredService<ILogger<DurableFunctionRuntime>>();

            var runtime = new DurableFunctionRuntime(store, logger);
            RegisterFunctions(runtime); // register orchestrators + activities once
            return runtime;
        });

        services.AddDurableFunctionsManagementService(); // exposes IOrchestrationClient
    });
```

Once registered, inject `DurableFunctionRuntime` to start the polling loop inside a background service, and `IOrchestrationClient` anywhere you need to trigger or query orchestrations.

## Multi-host safety

When several processes share the same database you need coordination so the same instance does not run twice. The concurrency implementation combines optimistic concurrency with short-lived leases.

- `ConcurrentSqliteStateStore` and `ConcurrentPostgreSqlStateStore` automatically add the required schema columns and perform compare-and-swap updates.
- `ConcurrentDurableFunctionRuntime` renews leases in the background and releases them on completion. If a host dies, leases expire and another worker picks up the instance safely.

You can opt in by swapping the runtime and state store types:

```csharp
var store = new ConcurrentSqliteStateStore("Data Source=functions.db", loggerFactory.CreateLogger<ConcurrentSqliteStateStore>());
var runtime = new ConcurrentDurableFunctionRuntime(store, loggerFactory.CreateLogger<ConcurrentDurableFunctionRuntime>(), loggerFactory: loggerFactory);
```

Stick to these types whenever you deploy more than one worker.

## Mixing with Azure-compatible clients

Need to reuse existing tooling that expects Azure Durable Functions interfaces? The adapter in `OrchestrationClientExample` bridges the gap.

```csharp title="OrchestrationClientExample.cs"
services.AddSingleton<IDurableOrchestrationClient>(provider =>
{
    var coreClient = provider.GetRequiredService<IOrchestrationClient>();
    return new DurableOrchestrationClientAdapter(coreClient);
});
```

This lets you run the lightweight Asynkron runtime locally while keeping compatibility with scripts or dashboards that speak the Azure interfaces.
