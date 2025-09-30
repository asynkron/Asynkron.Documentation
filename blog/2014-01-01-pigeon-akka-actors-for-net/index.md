---
slug: pigeon-akka-actors-for-net
title: "Pigeon – Akka Actors for .NET"
authors: [rogerjohansson]
tags: ["actor-model", "akka", "pigeon"]
---
I’m working on a port of the Java/Scala framework **Akka**, or rather the Actor Model part of it.  
As of now, this is only a bit more than a weekend hack, so don’t expect too much.  
But I already have a couple of nice features in:

<!-- truncate -->

Git hub repository goes here: [https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)

**Write your first actor:**

```csharp
public class Greet : IMessage
{
    public string Who { get; set; }
}

public class GreetingActor : UntypedActor
{
    protected override void OnReceive(IMessage message)
    {
        message.Match()
            .With(m => Console.WriteLine("Hello {0}", m.Who));
    }
}
```

**Usage:**

```csharp
var system = new ActorSystem();
var greeter = system.ActorOf("greeter");
greeter.Tell(new Greet { Who = "Roger" }, ActorRef.NoSender);
```

**Remoting support:**

```csharp
//Server Program.CS
var system = ActorSystemSignalR.Create("myserver", "http://localhost:8080);
var greeter = system.ActorOf("greeter");
Console.ReadLine();

//Client Program.CS
var system = new ActorSystem();
var greeter = system.ActorSelection("http://localhost:8080/greeter");
//pass a message to the remote actor
greeter.Tell(new Greet { Who = "Roger" }, ActorRef.NoSender);
```

There are still alot of things that needs to be implemented/fixed.  
Actor paths don’t work correctly at the momeent for example.  
Supervision and other features are missing etc.

One nice feature I managed to squeeze in was “Futures”.  
Futures in Akka is pretty much Task of T in .NET.  
~~However, Futures in Akka is synchronous and you need to (bussy) wait for them to complete.~~  
**\[edit\]**  
As Alexey Romanov pointed out in the comments, this is not true.  
You can get async futures using either onComplete callbacks,  
or using Scala async support [https://github.com/scala/async and use async/await](https://github.com/scala/async%20and%20use%20async/await).

In Pigeon however, we have Async/Await support.

You can async await responses from other actors like this:

```csharp

//inside an actor
var result = await Ask(someActor, messageToAsk);
result.Match()
    .With(m => {
         Console.WriteLine("got awaited result {0}",m);
    })
    .Default(_ => Console.WriteLine("Unknown message"));
```

The nice thing is that the await continuation will execute in the actor context, so there is no threading issues inside the actor here.

Hope you like it 🙂
