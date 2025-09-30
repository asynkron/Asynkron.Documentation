---
slug: fake-fibers-using-async-ctp
title: "Fake Fibers using Async CTP"
authors: [rogerjohansson]
tags: []
---
This is another PoC, building recursive code with continuations using the Async CTP.

<!-- truncate -->

The code creates a fake fiber, which can be suspended and resumed, thus allowing us to “step” through its actions.  
This technique could be useful when building an interpreting language where you might want to step through the expressions.

```
    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Runtime.CompilerServices;


namespace ConsoleApplication7
{
    class Program
    {
        static void Main(string[] args)
        {
            FakeFiber f = new MyFiber();

            f.Run();
            while (true)
            {
                //tell fiber to continue
                f.Continue();
                Console.ReadLine();
            }
        }
    }

    public class MyFiber : FakeFiber
    {

        //recursive loop that never throws stack overflow
        async void DoLoop(int count)
        {
            await Yield(); //clear callstack

            Console.WriteLine("{0} {1}", count, System.Threading.Thread.CurrentThread.ManagedThreadId); 
            
            //we can fetch values from other functions too
            //w/o blowing the call stack
            var i = await IntFunc();
            
            Console.WriteLine("got func result {0}",i);
                     
            if (count == 0)
                return;

            DoLoop(count - 1);
        }

        private async Task<int> IntFunc()
        {
            await Yield(); //clear callstack
            return 1;
        }

        public override void Run()
        {
            DoLoop(100000);
        }
    }

    public abstract class FakeFiber
    {
        public abstract void Run();
        private Task currentTask;
        public bool IsCompleted = false;
        public void Continue()
        {
            var task = currentTask;
            if (task != null)
            {
                task.Start();
                task.Wait();
            }
        }

        protected Task Yield()
        {
            currentTask = new Task(() => { this.currentTask = null; });
            return currentTask;
        }
    }
}
```
