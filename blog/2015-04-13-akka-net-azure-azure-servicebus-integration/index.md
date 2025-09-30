---
slug: akka-net-azure-azure-servicebus-integration
title: "Akka.NET + Azure: Azure ServiceBus integration"
authors: [rogerjohansson]
tags: []
---
I know that there is some confusion out there on how Akka.NET relates to products like NServiceBus and Azure ServiceBus, I think that Akka.NET Co-founder Aaron Stannard said it the best;

<!-- truncate -->

> they’re very complimentary Akka.NET makes a great consumer or producer for NServiceBus

Another closely related question that comes up from time to time is how to integrate Akka.NET actors with service buses.

How can we pull messages from a service bus and pass those to a number of worker actors w/o message loss?

One approach we can use to solve this is since actors in Akka.NET support the `Ask` operator.  
We can pass a message to an actor and expect a response, this response will be delivered in form of a `Task`.

As the response is a task, we can pipe this task into a continuation and depending on if the response represents a processing success or failure from the worker actor, we can then decide what we want to do with the service bus message.

In this case, we might want to Ack the service bus message, telling the service bus that we are done with this message and it can be removed from the queue.

If the response was a failure, just ignore the failure and continue processing other messages.  
As we haven’t acked the message to the service bus, the service bus will try to re-deliver the message to our client and we get the chance to try again some time later.

A simple implementation of this approach using Azure Service bus could look something like this:

```
namespace ConsoleApplication13
{
    //define your worker actor
    public class MyBusinessActor : ReceiveActor
    {
        public MyBusinessActor()
        {
            //here is where you should receive your business messages
            //apply domain logic, store to DB etc.
            Receive<string>(str =>
            {
                Console.WriteLine("{0} Processed {1}", Self.Path, s);

                //reply to the sender that everything went well
                //in this example, we pass back the message we received in a built in `Success` message
                //you can send back a Status.Failure incase of exceptions if you desire too
                //or just let it fail by timeout as we do in this example
                Sender.Tell(new Status.Success(s));
            });
        }
    }

    internal class Program
    {
        private static void Main(string[] args)
        {
            CreateMessages();

            using (var system = ActorSystem.CreateSystem("mysys"))
            {
                //spin up our workers
                //this should be done via config, but here we use a
                //hardcoded setup for simplicity

                //Do note that the workers can be spread across multiple
                //servers using Akka.Remote or Akka.Cluster
                var businessActor =
                    system.ActorOf(Props
                       .Create<MyBusinessActo>()
                       .WithRouter(new ConsistentHashingPool(10)));

                //start the message processor
                ProcessMessages(businessActor);

                //wait for user to end the application
                Console.ReadLine();
            }
        }

        private static async void ProcessMessages(IActorRef myBusinessActor)
        {
            //set up a azure SB subscription client
            //(or use a Queue client, or whatever client your specific MQ supports)
            var subscriptionClient = SubscriptionClient.Create("service1","service1");

            while (true)
            {
                //fetch a batch of messages
                var batch = await subscriptionClient.ReceiveBatchAsync(100, TimeSpan.FromSeconds(1));

                //transform the messages into a list of tasks
                //the tasks will either be successful and ack the MQ message
                //or they will timeout and do nothing
                var tasks = (
                    from res in batch
                    let importantMessage = res.GetBody<string>()
                    let ask = myBusinessActor
                        .Ask<Status.Success>(new ConsistentHashableEnvelope(importantMessage,
                            importantMessage.GetHashCode()),TimeSpan.FromSeconds(1))
                    let done = ask.ContinueWith(t =>;
                    {
                        if (t.IsCanceled)
                        {
                            Console.WriteLine("Failed to ack {0}", importantMessage);
                        }
                        else
                        {
                            res.Complete();
                            Console.WriteLine("Completed {0}", importantMessage);
                        }
                    },TaskContinuationOptions.None)
                    select done).ToList();

                //wait for all messages to either succeed or timeout
                await Task.WhenAll(tasks);
                Console.WriteLine("All messages handled (acked or failed)");
                //continue with the next batch
            }
        }

        //dummy method only used to prefill the msgqueue with data for this example
        private static void CreateMessages()
        {
            var client = TopicClient.Create("service1");

            for (var i = 0; i < 100; i++)
            {
                client.SendAsync(new BrokeredMessage("hello" + i)
                {
                    MessageId = Guid.NewGuid().ToString()
                });
            }
        }
    }
}
```

But do note that when applying this pattern, we now go from the default Akka.NET *“At most once”* deliver to *“At least once”.*

Why?

Because if we fail to ack the message back to the service bus, we will eventually receive the same message again at a later time.

It could be that our worker actor have processed the message correctly, stored it in some persistent store, but the ack back to the client might have failed, network problems, timeout or something similar.

Thus, the wervice bus meesage will not be removed from the queue and the client will receive it as soon as whatever locking mechanism is in place frees the message again.

One extremely nice feature in Akka.NET is the cluster support. cluster nodes can be added or removed to a live application, so we can easily spread our load over multiple worker actors on remove nodes.

Completely w/o writing any special code for this, we just need to configure our actor system to be part of a Akka.NET cluster.

HTH
