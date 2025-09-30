---
slug: introducing-akka-net
title: Introducing Akka.NET
authors:
- rogerjohansson
tags:
- actor-model
- async
---
![](./akkanet.png)

<!-- truncate -->

There are a lot of things going on right now.  
First, Pigeon Framework now has a new name; Akka.NET.  
We got OK from Typesafe to use the name since we are a pure port of real Akka.

We are also doing a lot of work on the core and remote libs.  
We now have a real EndpointManager actor managing transports.  
And we have and Endpoint actor for each active endpoint.  
Thus, we now support multiple transports, even if only Tcp is provided out of the box right now.

There have been some progress on Routers too.  
We now support “Group” routers, e.g. RoundRobinGroup and ConsistentHashingGroup.  
“Pool” router support is currently being developed.

Another nice feature we have ported is remote deployment.  
This is IMO maybe the coolest feature we have ported so far, this means that we can now via configuration decide if an actor should be deployed locally or remote.  
If remote deployment is used, the local actor system will send a message to the remote system, telling it to create the given actor with all of its configuration on the remote node.

For more info see: [https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)
