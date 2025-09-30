---
slug: learning-azure-day-1-servicebus
title: "Learning Azure, Day 1 | Servicebus"
authors: [rogerjohansson]
tags: ["servicebus"]
---
I’ve decided to bite the bullet and finally dig into Azure.

<!-- truncate -->

My first learning experience was to toy around with the Servicebus.  
Azure Servicebus is a message queue pretty much like the old MSMQ, but with a few more nifty features.  
e.g. messages can have a time to live duration, you can chose between At most once or At least once delivery (`ReceiveMode.ReceiveAndDelete` vs `ReceiveMode.PeekLock`).

The first gotcha was that the sample I downloaded from MS, recreated the queue I intended to communicate with.  
Which in turn causes your credentials for the queue to disappear, don´t fall for that 🙂

It also turns out that the built in batch operations are way more performant than single operations.  
So if possible, go for batching if you need high throughput.

Another thing that was expected but maybe not to that extent, was that using `ReceiveAndDelete` gives a lot better throughput than using `PeekLock`.  
Using PeekLock, you have to Ack back to the queue yourself to notify the queue that you have dealt with the message.

This was using a single threaded client, so maybe the difference is not that big if processing async, I don’t know yet, but in the very naive example I’m using, there was a huge difference.

And for those who are just looking for some example code, here it is:

```
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.ServiceBus.Messaging;

namespace ConsoleApplication5
{
    class Program
    {
        private static QueueClient _queueClient;
        static void Main(string[] args)
        {          
            Console.WriteLine("Press anykey to start sending messages ...");
            Console.ReadKey();
            SendMessages();
            Console.WriteLine("Press anykey to start receiving messages that you just sent ...");
            Console.ReadKey();
            ReceiveMessages();
            Console.WriteLine("nEnd of scenario, press anykey to exit.");
            Console.ReadKey();
        }

        private static void SendMessages()
        {
            // connect to queue named "queue1"
            // use At most once delivery
            _queueClient = QueueClient.Create("queue1", ReceiveMode.ReceiveAndDelete);

            var messageList = new List<BrokeredMessage>();

            for (int i = 0; i < 1000; i++)
            {
                messageList.Add(new BrokeredMessage("Some message")
                {
                    MessageId = i.ToString(CultureInfo.InvariantCulture)
                });
            }

            Console.WriteLine("nSending messages to Queue...");

            // send 1000 messages to the queue
            _queueClient.SendBatch(messageList);
        }

        private static void ReceiveMessages()
        {
            Console.WriteLine("nReceiving message from Queue...");

            while (true)
            {
                //receive a batch of messages from Queue
                var messages = _queueClient.ReceiveBatch(100,
                    TimeSpan.FromMilliseconds(500)).ToList();

                Console.WriteLine("nDone...");

                foreach (var message in messages)
                {
                    if (message != null)
                    {
                        Console.WriteLine("Message received: Id = {0}, Body = {1}", 
                            message.MessageId, message.GetBody<string>());
                    }
                }
            }
        }
    }
}
```
