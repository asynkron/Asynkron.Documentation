---
sidebar_position: 1
sidebar_label: Overview
title: Asynkron.Jsome
---

# Asynkron.Jsome

Asynkron.Jsome is a .NET 8 global tool that turns Swagger 2.0/OpenAPI documents or directories full of JSON Schema files into strongly typed client artefacts. The open-source repository now includes the complete CLI, Handlebars template library, and test suite, so you can inspect exactly how DTOs, validators, Protocol Buffers schemas, F# modules, and TypeScript interfaces are produced.

## Key capabilities at a glance

- Generate idiomatic C# DTOs backed by either Newtonsoft.Json or System.Text.Json, with optional record types and Swashbuckle metadata.
- Emit FluentValidation validators, enums/constants, Protocol Buffers `.proto` files, F# records/modules, and TypeScript interfaces from the same schema input.
- Customise output with YAML/JSON configuration files, template overrides, and helper functions exposed by the CLI.
- Validate schema and configuration mismatches up front with detailed Spectre.Console diagnostics driven by the included test harness.

## Project links

- Source repository: [asynkron/Asynkron.Jsome](https://github.com/asynkron/Asynkron.Jsome)

## Install the CLI

Install or update the NuGet global tool (`dotnet-jsome`) to put the `jsome` executable under `~/.dotnet/tools`:

```bash
# Install the latest CLI (requires .NET 8 runtime/SDK)
dotnet tool install -g dotnet-jsome

# Update an existing installation
# dotnet tool update -g dotnet-jsome
```

After installation, ensure `~/.dotnet/tools` is on your `PATH` so your shell can resolve `jsome`.

## Getting Started

```bash
# 1. Generate from the embedded Petstore sample (no arguments required)
jsome

# 2. Target your own Swagger file and choose where artefacts are written
jsome generate ./sample-swagger.json --output ./generated --namespace Sample.Generated

# 3. Opt into modern records, System.Text.Json, Swashbuckle metadata, and Protocol Buffers
jsome generate ./sample-swagger.json \
  --modern --records --system-text-json --swashbuckle-attributes \
  --proto --output ./generated
```

Behind the scenes `Program.CreateGenerateCommand` wires these switches via System.CommandLine, validates mutually exclusive inputs (for example `swaggerFile` versus `--schema-dir`), and displays a Spectre.Console summary before files are emitted. Add `--yes` to skip the confirmation prompt when overwriting an existing directory.

### Sample input and generated C#

```json title="sample-swagger.json"
{
  "swagger": "2.0",
  "info": { "title": "Sample API", "version": "1.0.0" },
  "definitions": {
    "User": {
      "type": "object",
      "required": ["id", "name"],
      "properties": {
        "id":   { "type": "integer", "format": "int64" },
        "name": { "type": "string" },
        "email":{ "type": "string", "format": "email" }
      }
    }
  }
}
```

```csharp title="Generated record (modern C#)"
// Attributes line up with System.Text.Json and Swashbuckle when the relevant flags are set
[method: JsonConstructor]
public partial record User(
    [property: JsonPropertyName("id")]
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: SwaggerSchema(Format = "int64")]
    required long Id,

    [property: JsonPropertyName("name")]
    [property: Required(AllowEmptyStrings = false)]
    required string Name,

    [property: JsonPropertyName("email")]
    [property: JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    [property: SwaggerSchema(Format = "email")]
    string? Email
);
```

`ModernCSharpFeaturesTests`, `SystemTextJsonTests`, and `ProtoTemplateTests` in the public test suite cover the attribute placement, nullable annotations, and Protocol Buffers output so you can trust the generated artefacts stay consistent release to release.

## Consuming JSON Schema directories

Supply `--schema-dir` to parse every `.json` schema under a folder:

```bash
# Merge individual JSON Schema files into a single generation run
jsome generate --schema-dir ./schemas --namespace Sample.Generated --output ./generated
```

`JsonSchemaParser.ParseDirectory` merges definitions, resolves `$ref` entries, and halts when conflicting shapes are discovered. The `JsonSchemaParserTests` and OCPP fixtures bundled with the repository demonstrate how large schema sets are handled safely.

## Deep dives

- Read the [configuration guide](configuration.md) to discover every YAML/JSON switch, validation hook, and CLI flag that shapes the generated object graph.
- Explore [Handlebars template customization](templates.md) for frontmatter metadata, helper functions, and strategies for layering in your own outputs alongside the built-in DTO/validator set.

## Command-line reference

| Option | Description |
| --- | --- |
| `swagger-file` | Optional positional path; omit it to use the built-in Petstore sample. |
| `--schema-dir <folder>` | Consume an entire directory of JSON Schema files. |
| `--config <file>` | Apply YAML/JSON configuration overrides before generation. |
| `--output <folder>` | Destination directory (omit to stream files to STDOUT). |
| `--namespace <name>` | Override the root namespace/module for generated artefacts. |
| `--modern` | Enable nullable reference types, `required` keyword, and modern annotations. |
| `--records` | Emit C# records instead of classes (requires `--modern`). |
| `--system-text-json` | Swap Newtonsoft.Json attributes for System.Text.Json equivalents. |
| `--swashbuckle-attributes` | Add `SwaggerSchema` metadata for Swashbuckle integration. |
| `--proto` | Emit Protocol Buffers templates alongside C#. |
| `--templates <files...>` | Render an explicit list of template files. |
| `--template-dir <folder>` | Load templates from a custom directory. |
| `--yes` | Skip confirmation prompts when overwriting files. |
| `--help` | Display detailed CLI usage information. |

## Repository tour and tests

Clone `https://github.com/asynkron/Asynkron.Jsome` to inspect the source that powers the tool:

- `src/Asynkron.Jsome` hosts the CLI entry point (`Program`), `HandleGenerateCommand`, configuration types, template loader, and schema parsers.
- `tests/Asynkron.Jsome.Tests` exposes the xUnit suite that exercises Roslyn compilation, locale edge cases, and template overrides. Fixtures such as `OcppV16IntegrationTests`, `ModernCSharpFeaturesTests`, `SystemTextJsonTests`, and `ProtoTemplateTests` map directly to the CLI switches described above.
- `testdata` and `schemas` include larger, real-world API specifications (Stripe, OCPP 1.6) so you can experiment locally or extend coverage.

Run the test suite to validate template or configuration changes:

```bash
# Restore, build, and execute the published xUnit suite
dotnet test
```

`CodeGenerationTests`, `CompilationValidationTests`, and `LocaleIssueTests` ensure that generated artefacts continue to compile, enforce validation rules, and respect invariant culture semantics. Use them as guardrails when customising templates or wiring in new output formats.

Grab the repo, install the tool, and iterate on templates or configs with confidence—the full pipeline from schema ingestion to generated code is transparent and covered by tests.
