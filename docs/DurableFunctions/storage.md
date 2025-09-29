---
sidebar_position: 6
sidebar_label: Storage backends
---

# Storage backends

Durable orchestrations need persistent state for the event history, timers, and orchestration metadata. The public repository includes ready-to-run examples for both SQLite and PostgreSQL.

## SQLite

Use SQLite when you need a self-contained database. The example runs entirely in-memory, but the same connection string works with file-backed databases as well.

```csharp title="SqliteExample.cs"
var connectionString = "Data Source=:memory:";
using var stateStore = new SqliteStateStore(connectionString, loggerFactory.CreateLogger<SqliteStateStore>());
var runtime = new DurableFunctionRuntime(stateStore, logger, loggerFactory: loggerFactory);
```

Recommendations:

- Enable `Cache=Shared;Journal Mode=WAL;` when multiple worker processes share the same `.db` file.
- Switch to `ConcurrentSqliteStateStore` for multi-host safety; it adds versioning columns and handles leases for you.
- Back up the `.db` file or use a network share if you need durability beyond the local disk.

## PostgreSQL

PostgreSQL is the preferred option when you deploy to Kubernetes or run several orchestrator hosts. The guide ships with a Docker Compose file that bootstraps PostgreSQL 16 and pgAdmin.

```bash
docker-compose up -d
```

Connect with the default credentials:

- Host: `localhost`
- Port: `5432`
- Database: `durablefunctions`
- Username: `durableuser`
- Password: `durablepass`

Wire it into your host using the extension methods.

```csharp title="PostgreSqlExample.cs"
builder.Services.AddDurableFunctionsWithPostgreSQL(connectionString, options =>
{
    options.PollingIntervalMs = 100;
    options.MaxConcurrentWorkflows = 10;
});
```

When the app starts, the provider ensures the schema exists. Concurrency-aware stores add `version`, `lease_owner`, and `lease_expires_at` columns plus the indexes they require.

## Schema hygiene

Both relational providers support automatic cleanup:

- Completed orchestrations are removed when `DurableOrchestrationOptions.AutoDeleteOnCompletion` is enabled.
- Use the HTTP management API `DELETE /runtime/orchestrations/{instanceId}` to purge on demand.
- Keep an eye on the `DurableFunctionStates` table size. If it grows beyond expectations, check for orchestrations that never complete or forget to release leases.
