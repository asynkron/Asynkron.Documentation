---
slug: an-intentional-extensible-language
title: "An intentional extensible language?"
authors: [rogerjohansson]
tags: []
---
Ever since I first saw Lisp I have had a sort of hate love for it.  
The syntax is horrible to look at, but at the same time it is pure genius in the sense that you can add new language constructs since everything are functions.  
I have never seen any other language that can do this.

<!-- truncate -->

For those of you who don’t know what I’m talking about;  
Pseudo lisp:

```
 (foreach
      (item list
            (print item)))
```

“foreach” is not a keyword here, it is a function that takes a variable name as it’s first argument, a list as it’s 2nd argument and a list of statements as it’s 3rd argument.  
So even if it looks ugly as sin, \_everything\_ will look exactly the same, you can add a new concepts that looks as if they were part of the language due to the simplicity of the Lisp grammar.

There have also been countless of attempts to try to de-parenthesis Lisp, so that you get something that is actually readable.  
But as far as I know, none of those attempts have been successful.

I always like a good challenge, so the last few days I have been sketching on a grammar that would actually allow you to extend a language and still be able to read it.

My attempt is based on what I call chain-expressions.

A chain expression consists of;  
\* one or more symbols  
\* an optional parenthesis group that contains other chain expressions  
\* an optional bracket group that contains other chain expressions

This allows you to write expressions like this:

```
//single symbol expression
break; 

//symbol + parenthesis group 
print ("hello");  

//symbol + parenthesis group + bracket group
if(foo)
{
 ...
};
```

That looks fairly decent, doesn’t it?  
But what about that semi colon at the end of the “if” block?

The semi colon represents the end of a chain of chain expressions.  
My grammar allows me to link multiple chain expressions together, like this;

```
if(foo)
{
 print ("foo is true");
}
else if (bar)
{
 ...
}
else
{
 ...
};
```

What you see above is a chain of three chain expressions.  
If , else if and else, and the chain is terminated with the final semi colon.

The “if” expression would be implemented as a function in my language where the function takes a boolean expression as it’s first argument, and a list of statements (the bracket group) as it’s 2nd argument.  
and a reference to the “next” expression, that is, the “else if” expression.

If we try to express the Lisp example at the top of the post using this grammar it would look something like this:

```
foreach item in list
{
       print (item);
};
```

So it would in practise work pretty much like Lisp, where functions or code is passed around to other functions, but with a far more readable syntax, at least in my own opinion 😉

This would allow you to create true DSL’s without knowing how to write a grammar, which you have to know if you use parser frameworks like M Grammar or Gold Parser.  
It would also enable you to step into the world of intentional programming using text based code instead of using a structured editor like most other intentional programming tools forces you to do.

Currently I’ve only got a working grammar for this, so the next step will be to create a compiler or engine so that I can run real programs in it.

//Roger
