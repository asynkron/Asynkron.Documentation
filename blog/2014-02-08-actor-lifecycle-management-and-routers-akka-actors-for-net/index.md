---
slug: actor-lifecycle-management-and-routers-akka-actors-for-net
title: "Actor lifecycle management and routers – Akka Actors for .NET"
authors: [rogerjohansson]
tags: ["actor-model", "akka", "routing", "supervision"]
---
## Porting Akka to .NET

<!-- truncate -->

<span style="font-style:inherit;line-height:1.625;">I finally got around to implement full lifecycle management in Pigeon.  
</span>The Pigeon actor behavior is now consistent with real Akka.

The following Scala test: [https://github.com/akka/akka/blob/master/akka-actor-tests/src/test/scala/akka/actor/ActorLifeCycleSpec.scala  
](https://github.com/akka/akka/blob/master/akka-actor-tests/src/test/scala/akka/actor/ActorLifeCycleSpec.scala)Is now ported to .NET and shows that the lifecycle events fire in the expected order: [https://github.com/rogeralsing/Pigeon/blob/master/Pigeon.Tests/ActorLifeCycleSpec.cs](https://github.com/rogeralsing/Pigeon/blob/master/Pigeon.Tests/ActorLifeCycleSpec.cs)

I’ve also managed to port the fundamentals of the Akka Routers, so RoundRobinGroup routing is now in place: [https://github.com/rogeralsing/Pigeon/wiki/Routing](https://github.com/rogeralsing/Pigeon/wiki/Routing)

Completely boring blogpost but this is what I’ve been up to the last few days 🙂
