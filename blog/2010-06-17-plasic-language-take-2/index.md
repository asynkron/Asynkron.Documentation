---
slug: plasic-language-take-2
title: "Plastic Language take 2"
authors: [rogerjohansson]
tags: []
---
This is a follow-up on my earlier posts regarding my toy language plastic:  
[http://rogeralsing.com/2010/04/14/playing-with-plastic/](http://rogeralsing.com/2010/04/14/playing-with-plastic/)  
[http://rogeralsing.com/2010/04/17/more-on-plastic/](http://rogeralsing.com/2010/04/17/more-on-plastic/)

<!-- truncate -->

After some brain storming with my colleague Sebastian Markbåge, we’ve come up with some alternative approaches to chained method calls.

Instead of chaining calls syntactically, I could instead chain them by passing the result of the last statement into the next function invocation, somewhat like pipelining in F# but without any syntactic interference.

 Lets take the “if / else” scenario which I have used before.

In my first attempt in plastic, the syntax would be:

```text
if (condition)
{
   ...body...
}
else
{
   ...body...
}; // <- terminate the if / else chain with ";"
```

This worked fine, but it came with the drawback that I had to terminate every chain with “;”, even a single if statement.. `if (…) {…};`  
It was also up to the “if” function to decide if the “else” function would be called.

With the new approach, the “if” function would execute like normal, and if the condition was not met, it would return the value/symbol “fail”.  
The “else” function would be a special function that requires a “last value” as its first argument, this way, the evaluator “knows” that the last evaluated result should be applied to the “else” function.

Like this:

```text
if (condition) //if condition fails, return "fail"
{
   ...body...
}
else //the last evaluated value and the else body is applied to the else function.
{
   ...body...
} // <- don't need any terminator, all {..} blocks always terminate a statement
```

This way, the else function would have two arguments, the last result and a closure representing it’s body.

The else function would be implemented like this:

```csharp
func else (lastresult,body)
{
  let result = lastresult;

  if (last == fail) // if the last function returned fail, then execute the else body
     result = body(); //invoke the body and assign to result

    result;
}
```

This means that I can make a language wich is syntactically very similar to JavaScript (for whatever that is worth) and at the same time support invocation chains of functions/macros.  
So this is more powerful than the earlier attempt and with a nicer syntax due to the skipped requirement of terminating chains with “;”

Ideas?
