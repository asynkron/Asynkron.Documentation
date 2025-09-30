---
slug: throughput-of-pigeon-akka-actors-for-net
title: "Throughput of Pigeon \u2013 Akka Actors for .NET"
authors:
- rogerjohansson
tags:
- actor-model
- throughput
---
As some of you might know, I’m making an unofficial port of Akka for .NET.  
[https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon).  
(Why not Akka# or dotAkka? I simply assume that TypeSafe that makes Akka don’t want to be associated with spare time projects like this, so I try not to stain their brandname)

<!-- truncate -->

One important factor of a successful actor framework is how fast you are able to process messages – less overhead on message processing means better scalability.  
Akka made some noise when they managed to process 50 million messages per second in their ping-pong benchmark example on an 48 core server.

I’ve now ported this benchmark to Pigeon so that one can get a hint of how the two compares.  
This is the results from an 8 core laptop:

```text
 Worker threads: 1023
 OSVersion: Microsoft Windows NT 6.2.9200.0
 ProcessorCount: 8
 ClockSpeed: 3392 MHZ
 Actor count, Messages/sec
 2, 7073000 messages/s
 4, 11760000 messages/s
 6, 14534000 messages/s
 8, 18039000 messages/s
 10, 20161000 messages/s
 12, 18785000 messages/s
 14, 17523000 messages/s
 16, 17482000 messages/s
 18, 17931000 messages/s
 20, 18575000 messages/s
 22, 18975000 messages/s
 24, 20920000 messages/s
```

I’m pretty pleased with the performance so far.  
The code for the benchmark actors looks like this:

```csharp
private static object Msg = new object();
private static object Run = new object();

public class Destination : UntypedActor
{
    protected override void OnReceive(object message)
    {
        if (message == Msg)
            Sender.Tell(Msg);
    }
}

public class Client : UntypedActor
{
    public long received;
    public long sent;

    public long repeat;
    private ActorRef actor;
    private TaskCompletionSource<bool> latch;

    public Client(ActorRef actor,long repeat,TaskCompletionSource<bool> latch )
    {
        this.actor = actor;
        this.repeat = repeat;
        this.latch = latch;
    }
    protected override void OnReceive(object message)
    {
        if (message == Msg)
        {
            received++;
            if (sent < repeat)
            {
                actor.Tell(Msg);
                sent++;
            }
            else if (received >= repeat)
            {
                latch.SetResult(true); //instead of java countDownLatch
            }
        }
        if (message == Run)
        {
            for (int i = 0; i < Math.Min(1000,repeat); i++)
            {
                actor.Tell(Msg);
                sent++;
            }
        }
    }
}
```

If there are anyone out there that would like to join building a high performance Actor Model framework (staying as close to Akka as possible), let me know.
