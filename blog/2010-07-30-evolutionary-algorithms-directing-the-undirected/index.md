---
slug: evolutionary-algorithms-directing-the-undirected
title: "Evolutionary Algorithms \u2013 Directing the undirected"
authors:
- rogerjohansson
tags:
- ga
---
This is a followup to my previous post on the same topic : [http://rogeralsing.com/2010/07/29/evolutionary-algorithms-problems-with-directed-evolution/](http://rogeralsing.com/2010/07/29/evolutionary-algorithms-problems-with-directed-evolution/)

<!-- truncate -->

I started thinking about possible solutions after I published my last post, and I think I might have something that could work.

In order to harness the full power of evolution, we need to be able to simulate undirected evolution.  
Undirected evolution requires more than one environment, so that organisms can evolve and niche into specific environments instead of just competing for the same environment.

In our case, the “environment” is the “problem” that we want to solve.  
The more fit an organism is in our environment, the better it is to solve our given problem.

So far, I think everyone have been applying evolutionary/genetic algorithms on individual problems, evolving algorithms/solutions for a single purpose..  
And thus, experiencing the problems of irreducible complexity.

But what if we were to introduce an entire “world” of problems?

If we have a shared “world” where we can introduce our new problems, the problem would be like an island in this world, and this island would be a new environment where existing organisms can niche into.  
This way, we could see organisms re-use solutions from other problems, and with crossover we could see combinations of multiple solutions for other problems.

The solutions would of course have to be generic enough to handle pretty much every kind of algorithm, so I guess the DNA of the organisms needs to be very close to a real GPL language.  
Possibly something like serialized Lisp/Clojure, running in a sandboxed environment…

By adding more and more problems to this “world”, the better it would become at solving harder problems since it can reuse existing solutions.

The structure of it all would be something like:

The “World” is the container for “Problems”.  
“Problems” contains input/output sampling and “populations of organisms”, thus, each problem have its own eco system.  
“organisms” evolve by mutations and genetic crossover, they can also migrate to other “problems” from time to time.

This way, an organism from the “SSH Encryption island” may migrate over to the island of “Bank authentication login code generator island” and possibly be used as a module in one of the branches of one of the organisms in there, and thus removing “irreducible complexity” from the equation here..  
Evolution would be locally directed and globally undirected…

I think this could work at least to some extent, or?

//Roger
