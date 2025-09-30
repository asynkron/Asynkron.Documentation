---
slug: plastic-added-generator-support
title: "Plastic – Added generator support"
authors: [rogerjohansson]
tags: []
---
I’ve added generator support to my toy language “Plastic”.  
It’s quite funny how easy it is to implement some language features once you understand how they work behind the scenes.  
At first, I thought generators would be extremely hard to implement, requiring AST transformations to build state machines a’la C# for enumerable methods.

<!-- truncate -->

But my java script guru colleague [Sebastian Markbåge](http://blog.calyptus.eu/) stated *“its simple, just invoke the for each body as a closure from the generator when you hit yield”.*  
It’s so brilliant, no AST transformations and I could implement the whole thing in less than 20 LOC.

This enables me to write code like this:

```
//a generator function
func Range(low,high)
{
    for(let i=low,i<=high,i++)
    {
        yield(i); 
    };
};

//loop over the generator values
foreach(x in Range(5,20))
{
    foreach(y in Range(1,2))
    {
        print ("yielded " + x + " " +y);
    };
};
```

Looks like a real language almost, doesn’t it? 🙂

So what going on here?

Well, the foreach function creates a closure of its own body with a single in argument, this closure is then stored and the generator function is invoked.  
Once the generator calls the “yield” function, the yield function will route the yielded value into the closure of the foreach body.  
This works fine even for nested loops.
