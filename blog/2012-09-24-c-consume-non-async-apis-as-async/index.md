---
slug: c-consume-non-async-apis-as-async
title: "C# – Consume non-async API’s as async"
authors: [rogerjohansson]
tags: []
---
Now that we have the new nifty async support built into C# you might wonder how you can access your old API’s as if they were async.

<!-- truncate -->

**Now before I show any code, I have to warn that the code posted here will only wrap your existing sync methods as a Task of T.  
You will be able to consume them *as if* they were async, and in some cases this might be enough, and in other cases, such as IO scenarios, you really should rewrite the methods to use the proper async versions of the IO methods.**

The wrapper code provided here may still be a decent start for you to do this, since you can start migrating code to use async calls, while you rewrite the methods that need rewriting later.

```

    class Program
    {
        static void Main(string[] args)
        {
            Consumer();
            Console.WriteLine("----");
            Console.ReadLine();
        }


        private async static void Consumer()
        {
            //consume the sync method as if it was async
            var b = await Wrap(() => NonAsyncMethod(1, ""));
            Console.WriteLine("got result back {0}",b);
        }

        //this might be one of your old or 3rd party methods
        private static int NonAsyncMethod(int a, string b)
        {
            System.Threading.Thread.Sleep(2000); //emulate some slow code
            return 5;
        }

        private static Task<T> Wrap<T>(Func<T> selector)
        {
            return Task.Factory.StartNew(selector);
        }
    }
```
