---
slug: lambda-expressions-are-not-delegates
title: Lambda expressions are not delegates
authors:
- rogerjohansson
tags:
- delegates
- linq
---
There is allot of confusion gotesing on in the .NET community when it comes to Lambda expressions.  
Allot of blog posts out there claiming that Lambdas are simply another way to write delegates, or rather anonymous delegates.

<!-- truncate -->

Lambda expressions and delegates are two different things.

Delegates are always delegates.  
Even anonymous delegates will always be turned into “normal” delegates in compiled code.

There is a one to one mapping in the source code to the compiled representation of a delegate.

Lambda expressions however, can be compiled into two different things.  
They can be compiled into either delegates OR Linq Expression Trees.

In the cases where a lambda expression have been compiled into a delegate, then sure, they result in the same thing.

But since there is no way to know what a lambda expression will be compiled into just by looking at it.

Eg:  
`SomeMethod( x => x.Substring(10) );`

By looking at that code, one can ASSUME that it will execute the string method “Substring” once the lambda is invoked.  
But there is no way to know for sure unless you know what argument type the “SomeMethod” has.

Eg.  
`void SomeMethod (Func<string,string> func)`

In this case we can be certain that the code we pass will be executed exactly as we intended.

But in this case:

`void SomeMethod (Expression<Func<string,string>> exp)`

We still pass the exact same snippet of code, but we can no longer be certain what will happen with the snipped of code we passed.  
It MIGHT be executed the way we assume, but it might just as well be transformed into SQL code or even a Ruby snipped that is saved to disc and then executed in a Ruby engine.

So this is what I consider to be a huge difference between anonymous delegates and lambda expressions.

In the delegate case you can be 100% certain that the code will execute exactly as stated.  
And in the lambda case, it might be executed outside of the .NET run-time in some completely different context.

Well, that’s all.

//Roger
