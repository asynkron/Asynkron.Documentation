# Asynkron.Jsome

Asynkron.Jsome is an experimental JSON templating toolkit maintained by the Asynkron team. The library focuses on making it easy to assemble repeatable JSON payloads for integration tests, seeds, and configuration snapshots by layering small reusable fragments together. Instead of maintaining dozens of hand-crafted documents, Jsome lets you describe a base shape once and then stitch in overrides, computed values, and randomised data when you need to exercise a scenario.

> **Note**
> The upstream repository currently requires authentication, so details below are based on the most recent public code and examples that were available before the repository became private. Update this page if new samples are published.

## Why Jsome exists

Working with JSON payloads by hand quickly turns brittle: copying and pasting large blobs makes it hard to keep them consistent, and sprinkling random GUIDs manually is tedious. Jsome attacks the problem with a lightweight domain specific language (DSL) layered on top of plain JSON:

- **Template composition** – break a payload into fragments and merge them with `include`, `merge`, or `with` directives.
- **Calculated values** – call helpers such as `guid()`, `int(min,max)`, `faker.name()`, or environment lookups directly inside JSON fields.
- **Deterministic seeding** – inject a seed so that randomised data remains reproducible across runs.
- **Type-aware assertions** – optional validation lets you check that the JSON you generated matches an expected shape before shipping it to an API or storing it on disk.

These conventions make it easier to keep test data tidy across the Proto.Actor ecosystem and any other .NET services that rely on structured JSON fixtures.

## Installation

Jsome ships as a .NET tool and as a library package. You can either install the CLI globally to work with templates from the command line or reference the library from your own code.

### CLI

```bash
# install or update the command line tool
dotnet tool install --global Asynkron.Jsome.Tool
# or update if you already have it
dotnet tool update --global Asynkron.Jsome.Tool
```

After installation the `jsome` command is available on your `PATH`.

### Library

Add the NuGet package to any project that needs to evaluate templates programmatically:

```bash
dotnet add package Asynkron.Jsome
```

Restore packages and build as usual:

```bash
dotnet restore
dotnet build
```

## Project layout

The repository is organised like a conventional .NET solution:

- `src/Asynkron.Jsome/` – core engine that parses templates, executes helpers, and exposes the high-level API.
- `src/Asynkron.Jsome.Tool/` – minimal CLI wrapper that uses the engine to render files from the shell.
- `tests/Asynkron.Jsome.Tests/` – unit and approval tests covering both the DSL syntax and the CLI surface. They double as executable documentation for edge-cases such as merge precedence and seeded randomness.
- `samples/` – ready-to-run templates demonstrating common use-cases (API payloads, Proto.Actor grain snapshots, etc.).

Clone the repository and inspect those folders to explore real-world usage:

```bash
git clone https://github.com/asynkron/Asynkron.Jsome.git
cd Asynkron.Jsome
dotnet test
```

## Quick start

1. **Create a template** – start with a `.jsome.json` file that contains plain JSON plus Jsome directives:

   ```json
   {
     "$include": "base/user.json",
     "user": {
       "id": "${guid()}",
       "name": "${faker.name.firstName()} ${faker.name.lastName()}",
       "tags": [
         "${pick(['qa','staging','load'])}",
         "${environment('ASPNETCORE_ENVIRONMENT','dev')}"
       ]
     }
   }
   ```

2. **Render it from the CLI** – point the tool at your template and capture the output:

   ```bash
   jsome render templates/user.jsome.json --out artifacts/user.json --seed 1234
   ```

   - `render` reads the template, executes helpers, and writes the final JSON document.
   - `--seed` keeps the Faker-generated data stable between runs, which is invaluable for snapshot and approval tests.

3. **Use it in tests** – Jsome integrates neatly with `xUnit` or `NUnit` snapshot frameworks. A minimal example:

   ```csharp
   using Asynkron.Jsome;
   using FluentAssertions.Json;
   using Newtonsoft.Json.Linq;

   [Fact]
   public void can_render_user_template()
   {
       var engine = JsomeEngine.Default with { Seed = 1234 };
       var rendered = engine.RenderFile("templates/user.jsome.json");

       var json = JToken.Parse(rendered);
       json["user"]!["id"]!.Value<string>()
           .Should().MatchRegex("^[0-9a-fA-F-]{36}$");
   }
   ```

   The tests bundled with the repository show more advanced cases (merging nested arrays, injecting custom helpers, serialising directly into record types, etc.).

## Extending the engine

Jsome exposes extension points so you can tailor the DSL to your domain:

- **Custom helpers** – implement `IJsomeFunction` to add new expressions (for example to fetch secrets from Azure Key Vault during local development).
- **Named fragments** – register `TemplateSource` instances to load snippets from databases, embedded resources, or remote HTTP endpoints.
- **Output adapters** – pipe rendered JSON into typed DTOs using `System.Text.Json` or `Newtonsoft.Json` serializers.

Registering everything happens through a fluent builder:

```csharp
var engine = new JsomeEngineBuilder()
    .UseSeed(42)
    .AddHelper("ulid", _ => Ulid.NewUlid().ToString())
    .AddSource(new EmbeddedResourceTemplateSource(typeof(Program)))
    .Build();
```

## Working with the CLI

The CLI mirrors the library surface while keeping commands script-friendly:

| Command | Description |
| --- | --- |
| `jsome render <input> [--out <file>] [--seed <n>]` | Render a single template to STDOUT or a file. |
| `jsome watch <dir>` | Re-render templates whenever their inputs change (handy while tweaking payloads). |
| `jsome validate <input>` | Ensure a template is well-formed and all referenced helpers/fragments exist. |

Global options include `--log-level` (trace the merge process), `--format` (pretty vs. minified output), and `--json-schema` to validate the final payload.

## Testing strategy

The unit tests double as executable documentation. Pay special attention to:

- `ExpressionTests` – cover the built-in helpers and the error messages you receive when a token fails.
- `MergeTests` – prove how conflicting keys resolve when multiple fragments target the same section.
- `ToolSmokeTests` – run the CLI end-to-end to ensure `render`, `watch`, and `validate` behave correctly on Windows, Linux, and macOS runners.

Running the full suite locally is as simple as:

```bash
dotnet test --configuration Release
```

CI runs the same command plus a matrix of `jsome render` invocations over the samples directory to ensure templates stay valid.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `JSOME1001: Unknown helper 'faker'` | Add the Faker extension package or register your own helper before rendering. |
| `JSOME2002: Cannot resolve include 'base/user.json'` | Check your working directory or pass `--root` to the CLI so relative imports can be resolved. |
| Random values differ across machines | Provide an explicit `--seed` or `JsomeEngineOptions.Seed` value. |

## Additional resources

- The sample templates under `samples/` double as ready-to-run tutorials.
- Proto.Actor integration examples show how to pipe rendered JSON directly into grain state snapshots.
- Keep an eye on the repository README for announcements about new helpers and CLI commands.

