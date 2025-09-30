---
slug: akka-net-concurrency-control
title: "Akka.NET \u2013 Concurrency control"
authors:
- rogerjohansson
tags:
- actor-model
- concurrency
---
Time to break the silence!

<!-- truncate -->

A lot of things have happened since I last wrote.  
I’ve got a new job at [nethouse.se](http://nethouse.se "nethouse.se") as developer and mentor.

Akka.NET have been doing some crazy progress the last few months.  
When I last wrote, we were only two developers, now, we are about 10 core developers.  
The project also have a new fresh site here: [akkadotnet.github.com](http://akkadotnet.github.com "Akka.NET").  
We are at version 0.7 right now, but pushing hard for a 1.0 release as soon as possible.

But not, let’s get back on topic.

In this mini tutorial, I will show how to deal with concurrency using Akka.NET.

Let’s say we need to model a bank account.  
That is a classic concurrency problem.  
If we would use OOP, we might start with something like this:

```csharp
public class BankAccount
{
    private decimal _balance;
    public void Withdraw(decimal amount)
    {
        if (_balance < amount)
            throw new ArgumentException(
              "amount may not be larger than account balance");

        _balance -= amount;

        //... more code
    }
    //... more code
}
```

That seems fair, right?  
This will work fine in a single threaded environment where only one thread is accessing the above code.  
But what happens when two or more competing threads are calling the same code?

```csharp
    public void Withdraw(decimal amount)
    {
        if (_balance < amount) //<-
```

That if-statement might be running in parallel on two or more theads, and at that very point in time, the balance is still unchanged. so all threads gets past the guard that is supposed to prevent a negative balance.

So in order to deal with this we need to introduce locks.  
Maybe something like this:

```csharp
    private readonly object _lock = new object();
    private decimal _balance;
    public void Withdraw(decimal amount)
    {
        lock(_lock) //<-
        {
           if (_balance < amount)
              throw new ArgumentException(
               "amount may not be larger than account balance");

           _balance -= amount;

        }
    }
```

This prevents multiple threads from accessing and modifying the state inside the Withdraw method at the same time.  
So all is fine and dandy, right?

Not so much.. locks are bad for scaling, threads will end up waiting for resources to be freed up.  
And in bad cases, your software might spend more time waiting for resources than it does actually running business code.  
It will also make your code harder to read and reason about, do you really want threading primitives in your business code?

Here is where the Actor Model and Akka.NET comes into the picture.  
The Actor Model makes actors behave “as if” they are single threaded.  
Actors have a concurrency constraint that prevents it from processing more than one message at any given time.  
This still applies if there are multiple producers passing messages to the actor.

So let’s model the same problem using an Akka.NET actor:

```csharp

//immutable message for withdraw:
public class Withdraw
{
     public readonly decimal Amount;
     public Withdraw(decimal amount)
     {
         Amount = amount;
     }
}

//the account actor
public class BankAccount : TypedActor, IHandle<Withdraw>
{
     private decimal _balance;

     public void Handle(Withdraw withdraw)
     {
         if (_balance < amount)
         {
              Sender.Tell("fail"));
              //you should use real message types here
              return;
         }

          _balance -= withdraw.Amount;
          Sender.Tell("success);
          //and here too
     }
}
```

So what do we have here?  
We have a message class that represents the Withdraw message, the actor model relies on async message passing.  
The BankAccount actor, is then told to handle any message of the type Withdraw by subtracting the amount from the balance.

If the amount is too large, the actor will reply to it’s sender telling it that the operation failed due to a too large amount trying to be withdrawn.

In the example code, I use strings as the response on the status of the operation, you probably want to use some real message types for this purpose. but to keep the example small, strings will do fine.

How do we use this code then?

```csharp

ActorSystem system = ActorSystem.Create("mysystem");
...
var account = system.ActorOf<BankAccount>();

var result = await account.Ask(new Withdraw(100));
//result is now "success" or "fail"
```

Thats about it, we now have a completely lock free implementation of an bank account.

Feel free to ask any question 🙂
