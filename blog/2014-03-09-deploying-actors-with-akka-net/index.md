---
slug: deploying-actors-with-akka-net
title: "Deploying actors with Akka.NET"
authors: [rogerjohansson]
tags: ["actors", "akka", "deployment", "remoting"]
---
We have now ported both the code and configuration based deployment features of Akka.  
This means that you can now use Akka.NET to deploy actors and routers on remote nodes either via code or configuration.

<!-- truncate -->

For those new to akka what does this mean?

Let’s say that we are building a simple local actor system.  
It might have one actor that deals with user input and another actor that does some sort of work.

It could look something like this:

```csharp
var system = ActorSystem.Create("mysystem");
var worker = system.ActorOf<WorkerActor>("worker");
var userInput = system.ActorOf<UserInput>("userInput");
while(true)
{
    var input = Console.ReadLine();
    userInput.Tell(input);
}
```

Ok, maybe a bit cheap on the user experience there, but lets keep the sample small..  
Depending on input, the user input actor might pass messages to the worker and order it to perform some sort of work.

Now, lets say that it turns out that our worker can’t handle the load, since actors (act as if they) are single threaded, we might want to add additional workers.  
Instead of letting the user input actor know how many workers we have, we can introduce the concept of “Routers”.

Router actors act as a facade on top of other actors, this means that the router can delegate incoming messages to a pool or group of underlying actors.

```csharp
var system = ActorSystem.Create("mysystem");
var worker1 = system.ActorOf<Worker>("worker1");
var worker2 = system.ActorOf<Worker>("worker2");
var worker3 = system.ActorOf<Worker>("worker3");

var worker = system.ActorOf(Props.Empty.WithRouter(new RoundRobinGroup(new[] { worker1, worker2, worker3 })));

var userInput = system.ActorOf<UserInput>("userInput");
while(true)
{
    var input = Console.ReadLine();
    userInput.Tell(input);
}
```

Here we have introduced three worker actors and one “round robin group” router.  
A round robin group router is a router that will use an array of workers and for each message it receives, it will delegate that message the one of the workers.

We do not need to change any of the other code, as long as the user input actor can find the worker router, we are good to go.

If we want to accomplish the same thing, but using a config instead, we can something like this:

```csharp
 var config = ConfigurationFactory.ParseString(@"
    akka.actor.deployment {
            /worker {
                router = round-robin-pool
 # pool routers are not yet implemented
 # you have to use the group routers with an array of workers still
                nr-of-instances = 5
            }
");
var system = ActorSystem.Create("mysystem",config);
var worker = system.ActorOf<Worker>("worker");
var userInput = system.ActorOf<UserInput>("userInput");
while(true)
{
    var input = Console.ReadLine();
    userInput.Tell(input);
}
```

The worker router is no longer configured via code but rather ia a soft config, that could be placed in an external file if you want.  
This means that we can scale up and utilize more CPU of our computer just by changing our configuration.  
But what if this is still not enough?  
We might need to scale out also, and introduce more machines.  
This can be done using “remote deployment”, like this:

```csharp
 var config = ConfigurationFactory.ParseString(@"
    akka.actor.deployment {
            /worker {
                router = round-robin-pool
                nr-of-instances = 5
                remote = akka.tcp://otherSystem@someMachine:8080
            }

    ....more config to set up Akka.Remote
");
var system = ActorSystem.Create("mysystem",config);
var worker = system.ActorOf<Worker>("worker");
var userInput = system.ActorOf<UserInput>("userInput");
while(true)
{
    var input = Console.ReadLine();
    userInput.Tell(input);
}
```

Using this configuration, we can now tell Akka.NET to deploy the worker router on a different machine.  
The settings will be read from the config, packed on a remoting message and sent to the remote system that we want to create our  
worker router on.  
(This of course means that Akka.NET must run on the remote machine and listen to the port specified on the config)

So by just adding configuration, we can now scale up and out from a single machine to a remote server, or even a cloud provider e.g. Azure.

That’s all for now 🙂

For more info, see: [https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)
