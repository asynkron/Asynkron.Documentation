---
slug: clustering-evolution-the-failures-in-evolisa
title: "Clustering evolution – The failures in EvoLisa"
authors: [rogerjohansson]
tags: []
---
When posted about the Mona Lisa evolution demo I got a request to make it possible to run it in parallel.  
At first I thought; *“How hard can it be?”  *
But it turned out to be more than hard, I’m starting to think that it is impossible.

<!-- truncate -->

The first approach that everyone points to is:

**1) Run separate islands in parallel.**

The idea is to run a separate island per node in a cluster and let that island have it’s own population of evolving individuals.  
Add one node and the problem is solved twice as fast, add another one and it’s solved three times as fast.

WRONG!

Let’s say that it takes about 10 to 15 minutes to solve the problem on a single machine, then it is very likely that it will take 10 to 15 minutes on other machines to.  
So you will not gain much by adding nodes to this solution since each node will solve the problem in about 10 minutes at best.

No matter if you throw hundreds of nodes at it, the best node will still average in at about 10 minutes.

This is probably the worst solution.

The next solution looks fine in theory:

**2) Run islands in parallel and report back to the root node after each generation.**

This is a similar solution as the first one, but instead of running them in isolation, they report back to the root node after each generation and let the root decide what individuals to keep or discard.  
Let’s say that one out of ten mutations are positive then we increase the chance to get a positive mutation by one tenth per node we add.  
So if we have 10 nodes, then we are very likely to get a positive mutation each generation.

This should solve it, right?

NOPE! (sort of)

The problem with this solution is that it is extremely chatty, the performance gain you get from this is eaten by the overhead of the communication.  
There is allot of data that needs to be passed around each generation.

This could work well if the fitness function takes allot more time than the communication, but in my case it doesn’t.

Attempt 3:

**3) Partition the workload and use deterministic evolution per node.**

I had some big hopes for this one.

The idea was to avoid sending as much data between nodes by using deterministic evolution per node (init the random generator with the same seed).  
So that each node evolves the \_same\_ image, but only renders and calculates fitness for a small part of it and then reports back the partitioned fitness to the root node that then decides if the image should be kept or not.

This way, only the fitness value and an accept message would be passed between nodes and the root.

The communications overhead is sort of small here, so that is all nice.  
So if I have two nodes, one would think that it would only take half the time to render each partition than if you only have one node.

However this turned out to be wrong too, since allot of polygons in the image covers the area for more than one node, those polygons have to be (partially) rendered by multiple nodes.

So instead of getting a 100% performance boost from this, the actual performance gain was only about 35%.

35% faster rendering minus the overhead of communication gives this approach a total perf boost of 25-30% per node.

Not that impressive at all, but it does work.

 

There are also variations on the above approaches, but all of the ones I’ve tried fails on either the communication overhead or bad understanding of probability theory.  
One such example is *“Don’t communicate that often, make a batch and select the best one from that batch”* , that one falls under the probability theory part 😉

Ideas ?
