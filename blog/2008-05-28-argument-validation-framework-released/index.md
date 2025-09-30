---
slug: argument-validation-framework-released
title: "Argument validation framework released"
authors: [rogerjohansson]
tags: []
---
**Download:**  
[http://www.puzzleframework.com/Roger/alsingcore.zip](http://www.puzzleframework.com/Roger/alsingcore.zip)

<!-- truncate -->

I’ve finally got my thumb out and cleaned up and made a mini framework of the fluent argument validation concept I blogged about in my last post: [http://rogeralsing.com/2008/05/10/followup-how-to-validate-a-methods-arguments/](http://rogeralsing.com/2008/05/10/followup-how-to-validate-a-methods-arguments/)

The framework contains a little bit of everything.

**Fluent Argument Validation Specification.  **
An extensible argument validation system based on a fluent extension method API.  
(Maybe I should work at marketing 😉 )

**Async fork.**  
A fluent API for performing async operations.

**Text parser.**  
A Deterministic Finite-State Automata based parser.  
It is the same parser that we used in NPath for NPersist but with a cleaned up API.

**Flextensions.  **
A handful of useful extension methods to increase expressiveness.  
Loggers, casting, formatting etc.

**Generic Math.  **
A generic numeric type that supports math operations.

 

## Examples:

**Validation pre conditions:**

```
static string ValidationFunc(int a,string b,DateTime c)
{
  //pre conditions:
  a.Require("a")
   .IsGreaterThan(10);

  b.Require("b")
   .NotNull()
   .NotEmpty()
   .LongerThan(2)
   .StartsWith("Ro");

  c.Require("c")
   .IsInRange(new DateTime(2000, 01, 01),
   new DateTime(2010, 01, 01));
```

**Validation post conditions:**

```
string res = "Foo";
//post condition:
return res.Require("res")
          .NotNull()
          .LongerThan(2)
          .ShorterThan(100);
```

**Async fork:**

```
static int ForkIt()
{
   int a = 0;
   int b = 0;

   //begin async fork
   Fork.Begin()
       .Call(() => a = SomeSlowCall())
       .Call(() => b = SomeOtherSlowCall())
       .End();
   //async fork done
   return a + b;
}
```

**Flextensions:**

```
//fluent casts, no need to wrap in ((int)var).
someVar.Cast<Foo>().Bar();
someVar.As<Boo>().Yoo();

//formatting and output;
myVar.FormatAs("myVar is: {0}").Output();

"Hello {0} {1}".FormatWith(firstName,LastName).Output();

"ROGER ALSING".ToProperCase().Output();

//string matching
bool match = myString.Like("Roger%");
bool match = myString.Match(regexPattern);
```

 More examples can be found in the demo project and in the unit tests in the same zip as the framework. 

Enjoy.  
//Roger

**Download:  **
[http://www.puzzleframework.com/Roger/alsingcore.zip](http://www.puzzleframework.com/Roger/alsingcore.zip)
