---
title: "Scheduling"
date: 2020-05-28T16:34:24+02:00
draft: false
tags: [protoactor, docs]
---

# Scheduling Messages

<div className="invert-wrapper">

![scheduling](images/Scheduling-blue.png)

</div>

In C#, we provide the `SimpleScheduler` implementation of the `ISimpleScheduler`interface.
This allows you to do operations such as `ScheduleTellOnce`, `ScheduleRequestOnce` and `ScheduleTellRepeatedly`

```csharp
ISimpleScheduler scheduler = new SimpleScheduler();
var pid = context.Spawn(Actor.FromProducer(() => new ScheduleGreetActor()));

scheduler
    .ScheduleTellOnce(TimeSpan.FromMilliseconds(100), context.Self, new SimpleMessage("test 1"))
    .ScheduleTellOnce(TimeSpan.FromMilliseconds(200), context.Self, new SimpleMessage("test 2"))
    .ScheduleTellOnce(TimeSpan.FromMilliseconds(300), context.Self, new SimpleMessage("test 3"))
    .ScheduleTellOnce(TimeSpan.FromMilliseconds(400), context.Self, new SimpleMessage("test 4"))
    .ScheduleTellOnce(TimeSpan.FromMilliseconds(500), context.Self, new SimpleMessage("test 5"))
    .ScheduleRequestOnce(TimeSpan.FromSeconds(1), context.Self, pid, new Greet("Daniel"))
    .ScheduleTellOnce(TimeSpan.FromSeconds(5), context.Self, new Hello())
    .ScheduleTellRepeatedly(TimeSpan.FromSeconds(3), TimeSpan.FromMilliseconds(500), context.Self, new HickUp(), out timer);
```

```go
timerScheduler := scheduler.NewTimerScheduler(context)
pid := context.Spawn(actor.PropsFromProducer(func() actor.Actor { return &ScheduleGreetActor{} }))

timerScheduler.SendOnce(100*time.Millisecond, context.Self(), &SimpleMessage{Text: "test 1"})
timerScheduler.SendOnce(200*time.Millisecond, context.Self(), &SimpleMessage{Text: "test 2"})
timerScheduler.SendOnce(300*time.Millisecond, context.Self(), &SimpleMessage{Text: "test 3"})
timerScheduler.SendOnce(400*time.Millisecond, context.Self(), &SimpleMessage{Text: "test 4"})
timerScheduler.SendOnce(500*time.Millisecond, context.Self(), &SimpleMessage{Text: "test 5"})
timerScheduler.RequestOnce(time.Second, pid, &Greet{Name: "Daniel"})
timerScheduler.SendRepeatedly(3*time.Second, 500*time.Millisecond, context.Self(), &HickUp{})
```

Another option if you want to perform some form of action after a given period of time is:

```csharp
context.ReenterAfter(Task.Delay(1000), t => {
     //do stuff after 1000ms w/o blocking the actor while waiting
});
```

```go
future := context.RequestFuture(pid, &Work{}, time.Second)
context.ReenterAfter(future, func(res interface{}, err error) {
        if err != nil {
                context.Logger().Error("work request failed", "err", err)
                return
        }
        context.Send(context.Self(), res)
})
```

This will asynchronously wait for the task to complete, then send a message back to the actor itself, containing the
block of code to execute within the actor's concurrency constraint.
