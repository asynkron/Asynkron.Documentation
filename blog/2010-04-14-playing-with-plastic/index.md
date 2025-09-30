---
slug: playing-with-plastic
title: "Playing with Plastic"
authors: [rogerjohansson]
tags: []
---
As some of you might know, I’ve been fiddling with a generic DSL grammar, [here](http://rogeralsing.com/2010/03/23/generic-dsl-grammar-and-parser/) and [here](http://rogeralsing.com/2009/03/18/an-intentional-extensible-language/).

<!-- truncate -->

I figured that I should do some proof of concept on this and started to write a language using the grammar and parser.  
Since I’ve already created a LISP clone earlier, I thought I should go with something similair, but using my C like grammar.  
The evaluator is beeing developed using F#, a wonderful language for this kinds of things, forget any bashing I’ve done on F# 😉

The results of my experiments is a language that is somewhat similair to JavaScript, but with LISP’ish macro support.  
I lie if I say it’s real macros, but I can get similair results as LISP macros.

How it works:

The C# based parser parses the source code and returns a generic AST.  
I then use F# to translate the generic AST into a similair F# based AST, just to make it easier to consume it from F#  
The F# AST is then passed to my F# evaluator, which simply traverses the AST and evaluates the branches in the AST.

F# does an amazing job here, the AST evaluator is only around 150 LOC and some 100 LOC for the core functions, like “if” and “func”.

With these 250 lines of code, I get features like:

**Macro like functions:**

```
func for(ref init,ref cond,ref step,ref body)
{
    init();
    let result = null;
    while(cond())
    {
        result = body();
        step();
    };
    result;
};

//makes it possible to do:
for(let i=0,i<3,i++)
{
    print(i);
};
```

**Chained expressions:**

The macro like support allows me to add new constructs to the language, unlike other languages  
like Boo or Ruby where you can pass closures as the last argument to a function, I can pass an entire chain of functions or expressions as the tail argument.  
thus allowing constructs like:

```
if(x)
{
}
elif(y)
{
}
else
{
};
```

Note that “;” terminates a chain, which is the reason why there is a “;” at the end of a “for” block for example.  
This is the reason I picked the somewhat corny name “Plastic” for the language, because it can be molded to support new consturcts.

**Passing functions:**

```
//passing functions
func f(x)
{
    x + 3;
};

func g(function,x)
{
    function(x) * function(x);
};

print (g(f,7));
```

**Returning functions(closures):**

```
func makefun()
{
    let x = 10;
    func()
    {
        x++;
        print(x);
    };
};

let fun = makefun();
fun();
fun();
fun();
```

There is still lots of things I want to add, e.g. There is no OO support at all right now, nor is there any way to deal with simple things like arrays.  
So there is more to come.
