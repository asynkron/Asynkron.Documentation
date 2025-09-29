---
sidebar_position: 3
sidebar_label: Templates
title: Templates
---

# Templates

## Handlebars Template Customization

Every artifact that Jsome emits flows through a Handlebars template. Understanding how templates are discovered, how frontmatter is parsed, and which helpers are available lets you extend the generator confidently—whether you are tweaking the default DTO output or layering in entirely new languages.

## Template discovery order

`CodeGenerator` resolves the template directory with a predictable search stack:

1. Honour an explicit CLI `--template-dir` (or `CodeGenerationOptions.TemplateDirectory`). Missing folders trigger a clear `DirectoryNotFoundException` so you know the override failed.
2. Fall back to the tool installation path (`<tool>/Templates`) and its NuGet `contentFiles` twin when running the global tool.
3. During local development, walk upward from the current working directory until `src/Asynkron.Jsome/Templates` is found.
4. Finally, look for a `Templates` folder beside the executable so ad-hoc experiments still work.

If none of these locations exist, the CLI prints the attempted paths and exits, helping you supply the right directory without guesswork.

## Standard template set

Unless you specify custom files, the generator loads a curated set:

- `DTO.hbs` for class-based C# DTOs (Newtonsoft.Json attributes).
- `Validator.hbs` for FluentValidation rules.
- `Enum.hbs` and `Constants.hbs` when enum support is enabled.
- `DTORecord.hbs` when `--records` and `--modern` toggle record generation.
- `proto.hbs`, `proto.enum.hbs`, and `proto.string_enum.hbs` when `--proto` is active.

You can narrow the list with `--templates DTO.hbs Validator.hbs` (or `CodeGenerationOptions.CustomTemplateFiles`) to render only specific files. Supplying a list that omits required defaults results in friendly “No DTO template available” exceptions so you immediately notice missing artefacts.

## Frontmatter and metadata

Templates can declare metadata blocks to change file extensions or describe their purpose. `TemplateMetadata` strips the frontmatter before compilation and exposes the remaining content to Handlebars.

```hbs title="proto.hbs"
---
extension: proto                  # Persist generated messages with a .proto extension
description: Protocol Buffers DTOs
---
message {{ClassName}} {
  // Use the `add` helper to increment field numbers from zero-based indexes
  {{#each Properties}}
  {{add @index 1}}: {{proto_type Type}} {{snake_case Name}} = {{add @index 1}};
  {{/each}}
}
```

Supported frontmatter keys today are `extension` and `description`; everything else passes through unchanged so you can add comments without affecting parsing.

## Helpers you can rely on

The generator registers a few helpers before compiling templates:

- `add` — integer addition, ideal for zero-based `@index` arithmetic in Protocol Buffers.
- `snake_case` — converts PascalCase or camelCase strings to snake_case.
- `proto_type` — maps C# types (`int`, `Guid`, `List<string>`) into appropriate Protocol Buffers scalars or repeated clauses.

Because helpers are registered globally, they work in both the built-in `.hbs` files and any custom templates you load from disk.

## View models exposed to templates

Each template receives strongly typed view models so you do not have to massage raw Swagger documents inside Handlebars:

- `ClassInfo` supplies `ClassName`, `Namespace`, `Description`, feature toggles (`UseSystemTextJson`, `UseSwashbuckleAttributes`), and a `Properties` collection.
- `PropertyInfo` includes PascalCase names, CLR `Type`, JSON property names, nullability flags, validation metadata (min/max lengths, regex patterns), enum wiring (`EnumTypeName`, `ConstantsClassName`), and Swashbuckle hints (`SwaggerSchemaDescription`, `SwaggerExample`).
- `EnumInfo`/`EnumValueInfo` and `ConstantsInfo`/`ConstantInfo` describe generated enum members or string constant classes, including friendly descriptions you can surface in documentation comments.

When you create additional templates, iterate over these structures rather than parsing the schema yourself—tests already guarantee their shape and invariants.

## Custom directories and partial template sets

To point the CLI at a different template root, call:

```bash
# Render with a bespoke template directory and opt into nullable records
jsome generate ./specs/petstore.json \
  --template-dir ./templates/csharp-records \
  --templates DTORecord.hbs Validator.hbs \
  --modern --records --system-text-json
```

Mixing built-in and custom files works too: the loader merges your list, then compiles each `TemplateMetadata.Content`. Missing files raise a consolidated error that lists every absent template so you can fix typos before rerunning.

## Test harness for template changes

- `CustomTemplateTests` ensures that pointing to alternate directories or partial file sets keeps generation resilient.
- `CompilationValidationTests` compiles the emitted C# so template tweaks cannot silently break syntax.
- `ProtoTemplateTests` verifies frontmatter extensions and helper usage for `.proto` output, making it safe to extend Protocol Buffers coverage.

Running these suites after editing templates provides fast feedback that your Handlebars changes still play nicely with the wider generator.
