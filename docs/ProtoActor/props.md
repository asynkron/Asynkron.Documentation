---
layout: docs.hbs
title: Props
---

# Props

The Props are used to configure and construct the Actor and its Context.
A form of blueprint on how to assemble an actor.

<div className="invert-wrapper">

![props header](images/Props-all-blue.png)

</div>

## Creating Props

The simplest way is to use one the Actor convenience methods, `FromProducer()` or `FromFunc()`. E.g.:

**From an actor producer delegate**

```csharp
var props = Actor.FromProducer(() => new MyActor());
```

```go
props := actor.PropsFromProducer(func() actor.Actor { return &MyActor{} })
```

**From an actor receive delegate**

```csharp
var props = Actor.FromFunc(context =>
    {
        Console.WriteLine($"Received message {context.Message}");
        return Task.CompletedTask;
    });
```

```go
props := actor.PropsFromFunc(func(context actor.Context) {
        fmt.Printf("Received message %v\n", context.Message())
})
```

## Customizing Props

Props exposes a number of methods for customizing the Actor. The following example shows the different methods and their usage (along with defaults where applicable). Some of these will rarely be necessary to change (e.g. Mailbox, Dispatcher, and Spawner) but are included for sake of completeness.

```csharp
var props = new Props()
    // the producer is a delegate that returns a new instance of an IActor
    .WithProducer(() => new MyActor())
    // the default dispatcher uses the thread pool and limits throughput to 300 messages per mailbox run
    .WithDispatcher(new ThreadPoolDispatcher { Throughput = 300 })
    // the default mailbox uses unbounded queues
    .WithMailbox(() => UnboundedMailbox.Create())
    // the default strategy restarts child actors a maximum of 10 times within a 10 second window
    .WithChildSupervisorStrategy(new OneForOneStrategy((who, reason) => SupervisorDirective.Restart, 10, TimeSpan.FromSeconds(10)))
    // middlewares can be chained to intercept incoming and outgoing messages
    // receive middlewares are invoked before the actor receives the message
    // sender middlewares are invoked before the message is sent to the target PID
    .WithReceiveMiddleware(
        next => async c =>
        {
            Console.WriteLine($"middleware 1 enter {c.Message.GetType()}:{c.Message}");
            await next(c);
            Console.WriteLine($"middleware 1 exit");
        },
        next => async c =>
        {
            Console.WriteLine($"middleware 2 enter {c.Message.GetType()}:{c.Message}");
            await next(c);
            Console.WriteLine($"middleware 2 exit");
        })
    .WithSenderMiddleware(
        next => async (c, target, envelope) =>
        {
            Console.WriteLine($"middleware 1 enter {c.Message.GetType()}:{c.Message}");
            await next(c, target, envelope);
            Console.WriteLine($"middleware 1 enter {c.Message.GetType()}:{c.Message}");
        },
        next => async (c, target, envelope) =>
        {
            Console.WriteLine($"middleware 2 enter {c.Message.GetType()}:{c.Message}");
            await next(c, target, envelope);
            Console.WriteLine($"middleware 2 enter {c.Message.GetType()}:{c.Message}");
        })
    // the default spawner constructs the Actor, Context and Process
    .WithSpawner(Props.DefaultSpawner);
```

```go
props := actor.PropsFromProducer(func() actor.Actor { return &MyActor{} },
    // configure a dispatcher with explicit throughput
    actor.WithDispatcher(actor.NewDefaultDispatcher(300)),
    // swap the mailbox implementation
    actor.WithMailbox(actor.Unbounded()),
    // supervise children using a restart strategy
    actor.WithSupervisor(actor.NewOneForOneStrategy(10, 10*time.Second, func(reason interface{}) actor.Directive {
            return actor.RestartDirective
    })),
    // register receive middleware to run before and after actor processing
    actor.WithReceiverMiddleware(func(next actor.ReceiverFunc) actor.ReceiverFunc {
            return func(ctx actor.ReceiverContext, envelope *actor.MessageEnvelope) {
                    fmt.Printf("middleware 1 enter %T\n", envelope.Message)
                    next(ctx, envelope)
                    fmt.Println("middleware 1 exit")
            }
    }),
    actor.WithSenderMiddleware(func(next actor.SenderFunc) actor.SenderFunc {
            return func(sender actor.SenderContext, target *actor.PID, envelope *actor.MessageEnvelope) {
                    fmt.Println("sender middleware 1 enter")
                    next(sender, target, envelope)
                    fmt.Println("sender middleware 1 exit")
            }
    }),
)
```

## See also

- [Dispatchers](dispatchers.md)
- [Mailboxes](mailboxes.md)
- [Supervision](supervision.md)
- [Middleware](middleware.md)
