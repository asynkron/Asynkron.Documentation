---
slug: scaling-clustere-evolution-1-1-4
title: "Scaling Clustered Evolution: 1 + 1 = 4"
authors: [rogerjohansson]
tags: ["cluster", "ga", "gp", "mpi"]
---
**This is a follow up on:** [**http://rogeralsing.com/2009/01/01/clustering-evolution-we-have-lift-off/**](http://rogeralsing.com/2009/01/01/clustering-evolution-we-have-lift-off/)

<!-- truncate -->

Yesterday I got the chance to test run the cluster version of EvoLisa on a 64 bit 4 core machine.  
(Thanks to my collegue Ulf Axelsson for the help on this one)

The results from the cluster version are quite interesting.  
One could expect that you would get a maximum of 200% performance by using two nodes instead of one.  
However, this is not the case, **we are getting 400% performance by doing this.  **
  
Doubling the CPU capacity and get 4 times as much work done.

How is this possible?

This really confused me for a while.  
But the reason is quite obvious once you figure it out.

Let’s assume the following:

\* We use one core.  
\* We are running 1000 generations with 50 polygons over 10 seconds.  
\* 1 out of 10 mutations are positive.

**This gives us approx 100 positive mutations over 10 seconds.**

If we add one more core we would get:

\* We use two cores in parallel.  
\* We are running a total of 2000 generations, with 50 polygons per node over 10 seconds.  
\* 1 out of 10 mutations are positive.

**This would give us approx 200 positive mutations over 10 seconds.   
Thus, this would give the expected 200% performance.**

**BUT:**

We are NOT rendering **50** polygons per core in this case.  
Each core is only rendering **25** polygons each.

During those 10 seconds, we are actually able to run **2000** generations instead of **1000** per core, thus, running a total of **4000** generations over 10 sec.  
Which in turn results in approx **400** positive mutations during the same time span.  
**  
We have doubled the CPU capacity and halved the work that needs to be done per node.  
Thus, we get a \* 2 \* 2 perf boost.**

Pretty slick 🙂

PS.  
The 4 core machine was able to render the Mona Lisa image with the same quality as the last image in the evolution series in: **1 min 34 sec!**

//Roger
