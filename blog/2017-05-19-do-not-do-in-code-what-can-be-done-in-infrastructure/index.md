---
slug: do-not-do-in-code-what-can-be-done-in-infrastructure
title: "Do not do in code what can be done in infrastructure"
authors: [rogerjohansson]
tags: ["akka", "akka-net", "distributed-programming", "infrastructure", "microsoft-orleans"]
---
Or subtitle: *Maybe distributed programming is no longer a programming problem?* (For the obvious impaired: This is meant to be more thought provoking than an actual truth)

<!-- truncate -->

Over the last decade we have seen the emergence of cloud computing, multi core, and micro service architectures.

Due to this there have been a trend for new languages and frameworks for distributed programming.  
Frameworks such as Akka, Microsoft Orleans and languages like Erlang, Elixir or Pony have increased in popularity.

The issue for such tools is that they are all programming concerns, **you have to write code to leverage their power.  **

One of the major benefits of languages like Erlang or the actor model in general is it’s somewhat unique fault tolerance and supervision support.  
You can tell an actor system to ensure that a specific process should always be running, and if it fails, it will be recreated.

Given the introduction of containers, cluster orchestrators and the mindset of *“cattle not pets”*, we can now employ the same or similar ideas on an infrastructural level.  
We can make sure that we always have X instances of a given service or process running in our infrastructure.  
Docker Swarm, Kubernetes, Nomad and others make this possible.

Other infrastructure like Traefik, LinkerD, Envoy makes it possible to do call retries, circuit breakers, rate limiting for service calls,  
Tools like Consul and Etcd gives you service discovery on a DNS level.

**The infrastructural approach is of-course a more blunt, less fine-grained alternative than the actor model or similar tools which gives you complete control.**  
But it is still a step in an interesting direction; **Do not do in code what can be done in infrastructure**.

I am not saying that you should stop using such tools as they are extremely powerful.  
What I am rather asking is; are you aware that this is the case?  
Some of the hype and arguments for these languages or frameworks can now be leveraged cross cutting between your systems in the infrastructure.  
Pick the right tool for the job and Don’t drink the Kool-Aid.
