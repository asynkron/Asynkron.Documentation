---
sidebar_position: 2
sidebar_label: Configuration
title: Configuration
---

# Configuration

Jsome modifier files let you reshape the generated object graph without mutating incoming Swagger or JSON Schema sources. The configuration layer feeds into `CodeGenerator`, so the same schema can yield different DTO names, validation attributes, and enum handling simply by changing YAML or JSON inputs.

## When to reach for Configuration

- Apply namespaces, name prefixes/suffixes, or enum defaults across an entire run.
- Exclude or rename specific definitions and properties when upstream schemas cannot be altered.
- Override validation ranges, required-ness, or regex patterns while keeping schema definitions canonical.
- Attach richer descriptions and default values that flow directly into Handlebars templates and Swashbuckle metadata.

## File layout

Modifier files expose two top-level sections: `global` defaults and per-path `rules`. Paths are case-insensitive and use dotted notation (`Order.Customer.Email`). Wildcards such as `*.Id` are supported for broad tweaks; the CLI skips wildcard validation so you can apply them intentionally.

```yaml title="config.yaml"
# Global switches run before any template executes
global:
  namespace: "MyCompany.Api"           # Override the generated namespace/module
  generateEnumTypes: true              # Promote integer enums to C# enum types
  defaultInclude: true                 # Include everything unless a rule opts out
  includeDescriptions: true            # Pass through OpenAPI description text
  maxDepth: 10                         # Guard against recursive schemas
  type_name_prefix: "Api"             # Prefix DTO/enum names (applied consistently)
  type_name_suffix: "Dto"             # Suffix DTO/enum names for clarity

# Focused overrides target classes or dotted property paths
rules:
  "User":
    include: true                      # Force inclusion even if defaultInclude is false
    description: "Authenticated profile returned from the identity service"
  "User.email":
    type: "EmailAddress"              # Custom type consumed by DTO templates
    validation:
      required: true                   # Promote to `required` keyword or [Required]
      pattern: "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
      message: "Please enter a valid email"
  "Order.items":
    include: false                     # Drop noisy collections from the output graph
```

The generator resolves `rules` after schema parsing, so class-level directives cascade down to children unless a more specific rule overrides them.

## Global settings reference

| Setting | Description |
| --- | --- |
| `namespace` | Replaces the CLI-provided namespace; used whenever DTOs, validators, enums, or constants are created. |
| `generateEnumTypes` | Enables enum and constants emission even if the CLI flag is unset. When `false`, the legacy string/integer properties remain. |
| `defaultInclude` | Determines whether definitions are emitted when no explicit rule exists. Combine with targeted `include: false` entries to prune large schemas. |
| `includeDescriptions` | Controls whether schema descriptions flow into templates; disable to keep generated XML docs minimal. |
| `maxDepth` | Caps traversal depth while extracting nested objects to avoid runaway recursion in malformed specs. |
| `type_name_prefix` / `type_name_suffix` | Applied by `ApplyTypeNameFormatting` so every DTO, enum, and constants class shares consistent naming. |

## Property rules and validation overrides

`PropertyRule` values let you opt out individual members (`include: false`), remap types (`type: Guid`), supply alternative descriptions, or set default literals. Nested `validation` blocks bubble into the FluentValidation templates, so `minLength`, `maxLength`, numeric `minimum`/`maximum`, and regular-expression `pattern` constraints translate directly into rule builders. Optional `message` strings give you friendly validation messages for UI display.

If the schema already defines defaults or length hints, the configuration layer merges them. Explicit configuration always wins, and missing fields simply inherit the schema-provided values. Nullable handling and enum promotion still honour CLI switches—configuration supplements those decisions rather than replacing them entirely.

## Loading and saving modifier files

`ConfigurationLoader` handles format detection and serialization so you can check configuration artifacts into source control:

- `Load`/`LoadAsync` infer YAML versus JSON by the file extension and surface clear exceptions for unsupported extensions, missing files, or invalid syntax.
- `LoadFromYaml`/`LoadFromJson` accept raw strings and wrap parsing failures with actionable messages (ideal for unit tests or in-memory pipelines).
- `SaveAsync`, `ToYaml`, and `ToJson` make it easy to persist generated configurations—for example, seeding a project with the generator’s defaults before applying manual edits.

## Validating property paths

Before code is emitted, `SchemaValidator.ValidatePropertyPaths` traverses the merged Swagger document to ensure every non-wildcard rule points at an actual definition/property. The CLI mirrors the Spectre.Console output used in tests: green ticks mean the configuration is aligned; red bullet points call out missing paths so you can fix typos before templates run. Because validation runs ahead of generation, you avoid accidentally skipping properties due to misnamed rules.

## Applying configuration via CLI or APIs

- Pass `--config config.yaml` (or `.yml`/`.json`) to `jsome generate` to load modifiers alongside your schema. Combine with `--yes` when running unattended pipelines that overwrite output folders.
- Within custom tooling, set `CodeGenerationOptions.ModifierConfigurationPath` to load from disk or inject an in-memory object via `ModifierConfiguration` directly. When both are provided, the in-memory instance wins so tests can hydrate configurations without touching the filesystem.

## Test coverage to lean on

- `ConfigurationTests` round-trip YAML and JSON payloads through `ConfigurationLoader` to catch serialization regressions early.
- `ModifierConfigurationIntegrationTests` feed real schemas plus configuration files through the generator to verify inclusion, renaming, and validation overrides.
- `SchemaValidatorTests` assert that missing property paths are caught with the same messaging you see in the CLI, keeping the validation experience honest.

Use these suites as guardrails whenever you introduce new modifiers or expand the configuration schema.
