---
slug: random-things-learned-building-akka-net-part-1
title: "Random things learned building Akka.NET – Part 1"
authors: [rogerjohansson]
tags: []
---
In this short post I will explain some of the things I’ve learned building Akka.NET.  
I will describe some of the friction points I have noticed and why I personally don’t use features like Akka Cluster to build ***entire*** systems.  
Some of these thoughts might be obvious, some might be naive, but they do reflect my current view on building distributed systems.

<!-- truncate -->

## Location transparency and Message contracts

Actors are supposed to be location transparent.  
DCom, Corba and .NET remoting were all based on a local model, trying to make remote calls appear as local, in process calls, all failed for this very reason.  
Never try to make the explicit implicit.  
The Actor Model is remote first and can be optimized when used locally.

BUT:  
We constantly fall into the trap of trying to make local message objects somehow become wire friendly.  
Making something that is designed to work local only and try to shoehorn that into a world of network calls will result in problems.

Messages should be designed with a remote first mindset, explicit contracts that can support versioning and be maintained over time.

In Akka.NET we have tried very hard to make serialization just work magically for any message type, currently using Json.NET serializer and soon the Wire serializer.  
This gives you low friction when getting started with Akka.NET, but it is the wrong design to use for real systems.

You should swap that out for a custom serializer using e.g. ProtoBuf, where your message contract are explicit and there are no magic or unexpected behavior involved.

## Distributed monolith and the Unix philosophy

Actor model frameworks and languages does not play nicely between platforms.  
Erlang, Pony, Akka, Akka.NET, Project Orleans, Service Fabric ActFab, Orbit, none of those can communicate with any of the others.  
If you base your entire infrastructure on such framework or language, you are building a distributed monolith.

You pay a very high price when you decide to build your systems this way, none of the components or services in your systems can be replaced with another tech stack, you are forever bound to use the same stack until you replace the entire thing or surgically cut one of the parts out of it.

Instead, architect your systems as isolated islands, bounded contexts, and connect them using standard protocols and contracts, HTTP, JSON, XML, AMQP etc.  
Then inside each of those isolated islands, feel free to use any of the above technologies.

The above does not just apply to actor model frameworks, it applies to any RPC or micro-service framework that have their own special service discovery, clustering support or protocols.

The Unix philosophy should be applied.  
Use tools like Consul, Etcd, Zookeeper for service discovery, Docker using Swarm, Rancher, Kubernetes for deployment and clustering.  
This gives you a lot more flexibility and options.  
If it turns out that one of your choices didn’t work out, there are plenty of others to solve the same problem without completely redesigning your system.

There are of course cases where your system might have special requirements, such as extremely high throughput and/or latency requirements, then other rules apply.  
Maybe you need to build a distributed monolith for such reasons, but it should not be the default when designing a new system.

More on this in the next post.

//Roger
