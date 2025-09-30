---
slug: i-call-bs-on-the-oslo-m-language
title: "I call B.S. on the Oslo “M” Language"
authors: [rogerjohansson]
tags: ["domain-specific-languages", "m", "oslo"]
---
There was alot of hype around the new Oslo “M” language during the PDC.  
It was pretty much explained as a new way to let people create their own domain specific languages.

<!-- truncate -->

Since I have a bit of fetish for parsing and DSL’s I attended to the “M Grammar” presentation.

They began by explaining that “M” is so easy that everyone and his mother will now be able to create their own DSL.  
And ofcourse they had to show some trivial example that actually wasn’t a DSL at all, but merely a data transformer that transformed a textual list of “contacts” into a structured list.

Maybe I’m just stupid, but when I hear “new” and “easy” I don’t really associate that with old-school LEX and YACC BNF grammars.  
But MS apparently do.

Just check this out, this is a small snippet of M Grammar definition of the language itself:

```
 syntax CompilationUnit
       = decls:ModuleDeclaration*
         =>
           id("Microsoft.M.CompilationUnit")
           {
               Modules { decls }
           };


   syntax ExportDirective
       = "export" members:ParsedIdentifiers ";"
         =>
         id("Microsoft.M.ExportDirective")
         {
             Names { members }
         };

   syntax ImportAlias
       = "as" alias:ParsedIdentifier
         => alias;

   syntax ImportDirective
       = "import" imports:ImportModules ";"
         =>
         id("Microsoft.M.ModuleImportDirective")
         {
             Modules { imports }
         }
                 | "import" targetModule:MemberAccessExpression "{" members:ImportMembers "}" ";"
           =>
           id("Microsoft.M.MemberImportDirective")
           {
               ModuleName { targetModule },
               Members { members }
           };

   syntax ImportMember
       = member:ParsedIdentifier alias:ImportAlias?
           => id("Microsoft.M.ImportedName")
           {
               Name { member },
               Alias { alias }
           };
```

The grammars in “M” was essentially a hybrid of old BNF definitions mixed up with functional programming elements.

I’m not saying that their approach was bad, just that it wasn’t really as easy as they wanted it to be.  
There are a few gems in it, but it does in no way lower the compexity of defining a grammar in such a way that everyone will be able to create real DSL’s.

Maybe some people will create a few data transformers using this approach, but I don’t expect to see more “real” DSL’s popping up now than we have seen before..

//Roger
