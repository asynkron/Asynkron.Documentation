---
sidebar_position: 3
sidebar_label: .NET Aspire Integration
title: .NET Aspire Integration
---

# Using TraceLens with .NET Aspire

TraceLens ships a dedicated NuGet package that wires the collector, PostgreSQL, and PlantUML containers into a .NET Aspire distributed application model. The helper also forwards OpenTelemetry traffic from your Aspire services to the TraceLens collector so you can observe your apps without extra configuration glue.

## Install the integration package

Add the [`TraceLens.Aspire`](https://www.nuget.org/packages/TraceLens.Aspire/) package (version `4.0.0` at the time of writing) to your Aspire project. The package references the Aspire hosting and PostgreSQL components, JetBrains annotations, and the Microsoft logging abstractions that the lifecycle hook uses.

```xml title="TraceLens.Aspire.csproj"
<PropertyGroup>
  <PackageId>TraceLens.Aspire</PackageId>
  <Version>4.0.0</Version>
</PropertyGroup>
<ItemGroup>
  <PackageReference Include="Aspire.Hosting" Version="8.2.1" />
  <PackageReference Include="Aspire.Hosting.PostgreSQL" Version="8.2.1" />
  <PackageReference Include="JetBrains.Annotations" Version="2023.3.0" />
  <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
</ItemGroup>
```

The package sets `IsPackable` and `GeneratePackageOnBuild` so you can build the helper locally if you prefer to consume it from source instead of NuGet. That can be useful when you need to customize the defaults for your organization.

## Register TraceLens in your Aspire app

Call `AddTraceLens` on the distributed application builder. By default the helper exposes the UI on port `5001`, the OpenTelemetry endpoint on port `4317`, and the PlantUML server on port `8080`. Feel free to override the UI and PlantUML ports if they conflict with existing services on your machine.

```csharp title="Program.cs"
var builder = DistributedApplication.CreateBuilder(args);

// Adds PostgreSQL, PlantUML, and the TraceLens container to the Aspire model.
var traceLens = builder.AddTraceLens(tracelensPort: 5001, plantUmlPort: 8080);

// Register the rest of your Aspire resources here.
var apiService = builder.AddProject<Projects.Api>("api");

builder.Build().Run();
```

Behind the scenes the helper attaches a lifecycle hook that injects the `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable into each Aspire project resource. That ensures services automatically export telemetry to the TraceLens collector without needing to duplicate environment variable configuration in every project.

## When to customize the defaults

- **External PlantUML** – Call `traceLens.WithEnvironment("PlantUml__RemoteUrl", ...)` after adding the resource when you host your own PlantUML server or need to point at an internal appliance.
- **Existing PostgreSQL** – If you build the helper from source, remove the `.AddPostgres("tracelenspgsql")` call and supply your own connection string via `.WithEnvironment("ConnectionStrings__DefaultConnection", ...)` so TraceLens connects to your managed database.
- **Alternative port mapping** – Change the `tracelensPort` and `plantUmlPort` parameters if you already expose services on the default ports or want to lock down access for specific environments.

Use Aspire dashboards to confirm that TraceLens started successfully, and then generate requests in your application to see the traces appear inside the TraceLens UI.
