# Asynkron.Jsome

Asynkron.Jsome is a .NET 8 code generator that ingests Swagger 2.0/OpenAPI documents or folders of JSON Schema files and emits strongly typed client artefacts. The public repository now exposes the full CLI, template set, and test suite, so you can study exactly how the generator produces C# DTOs, FluentValidation validators, Protocol Buffers schemas, optional F# modules, and TypeScript interfaces.

## Install the CLI

Install the global tool from NuGet (the package ID is `dotnet-jsome`):

```bash
# Install or update the CLI
dotnet tool install -g dotnet-jsome
# dotnet tool update -g dotnet-jsome
```

The installer drops the `jsome` command into `~/.dotnet/tools`. Add that directory to your `PATH` if the tool is not immediately available.

## Repository tour

Clone `https://github.com/asynkron/Asynkron.Jsome` to inspect the source that backs the tool. The `src/Asynkron.Jsome` project contains the CLI entry point, JSON/Swagger models, configuration types, and built-in Handlebars templates, while `tests/Asynkron.Jsome.Tests` exercises the generator end to end with Roslyn compilation checks, locale edge cases, Protocol Buffers validation, and template overrides. The `testdata` and `schemas` folders hold larger specs (Stripe, OCPP) that mirror real-world usage when you want to experiment locally.

## Generate C# from Swagger

### Run the generator

Point the CLI at a Swagger 2.0 JSON document (or omit it to fall back to the embedded Petstore sample) and choose an output folder:

```bash
jsome generate ./sample-swagger.json \
  --output ./generated \
  --namespace Sample.Generated \
  --modern --records \
  --system-text-json --swashbuckle-attributes \
  --proto
```

`Program.CreateGenerateCommand` wires up these switches via System.CommandLine, so the CLI prompts for confirmation unless `--yes` is supplied, validates mutually exclusive inputs (`swaggerFile` vs `--schema-dir`), and echoes a Spectre.Console summary of what will be produced. Running the command against the minimal `sample-swagger.json` below yields DTOs, validators, and Protocol Buffers definitions in the target directory.

```json title="sample-swagger.json"
{
  "swagger": "2.0",
  "info": { "title": "Sample API", "version": "1.0.0" },
  "basePath": "/api",
  "paths": {},
  "definitions": {
    "User": {
      "type": "object",
      "required": ["id", "name"],
      "properties": {
        "id": { "type": "integer", "format": "int64" },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" }
      }
    }
  }
}
```

### Example C# output

With `--modern --records --system-text-json --swashbuckle-attributes` enabled, the generated record includes nullable annotations, `JsonPropertyName` attributes, Spectre-enhanced validation error messages, and optional Swagger metadata—exactly what `SystemTextJsonTests` and `ModernCSharpFeaturesTests` assert in the open test suite.

```csharp
[method: JsonConstructor]
public partial record User(
    [property: JsonPropertyName("id")]
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: SwaggerSchema(Format = "int64")]
    required long Id,
    [property: JsonPropertyName("name")]
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: Required(AllowEmptyStrings = false)]
    [property: StringLength(50, MinimumLength = 1)]
    required string Name,
    [property: JsonPropertyName("email")]
    [property: JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    [property: SwaggerSchema(Format = "email")]
    string? Email
);
```

Protocol Buffers support is toggled via `--proto`. `CodeGenerator.GetTemplatesToLoad` automatically includes `proto.hbs`, `proto.enum.hbs`, and `proto.string_enum.hbs` when the flag is set, and `ProtoTemplateTests` verify that every DTO, numeric enum, and string enum is rendered with the correct scalars and snake_case field names.

## Using configuration files

`ConfigurationLoader` accepts YAML or JSON and materialises a `ModifierConfiguration` object graph composed of `GlobalSettings`, `PropertyRule`, and nested `PropertyValidation` options. The snippet below mirrors the structure asserted in `ModifierConfigurationIntegrationTests`, where dotted property paths let you exclude DTOs, override types, and add custom validation rules.

```yaml title="config.yaml"
global:
  namespace: "MyApi.Generated"
  generateEnumTypes: true
  type_name_prefix: "Api"
  type_name_suffix: "Dto"

rules:
  "User.email":
    validation:
      required: true
      pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
      message: "Please enter a valid email"
  "User.id":
    description: "Primary key issued by the identity service"
    format: int64
  "Order":
    include: false
```

* `global` tweaks namespaces, naming prefixes/suffixes, enum generation, and default inclusion—`ModifierConfiguration.IsIncluded` and `ApplyTypeNameFormatting` honour these settings while constructing DTOs.
* `rules` target specific properties (case-insensitive) using dotted paths; wildcard paths such as `*.Id` are supported and intentionally skipped by `SchemaValidatorTests` when validating configuration safety.
* `SchemaValidator.ValidatePropertyPaths` flags any rule pointing at a missing schema member before generation proceeds, surfacing friendly Spectre.Console messages instead of silently omitting fixes.

Apply a config file by supplying `--config config.yaml`. Combine it with `--yes` to skip the interactive confirmation prompt `HandleGenerateCommand` displays whenever destructive overwrites are detected.

## Working with Handlebars templates

All artefacts are rendered through Handlebars templates stored in `src/Asynkron.Jsome/Templates`. Each template may contain a YAML front matter header that sets the extension or describes the output. `CodeGenerator` loads the required files, checks for missing assets, and exposes helpers like `proto_type`, `snake_case`, and `add` that are used across the built-in templates and surfaced to your custom templates.

