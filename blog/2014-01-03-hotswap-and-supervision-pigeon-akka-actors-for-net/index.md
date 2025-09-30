---
slug: hotswap-and-supervision-pigeon-akka-actors-for-net
title: "Hotswap and Supervision – Pigeon – Akka Actors for .NET"
authors: [rogerjohansson]
tags: ["actor-model", "akka", "async", "pigeon"]
---
This is a follow up on my previous post; [http://rogeralsing.com/2014/01/01/pigeon-akka-actors-for-net/](http://rogeralsing.com/2014/01/01/pigeon-akka-actors-for-net/)

<!-- truncate -->

The code for this project can be found here: [https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)

***And again, before I begin, please do note that Pigeon is just my hobby project of cloning some of the Akka Actor API.***

***Akka is in no way affiliated with me or my project.***

I’ve done some refactoring to mimic Akka’s API more closely.  
e.g. I’ve removed the need for IMessage on messages, you can now pass any object as an actor message.

I’ve also added some more nifty features from Akka – Hotswap and Supervision.

**Hotswap** is the ability to change the message receiver, this is useful if you have some sort of state machine, e.g. if you receive one message and you want to handle messages differently once that message is received.

Like this:

```
public class GreetingActor : UntypedActor
{
    protected override void OnReceive(IMessage message)
    {
        Pattern.Match(message)
            .With<Greet>(m => {
                Console.WriteLine("Hello {0}", m.Who);
                //this could also be a lambda
                Become(OtherReceive);
            });
    }

    void OtherReceive(IMessage message)
    {
        Pattern.Match(message)
            .With<Greet>(m => {
                Console.WriteLine("You already said hello!");
                //Unbecome() to revert to old behavior
            });
    }
}
```

In the example above, the actor will first output “Hello {who}” if a Greet message is passed to it.  
But if we pass another greet message to it, it will output “You already said hello”.  
This is ofcourse a contrived example, but it is very useful for larger state machines.  
e.g. Lets say we write a game and each player/bot has its own actor.  
We could then make it respond differently if you are stunned, dead, or trapped by some spell or whatever.

You can read more about this feature in the Akka documentation here: [http://doc.akka.io/docs/akka/snapshot/java/untyped-actors.html#HotSwap](http://doc.akka.io/docs/akka/snapshot/java/untyped-actors.html#HotSwap)

The next feature is **Supervision**, supervision lets a parent actor monitor it’s children and decide what to do if they start failing.  
e.g. you can configure it to restart, restart or escalate if an exception of a given type occurs too many times in a given timespan.

Like this:

```
public class MyActor : UntypedActor
{
    private ActorRef logger = Context.ActorOf<LogActor>();

    // if any child, e.g. the logger above. throws an exception
    // apply the rules below
    // e.g. Restart the child if 10 exceptions occur in 30 seconds or less
    protected override SupervisorStrategy SupervisorStrategy()
    {
        return new OneForOneStrategy(
            maxNumberOfRetries: 10,
            duration: TimeSpan.FromSeconds(30),
            decider: x =>
            {
                if (x is ArithmeticException)
                    return Directive.Resume;
                if (x is NotSupportedException)
                    return Directive.Stop;

                return Directive.Restart;
            });
    }

    ...
}
```

The “logger” above is a child actor of “MyActor”, this means that MyActor is the parent and supervisor for logger.  
If logger starts throwing exceptions, those will be forwarded to the supervisor strategy, and depending on configuration, the parent can resolve the issue by restarting or stopping the child etc.  
You can read about this in the Akka documentation: [http://doc.akka.io/docs/akka/snapshot/general/supervision.html](http://doc.akka.io/docs/akka/snapshot/general/supervision.html)
