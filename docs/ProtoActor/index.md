---
title: "Proto.Actor Documentation"
date: 2020-05-28T16:34:24+02:00
draft: false
tags: [protoactor, docs]
---

# Proto.Actor Framework

## TL;DR: Just show me the code!

:::tip Project links
- Official site: [proto.actor](https://proto.actor)
- Source repositories: [asynkron/protoactor-dotnet](https://github.com/asynkron/protoactor-dotnet), [asynkron/protoactor-go](https://github.com/asynkron/protoactor-go)
- Example repositories: [Proto.Actor .NET examples](https://github.com/asynkron/protoactor-dotnet/tree/dev/examples), [Proto.Actor Go examples](https://github.com/asynkron/protoactor-go/tree/dev/examples)
:::

## Recommended learning path

1. **Start here → Hello World & Getting Started** – Run your first actor and learn the essentials of the API surface.
   - [Hello World](hello-world)
   - [Getting Started](getting-started)
2. **Explore core concepts** – Understand why Proto.Actor exists and the vocabulary used throughout the docs.
   - [What is Proto.Actor?](what-is-protoactor)
   - [Why Proto.Actor](why-protoactor)
   - [Design Principles](design-principles)
   - [Features](features)
3. **Build actors locally** – Learn how actors are configured, spawned, and communicate inside a single node.
   - [Actor](actors.md)
   - [Props](props.md)
   - [Spawning Actors](spawn.md)
   - [Message Patterns](message-patterns.md)
4. **Connect processes with Remote** – Send messages across processes or machines with confidence.
   - [Remote](remote.md)
   - [Message Serialization](serialization.md)
   - [Remote Spawning](remote-spawn.md)
   - [gRPC Compression](grpc-compression.md)
5. **Scale out with Cluster** – Introduce virtual actors, identity lookup, and production-grade hosting.
   - [Cluster of virtual actors / grains](cluster.md)
   - [Getting Started With Grains / Virtual Actors (.NET)](cluster/getting-started-net.md)
   - [Getting Started With Grains / Virtual Actors (Go)](cluster/getting-started-go.md)
   - [Deploy to Kubernetes](cluster/getting-started-kubernetes.md)
6. **Level up operations & patterns** – Instrument, benchmark, and apply proven messaging patterns.
   - [Observability Cookbook](observability-cookbook.md)
   - [Benchmarks](performance/benchmarks.md)
   - [Useful Patterns](#useful-patterns)

## Language coverage quick reference

| Topic | .NET resources | Go resources |
| --- | --- | --- |
| Getting started with grains / virtual actors | [Getting Started (.NET)](cluster/getting-started-net.md) | [Getting Started (Go)](cluster/getting-started-go.md) |
| Cluster code generation | [Generating grains (.NET)](cluster/codegen-net.md) | — |
| Cluster providers | [Cluster providers (.NET)](cluster/cluster-providers-net.md) | — |
| Virtual actors deep dive | [Working with a cluster (.NET)](cluster/using-cluster-net.md) | [Virtual Actors](cluster/virtual-actors-go.md) |
| Integration testing guidance | [Integration Testing (.NET)](integration-tests.md) | — |
| Dependency injection | [Dependency Injection (.NET)](di.md) | — |
| Futures and async responses | — | [Futures (Go)](futures.md) |

## Foundations

### Introduction

- [What is Proto.Actor?](what-is-protoactor)
- [Why Proto.Actor](why-protoactor)
- [Design Principles](design-principles)
- [Features](features)

### Core concepts

- [What is an Actor?](actors.md)
- [What is a Message?](messages.md)
- [Actor Communication](communication.md)
- [Terminology, Concepts](terminology.md)
- [Supervision and Monitoring](supervision.md)
- [Fault Tolerance](fault-tolerance.md)
- [Actor lifecycle](life-cycle.md)
- [Location Transparency](location-transparency.md)
- [Message Delivery Reliability](durability.md)
- [Message Patterns](message-patterns.md)
- [Actors vs Queues and Logs](actors-vs-queues.md) - Comparison and decision guide for messaging primitives
- [Backpressure and Flow Control](backpressure.md)
- [Consistency Models](consistency-models.md)
- [CAP Theorem](cap-theorem.md)
- [Consensus and Leader Election](consensus.md)
- [Service Discovery](service-discovery.md)
- [Sharding and Data Partitioning](sharding-and-partitioning.md)

## Build actor systems

### Actor runtime building blocks

- [Actor](actors.md) - What are actors?
  - [Props](props.md) - How do I configure actors?
  - [Spawning Actors](spawn.md) - How do I instantiate actors?
  - [PID](pid.md) - How do I communicate with actors?
  - [Context](context.md) - What are actor and root contexts?
    - [ReenterAfter](reenter.md) - How do I handle reentrancy in actors?
  - [Mailboxes](mailboxes.md) - How does the actor process messages?
  - [Deadletter](deadletter.md) - What happens to lost messages?
  - [Router](routers.md) - How do I forward messages to pools or groups of workers?
  - [Eventstream](eventstream.md) - How are infrastructure events managed?
  - [Behaviors](behaviors.md) - How do I build state machines with actors?
  - [Middleware](middleware.md) - How do I intercept or observe messages between actors?
  - [Receive Timeout](receive-timeout.md) - How do I trigger code when actors go idle?
  - [Dispatchers](dispatchers.md) - How do I tweak how and where actors execute?
  - [Dealing with deadlocks](deadlocks.md)
- [Persistence of actor's state](persistence.md) - How do I persist state for actors?
  - [Using 3rd party libraries](persistence-proto-persistence.md) - How do I persist state using external libraries?
- [SimpleScheduler](scheduling.md) - How do I send messages on a timer?
- [Built in messages](messages)

### Distributed communication

- [Remote](remote.md) - How do I communicate with actors on other nodes?
  - [Message Serialization](serialization.md)
  - [Remote Spawning](remote-spawn.md) - How do I spawn actors on other nodes?
  - [gRPC Compression](grpc-compression.md) - How do I use gRPC compression for remote communication?
- [Cluster of virtual actors / grains](cluster.md) - How do I build clusters of grains / virtual actors?
  - [Working with a cluster (.NET)](cluster/using-cluster-net.md)
  - [Generating grains (.NET)](cluster/codegen-net.md)
  - [Cluster providers (.NET)](cluster/cluster-providers-net.md) - What different clustering options do I have?
    - [Kubernetes Provider](cluster/kubernetes-provider-net.md)
    - [Consul Provider](cluster/consul-net.md)
    - [AWS ECS Provider](cluster/aws-provider-net.md)
    - [Seed Provider - Experimental](cluster/seed-provider-net.md)
  - [Identity lookup (.NET)](cluster/identity-lookup-net.md) - How to locate a virtual actor?
  - [Member strategies (.NET)](cluster/member-strategies.md) - Which member will host the virtual actor?
  - [Gossip](cluster/gossip.md) - How can I share state across cluster members?
  - [Blocklist](cluster/blocklist.md) - How do I handle blocked status of a member?
  - [Cluster Pub-Sub - Experimental](cluster/pub-sub.md) - How to broadcast messages in the cluster?
  - [Virtual Actors](cluster/virtual-actors-go.md) - How do I create virtual actors and spawn them in the cluster?
  - [Integration Testing](integration-tests.md) -  How do I integration-test virtual actors?

## Utility features

- [AsyncSemaphore](asyncsemaphore.md) - How do I limit concurrency to a given resource?
- [Batching Mailbox](mailboxes.md#batching-mailbox) - How do I collect many events and process as single one unit?
- [Throttle](throttle.md) - How do I throttle method calls?
- [Futures (Go)](futures.md) - How do I react to task completions?
- [Dependency Injection (.NET)](di.md) - How do I configure actors using Dependency Injection?
- [Extensions and Context Decorator](context-decorator.md) - How do I extend Proto.Actor with custom behaviors?

## Advanced topics by persona

### Operators and SREs

- [Deploy to Kubernetes](cluster/getting-started-kubernetes.md) - Step-by-step deployment walkthrough.
- [Observability Cookbook](observability-cookbook.md) - Dashboards, tracing, and alerting recipes.
- [Tracing](tracing.md)
- [Metrics](metrics.md)
- [Logging](logging.md)
- [Health Checks](health-checks.md)
- [Benchmarks](performance/benchmarks.md)
- [Dotnetos performance review](performance/dotnetos.md)

### Language-specific developers

- **.NET**
  - [Getting Started With Grains / Virtual Actors (.NET)](cluster/getting-started-net.md)
  - [Working with a cluster (.NET)](cluster/using-cluster-net.md)
  - [Generating grains (.NET)](cluster/codegen-net.md)
  - [Cluster providers (.NET)](cluster/cluster-providers-net.md)
  - [Dependency Injection (.NET)](di.md)
  - [Integration Testing (.NET)](integration-tests.md)
- **Go**
  - [Getting Started With Grains / Virtual Actors (Go)](cluster/getting-started-go.md)
  - [Virtual Actors](cluster/virtual-actors-go.md)
  - [Futures (Go)](futures.md)

## Useful Patterns

- [Ask Pattern](ask-pattern.md)
- [Idempotency in Messaging](idempotency.md)
- [Message Throttling](throttling.md)
- [Work Pulling Pattern](work-pulling.md)
- [Limit Concurrency](limit-concurrency.md)
- [Scheduling Periodic Messages](scheduling.md)
- [Envelope Pattern](envelope-pattern.md)
- [Local Affinity](local-affinity.md)
- [Placement Strategies](placement-strategies.md)
- [Coordinated Persistence](coordinated-persistence.md)
- [Batched Persistence](persistence.md#batched-persistence)
- [Circuit Breaker Pattern](circuit-breaker.md)
- [Supervisor Strategy Recipes](supervisor-strategy-recipes.md)

## Additional Information

- [Core vs contrib Proto.Actor components](core-contrib-components.md)
- [Proto.Actor vs Erlang and Akka](protoactor-vs-erlang-akka.md)
- [Books](books.md)
