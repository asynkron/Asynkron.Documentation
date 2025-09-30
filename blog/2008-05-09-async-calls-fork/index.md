---
slug: async-calls-fork
title: "Optimizing SOA Applications \u2013 C# Async Fork"
authors:
- rogerjohansson
tags:
- async
- threading
---
\[Edit 2012-12-04\]  
Nowdays, there is better paralell support built into .NET itself.  
You can replace my old fork code with the following:

<!-- truncate -->

    //declare the variables we want to assign
    string str = null;
    int val = 0;

    //start a new async fork
    //assign the variables inside the fork 

    Parallel.Invoke(() => str = CallSomeWebService (123,"abc"),
                    () => val = ExecSomeStoredProc ("hello"));

    //the fork has finished 

    //we can use the variables now
    Console.WriteLine("{0} {1}", str, val);

\[/edit\]

 

 

I’m currently developing a site where my domain model is filled with data from both a database and allot of service calls; normal web services and quite a bit of main frame calls.

So I’m accessing data from multiple remote sources, and each call to such source will cost me a bit of time.  
If I call them in a synchronous manner, then the time to call each source will be accumulative.  
Lets say that I make four remote calls per page request and that each call takes about 0.25 sec, then we would spend a total of 1 sec just waiting for responses.

But if I we spawn a thread per call and then call those services at the same time, we would only have to wait a total of 0.25 sec, thats four times faster than the synchronous way.  
The problem is just that .NET does not support any *small and clean* way to do this (AFAIK)

We can of course use async callbacks and such, but you will have to design your code a certain way to do this and the code will be both bloated and harder to read.

I just want to be able to design my code just as I would when I build a synchronous flow.  
So I came up with a small fluent fork API for this.

The API is based on three methods, **Begin** , **Call** and **End:**

- **Begin** will spawn a new async fork
- **Call** will add the action we want to perform onto a queue
- **End** will execute the queue of actions and then wait for all of them to finish.

When the fork is finished, we can be sure that all the calls have completed and we can safely access any variable that was assigned within the fork calls.

**Example:**

    //declare the variables we want to assign
    string str = null;
    int val = 0;

    //start a new async fork
    //assign the variables inside the fork 

    Fork.Begin()
        .Call(() => str = CallSomeWebService (123,"abc") )
        .Call(() => val = ExecSomeStoredProc ("hello") )
        .End(); 

    //the fork has finished 

    //we can use the variables now
    Console.WriteLine("{0} {1}", str, val);

We can write the code just like normal, we do not have to redirect our flow to any async callbacks or deal with IAsyncResults or stuff like that.

If you know any easier way to do this, please let me know.  
As for now, this is the way I do my async variable assignments.

**You can find the C# code for the fork class here:**  
[http://www.puzzleframework.com/Roger/fork.txt](http://www.puzzleframework.com/Roger/fork.txt)

Enjoy

//Roger
