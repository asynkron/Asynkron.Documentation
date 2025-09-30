---
slug: cil-compiler-construction
title: "CIL – Compiler construction"
authors: [rogerjohansson]
tags: ["cil", "compiler-construction", "compilers", "emit", "gold-parser", "msil", "reflection"]
---
I’ve created a little sample on how to make your own .NET compiler.  
The compiler uses Gold parser for parsing and Reflection.Emit to generate the compiled .exe file.

<!-- truncate -->

Initially I intended to make a sample on how to use Gold parser to parse and then compile Linq expressions, thus the name GoldLinq, however, Linq have now been replaced with Reflection.Emit.

**Links:  **
My compiler source: [http://www.puzzleframework.com/Roger/GoldLinq.zip](http://www.puzzleframework.com/Roger/GoldLinq.zip)  
(C# VS.NET 2008 solution)

Gold parser: [http://www.devincook.com/goldparser/](http://www.devincook.com/goldparser/)  
Grammar: [http://www.devincook.com/goldparser/grammars/index.htm](http://www.devincook.com/goldparser/grammars/index.htm)

**How it works:**

- <div>

  Gold parser – Calitha engine is used to parse the source code into a parse tree

  </div>

- <div>

  The parse tree is transformed into a typed AST

  </div>

- <div>

  The AST is verified using visitor pattern, the verifier handles type inferrence and auto casts.

  </div>

- <div>

  The AST is optimized using visitor pattern, the optimizer replaces constant expressions and statements.

  </div>

- <div>

  The AST is compiled into CIL/MSIL using visitor pattern.

  </div>

- <div>

  If successful, the compiler will generate a file called “output.exe” in the same folder as the compiler

  </div>

**Samples:**

Hello world 

    display 'Hello World!'

 Have a nice day:

    Display 'What is your name?' Read Name 
    Display 'Hello, ' & Name & '. Have a nice day!'

Blastoff: 

    assign n = 10 
    while n >= 1 do 
        display n 
        assign n = n - 1 
    end 
    display 'Blast off!'

Miles and kilometers: 

```
Display 
'Do you want to convert 1) Miles to Kilometers or 2) Kilometers to Miles?' 
Read Choice        
```

```
if Choice == 1 then 
    Display 'Please enter the number of miles' Read Miles 
    Display Miles & ' Miles = ' & (Miles * 1.609)  & ' Kilometers' 
else 
    Display 'Please enter the number of kilometers' Read Kilometers 
    Display Kilometers & ' Kilometers = ' & (Kilometers / 1.609)  & ' Miles' 
end
```

Secret number: 

```
Assign SecretNumber = 64 

Display 'Please guess the secret number' 
Read Guess          

While Guess <> SecretNumber Do 
    If Guess < SecretNumber Then 
        Display 'Your guess was too LOW. Try again.' Read Guess 
    End     
If Guess > SecretNumber Then 
        Display 'Your guess was too HIGH. Try again.' Read Guess 
    End 
End     

Display 'Correct!'
```

**How to compile the samples:**

First you need a source file to compile, just create a normal textfile and paste one of the samples above into it.  
Once you have the code file you can compile it using the compiler:

```
c:whatever\bin\debug> GoldSample.exe mysource.txt
```

When the compiler is done, you can start the compiled application with:

```
c:\whatever\bin\debug> output.exe
```

The code is somewhat too big to cover in a blog post, so if you have any questions feel free to ask in the comment section.

//Roger
