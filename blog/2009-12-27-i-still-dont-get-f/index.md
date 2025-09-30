---
slug: i-still-dont-get-f
title: "I still don\u2019t get F#"
authors:
- rogerjohansson
tags: []
---
I think that Microsoft are trying to sell F# to us as something new and awesome, but I’m having serious problems seeing the benefits over C#.

<!-- truncate -->

**But F# can do function currying!**  
Well, so can C#.

```csharp
string Foo(int a,bool b)
{
    //do stuff
}

void UseCurry()
{
  Func<int,string> curriedFooWithTrue = a => Foo(a,true);

     //invoke curried function.
  var res = curriedFooWithTrue(123);
}
```

**F# can do pipelining!**  
Well, so can C#

```csharp

var listOfInts = new List<int> {1,2,3,4,5,6};
Func<int,int> squared = x => x*x;
var squaredListOfInts = listOfInts.Select(x => squared).ToList();
```

**F# can use tuples!**  
Well, they are built into .NET 4 as a generic type so they are available for all .NET languages with generics support.

**F# can do tail recursion.**

OK, you got me, it can.  
Now let me know the last time you really needed that?  
All tail recursive algorithms can be implemented as iterative.  
But sure, syntactic sugar is nice to have.

**F# makes it easier to write async code.**

This was one of the arguments at a demo of F# at PDC 2008.  
They showed how it was made possible by using PLinq wrapped up in a C# assembly.

Maybe I’ve misunderstood every example I’ve seen, but most of them can be done in C# with pretty much the same amount of code.

What I would like to see is a really good F# example that would be very hard or impossible to accomplish with C#.  
If F# is just slightly better than C# on some tasks, then the cost of bringing F# competence into a project will always outweight the slight benefits it brings.

Another argument is that it targets a completely different problem area.  
OK, show us where F# shines without lying about what C# can and can not do.

Anyone got such example?