| Template | Description |
| --- | --- |
| `DTO.hbs` | Default C# class template with Newtonsoft.Json support and DataAnnotations |
| `DTORecord.hbs` | Modern record template activated via `--records`, adding `[method: JsonConstructor]` and property-scoped attributes |
| `Validator.hbs` | FluentValidation rules for each DTO, including numeric guards that `LocaleIssueTests` keep invariant-culture safe |
| `Enum.hbs` / `Constants.hbs` | Optional enum/constant outputs controlled by configuration |
| `proto.hbs`, `proto.enum.hbs`, `proto.string_enum.hbs` | Protocol Buffers templates loaded when `--proto` is set |
| `FSharp.hbs`, `FSharpModule.hbs` | F# record and module templates with DataAnnotations and helper builders |
| `TypeScript.hbs` | Optional interface and type guard template |

To customise output you can point `--template-dir` at a folder of `.hbs` files or pass `--templates` with an explicit list. `CustomTemplateTests` exercise both approaches by rendering bespoke files alongside the built-in DTOs and validators.

### Generating F# artefacts

Pass the F# templates explicitly to produce both C# and F# output in one run:

```bash
jsome generate ./sample-swagger.json \
  --output ./generated \
  --templates DTO.hbs Validator.hbs FSharp.hbs FSharpModule.hbs \
  --namespace Sample.Generated --yes
```

`FSharp.hbs` and `FSharpModule.hbs` include YAML headers (`description: …`) and emit idiomatic records with `[<JsonPropertyName>]` or `[<JsonProperty>]` attributes plus modules for validation helpers. `OcppV16IntegrationTests` confirm that nested types, array shapes, and validation metadata round-trip correctly when F# files are requested.

### Generating Protocol Buffers

Toggle `--proto` to render `proto3` schemas next to the C# artefacts. The `proto` templates reuse the same `ClassInfo`, `EnumInfo`, and `ConstantsInfo` shapes produced for C#, so enum naming and snake_case conversions stay consistent. `ProtoTemplateTests` and `OcppV16ComplianceTests` assert that the emitted files compile under `buf lint` and respect OCPP 1.6 expectations.

### Rendering TypeScript interfaces

Because `TypeScript.hbs` is a normal Handlebars template you can opt into TypeScript output via `--templates` or by copying the template into a custom directory. The template emits `interface` declarations and runtime guards, and `CustomTemplateTests` show how to assert on the generated `.ts` content for your own templates.

## Parsing sources beyond Swagger

Instead of providing a single Swagger document you can hand `--schema-dir` a directory full of JSON Schema files. `JsonSchemaParser.ParseDirectory` merges every `.json` file, honours schema titles, extracts internal `definitions`, resolves `$ref` entries, and refuses to continue when two files disagree about a definition. `JsonSchemaParserTests` cover duplicate handling, `$ref` validation, and conflict detection so CLI users receive actionable errors.

## What happens under the hood

The compiled assembly exposes a small set of focused types, making it easy to trace how input is transformed into code:

* `Program` wires up the System.CommandLine verbs, including options such as `--modern`, `--records`, `--system-text-json`, `--swashbuckle-attributes`, `--schema-dir`, `--templates`, and `--proto`, before dispatching to `HandleGenerateCommand` for validation and orchestration.
* `ConfigurationLoader` deserialises YAML/JSON via YamlDotNet or Newtonsoft.Json, feeding a `ModifierConfiguration` tree built from `GlobalSettings`, `PropertyRule`, `PropertyValidation`, and `EnumMemberOverride` nodes that shape the generated models.
* `SchemaValidator` walks Swagger definitions to warn about rules targeting missing properties so configuration mistakes are caught before generation; tests assert that wildcards are ignored and missing paths surface friendly messages.
* `CodeGenerator` loads templates, registers Handlebars helpers, converts Swagger models into `ClassInfo`, `PropertyInfo`, `EnumInfo`, and `ConstantsInfo`, and materialises files through the selected templates. `CodeGenerationTests` and `CompilationValidationTests` prove the output compiles, respects `[Required]` logic, and keeps numeric validation culture-invariant.
* Helper methods such as `ApplyModifierConfiguration`, `MapSwaggerTypeToCSharpType`, and `ExtractInlineNestedObjects` ensure naming consistency, nested schema flattening, and configuration overrides work for both DTOs and derived artefacts—a behaviour validated in `OcppV16IntegrationTests` and `SystemTextJsonTests`.

## Test suite highlights

The repository ships its full xUnit test harness. Running `dotnet test` exercises the scenarios below so you can confirm your own template/config changes stay compatible:

* **Configuration validation** – `SchemaValidatorTests` and `ModifierConfigurationIntegrationTests` ensure invalid paths raise friendly errors, exclusions drop DTOs, and custom validation metadata appears in the generated validators.
* **Language feature toggles** – `ModernCSharpFeaturesTests`, `SystemTextJsonTests`, and `CodeGenerationTests` cover `--modern`, `--records`, `--system-text-json`, and Swashbuckle attribute flags, preventing regressions in attribute placement or record syntax.
* **Template outputs** – `ProtoTemplateTests`, `CustomTemplateTests`, and `CompilationValidationTests` assert that Protocol Buffers, bespoke templates, and compiled DTOs stay correct across releases.
* **Real-world schemas** – `OcppV16IntegrationTests`, `OcppV16ComplianceTests`, and `JsonSchemaParserTests` load the bundled OCPP 1.6 and JSON Schema directories, stress testing nested objects, enums, and localisation edge cases (`LocaleIssueTests`).

Grab the repo, run `dotnet tool install jsome`, and explore the templates or tests that match your scenario. The codebase is intentionally small and well-commented, making it straightforward to extend with new templates or configuration knobs now that everything is public.
