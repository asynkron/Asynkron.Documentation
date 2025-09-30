---
slug: massive-parallelism-f-in-the-cloud
title: "Massive parallelism \u2013 F# in the cloud?"
authors:
- rogerjohansson
tags:
- parallelism
---
I’m still trying to learn a bit of F# and I thought of a quite nice experiment.  
Since F# supports quotations (for you C# devs, think Linq Expressions on roids) wouldn’t it be possible to serialize such quotation and pass it to a webservice and execute that code there?

<!-- truncate -->

Imagine the following code for a fractal calculation:

```fsharp
for y = 0 to 100000 do
    CloudExec(
            <@
            let Fractal xx yy =
                .....fractal calculation....

            for x = 0 to 100000 do
                Fractal x y
            @>)
```

If “CloudExec” passes the code quote for individual scanlines of the fractal to the cloud, we could get some massive parallelism.  
It would be just like PLinq but instead of executing a delegate in multiple threads, we would execute blocks of code on multiple threads on multiple machines (please ignore how naïve the code sample above is).

The biggest problem as far as I can tell would be to pass a result set back to the client in some way (that is missing in the sample code).  
Input data doesn’t seem to be a problem since values defined outside the quotes are represented as constants in the quote.

It would ofcourse madness to expose such services to the public since you could pass in any code you want, but maybe it would work in an isolated environment.

Have anyone done such thing already?

//Roger
