---
slug: f-pipelining-in-c
title: F# Pipelining in C#
authors:
- rogerjohansson
tags: []
---
Here is one such example where F# developers try to make it look like F# can do things that C# can not.

<!-- truncate -->

[http://lorgonblog.spaces.live.com/blog/cns!701679AD17B6D310!165.entry](http://lorgonblog.spaces.live.com/blog/cns!701679AD17B6D310!165.entry)

**F# code  **
F# code that apparently is much easier to read than C# code:

```fsharp
HttpGet "http://www-static.cc.gatech.edu/classes/cs2360_98_summer/hw1"
|> fun s -> Regex.Replace(s, "[^A-Za-z']", " ")
|> fun s -> Regex.Split(s, " +")
|> Set.of_array
|> Set.filter (fun word -> not (Spellcheck word))
|> Set.iter (fun word -> printfn "   %s" word)
```

**C# code  **
My attempt to accomplish the same in C#.

```csharp
HttpGet("http://www-static.cc.gatech.edu/classes/cs2360_98_summer/hw1")
    .Transform(s => Regex.Replace(s, "[^A-Za-z']", " "))
    .Transform(s => Regex.Split(s, " +"))
    //.AsParallel()  // [EDIT] now with parallelism support
    .Distinct()
    .Where(word => !Spellcheck(word))
    .Process(word => Console.WriteLine("  {0}", word))
    .Execute();
```

I think that’s fairly similar?

OK, I cheated, “Transform”,”Process” and “Execute” does not exist out of the box in C#.  
You would have to write those extension methods yourself.  
However, they are reusable and fits nicely into a util lib.

```csharp
public static class Extensions
{
    public static TOut Transform<TIn, TOut>(this TIn self, Func<TIn, TOut> selector)
    {
        return selector(self);
    }

    public static IEnumerable<T> Process<T>(this IEnumerable<T> self, Action<T> action)
    {
        return self.Select(item =>
        {
            action(item);
            return item;
        });
    }

    public static ParallelQuery<T> Process<T>(this ParallelQuery<T> self, Action<T> action)
    {
        return self.Select(item =>
        {
            action(item);
            return item;
        });
    }

    public static void Execute<T>(this IEnumerable<T> self)
    {
        self.ToList();
    }

    public static void Execute<T>(this ParallelQuery<T> self)
    {
        self.ToList();
    }
}
```

Either way, I hope this shows that you can accomplish the same thing using good old C# instead of F#.
