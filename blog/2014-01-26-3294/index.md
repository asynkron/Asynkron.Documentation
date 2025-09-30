---
slug: 3294
title: "Configuration and Remote support for Pigeon – Akka Actors for .NET"
authors: [rogerjohansson]
tags: ["actor-model", "akka", "pigeon"]
---
I’ve been working quite a bit on my Akka port this weekend.  
Finally got a a configuration system in place.  
Trying to stay close to how Akka works, I decided to go for a Json based configuration, this is fairly close to the real Akka configurations while still not beeing too alien to .NET developers.

<!-- truncate -->

A config could look something like this:

```
Pigeon : {
    Actor : {
        Serializers : {
            json : ""Pigeon.Serialization.JsonSerializer"",
            java : ""Pigeon.Serialization.JavaSerializer"",
            proto : ""Pigeon.Remote.Serialization.ProtobufSerializer""
        },
        DefaultDispatcher: {
            Throughput : 100
        }
    },
    Remote : {
        Server : {
            Host : ""127.0.0.1"",
            Port : 8080
        }
    }
}
```

Remoting is also treated as an extension to the ActorSystem, so there is no longer any awkward subclass, like this:

```
using (var system = ActorSystem.Create("MyClient",config,new RemoteExtension()))
{
```

So now it’s possible to actually use Pigeon on two different machines using the config for host/port.

Read more at: [https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)
