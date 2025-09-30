---
slug: f-style-mailbox-agent-using-c-async-ctp
title: "F# style Mailbox / Agent using C# async CTP"
authors: [rogerjohansson]
tags: []
---
More info on TPL DataFlow can be found here : [http://www.microsoft.com/downloads/en/details.aspx?FamilyID=d5b3e1f8-c672-48e8-baf8-94f05b431f5c](http://www.microsoft.com/downloads/en/details.aspx?FamilyID=d5b3e1f8-c672-48e8-baf8-94f05b431f5c)

<!-- truncate -->

Here is a (naive) F# style Mailbox / Agent using the C# async CTP :

```
    class Program
    {
        static void Main(string[] args)
        {
            var agents = new List<MyAgent>();
            //create 100 000 agents
            for (int i = 0; i < 100000; i++)
                agents.Add(new MyAgent());

            //buffer some messages
            agents.AsParallel().ForAll(a => a.Send(DateTime.Now.ToString()));

            //start agents
            agents.AsParallel().ForAll(a => a.Run());

            //send some more messages
            agents.AsParallel().ForAll(a => a.Send(DateTime.Now.ToString()));

            Console.ReadLine();
        }
    }

    public class MyAgent : Mailbox<string>
    {
        
        public override async void Run()
        {
            while (true)
            {
                var message = await Receive();                
                Console.WriteLine("Agent {0} got {1}",this.Id, message);
            }
        }
    }

    public abstract class Mailbox<T>
    {
        private static int id;

        protected Mailbox()
        {
            this.Id = id++;
        }

        public int Id { get;protected set; }

        BufferBlock<T> buffer = new BufferBlock<T>();

        
        public abstract void Run();
        
        
        public void Send(T message)
        {
            buffer.SendAsync(message);
        }

        protected async Task<T> Receive()
        {
            return await buffer.ReceiveAsync();
        }
    }
```

This way, we can spawn thousands of agents w/o allocating threads for each of them.  
The message loop is executed on the threadpool for each iteration and then suspended untill a new message arrives.
