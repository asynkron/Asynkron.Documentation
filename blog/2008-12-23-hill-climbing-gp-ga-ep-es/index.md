---
slug: hill-climbing-gp-ga-ep-es
title: "Hill climbing, GP, GA, EP, ES"
authors: [rogerjohansson]
tags: []
---
\[Edit\]  
See **Maarten’s** comments for more info  
\[/Edit\]

<!-- truncate -->

There have been allot of discussions about what sort of algorithm the EvoLisa app uses.  
Quite a few have claimed that it is a hill climber.

So I think it’s time to set everything straight here.

This is the definition of **Hill climbing** from wikipedia:

> Hill climbing attempts to maximize (or minimize) a function <span class="texhtml">f(x)</span>, where <span class="texhtml">x</span> are discrete states. These states are typically represented by **vertices in a graph**, where **edges in the graph encode nearness** or similarity of a graph. Hill climbing **will follow the graph from vertex to vertex**, always locally increasing (or decreasing) the value of <span class="texhtml">f</span>, until a local maximum (or local minimum) <span class="texhtml">xm</span> is reached. Hill climbing **can also operate on a continuous space**: in that case, the algorithm is called gradient ascent (or gradient descent if the function is minimized).\*.

If we look at the EvoLisa app; **there are no vertices**, **there is no graph**, **there are no edges that encodes nearness**.  
**There is no continious space**.

There is an individual with its own set of DNA, and that individual can breed offspring that can be quite far from the parent.  
e.g. Each polygon in a drawing could change shape and size, each polygon could change color.  
(The likeliness that it happens might be extremely small, but it is not impossible)  
There are no paths that can be followed or backtracked like in a graph.

So if we stick to the wikipedia definition of hill climbing, then we can safely say that EvoLisa does not use a hill climber.

So what about my claims about Genetic Programming?

The wikipedia definition of GP is:

> **GP evolves computer programs, traditionally represented in memory as tree structures**. Trees can be easily evaluated in a recursive manner. **Every tree node has an operator function and every terminal node has an operand, making mathematical expressions easy to evolve and evaluate**. Thus traditionally GP favors the use of programming languages that naturally embody tree structures (for example, Lisp; other functional programming languages are also suitable).
>
> Non-tree representations have been suggested and successfully implemented, such as linear genetic programming which suits the more traditional imperative languages \[see, for example, Banzhaf et al. (1998)\]. The commercial GP software Discipulus,\[6\] uses AIM, automatic induction of binary machine code\[7\] to achieve better performance.\[8\] MicroGP\[9\] uses a representation similar to linear GP to generate programs that fully exploit the syntax of a given assembly language

OK, the first statement says GP evolves computer programs, that is sort of fuzzy, a program can be allot more than computational expressions.  
But the next highlighted part implies that GP should deal with computational AST’s only.

IMO, for loops, variable declarations and other statements could very well be used in GP .  
An AST that contains statements for drawing polygons onto a canvas when evaluated is also a program.  
I could very well create a parser for a language that generates that very same AST and everyone using it would agree that it is a language and that they are writing programs when using it.

But let’s ignore what I think, lets stick with the definition here.

If we accept that GP only deals with computational programs and not imperative execution or declarations, then EvoLisa is not GP.

So what would be the correct definition of the algorithm then?

The closest definition would be:  
[http://en.wikipedia.org/wiki/Evolutionary_programming](http://en.wikipedia.org/wiki/Evolutionary_programming)  
or  
[http://en.wikipedia.org/wiki/Evolution_strategy](http://en.wikipedia.org/wiki/Evolution_strategy)

EvoLisa fits the 1+1 Evolutionary Strategy.  
But it also fits the μ + μ EP since it relies on an AST with mutable values.

Which one of those two it is depends on what definition you set for “a program”  
When is an AST an AST and not just data?

e.g. are these statements data or code? “DrawPolygon ( … )” or “print ‘foo'” .

//Roger
