---
slug: code-mangling-aop-vs-runtime-proxy-aop
title: "Code mangling AOP vs. Runtime Proxy AOP"
authors: [rogerjohansson]
tags: ["aspect-oriented-programming", "c", "naspect"]
---
<span style="font-size:10pt;font-family:Arial;"> **THIS IS AN OLD POST FROM MY OLD BLOG (2006)**</span> 

<!-- truncate -->

AOP is gaining momentum in .NET and there are starting to pop up quite a few AOP frameworks.  
A comparison of (some of) those can be found here:  
[List of existing approaches](http://janus.cs.utwente.nl:8000/twiki/bin/view/AOSDNET/CharacterizationOfExistingApproaches)

As you can see there are a few different approaches to accomplish AOP in .net  
the ones that I know are:

- <div>

  ContextBoundObject – Inherit ContextBound

  </div>

- <div>

  Source transformation – Extra compile step

  </div>

- <div>

  IL instrumentation – Extra compile step

  </div>

- <div>

  .NET profiling API – Modify the Jitted IL

  </div>

- <div>

  Runtime Subclass proxies – Reflection emit subclasses

  </div>

- <div>

  Runtime Interface proxies – Reflection emit proxies with interfaces

  </div>

These approaches can be divided into two categories:

- Inheritance based (Runtime proxies)
- Code mangling (all the others)

(Ok ContextBound might be a separate category but since its too limited Ill just ignore it 😉 )

So what is the difference between these two approaches?

Code mangling can be very powerful and can modify your code in ways that is not supported by inheritance.  
e.g. you could add interception to non virtual members, you could intercept field access and you can change base class of other classes.

Runtime proxies can only intercept ctors, virtual members or interface members.  
So runtime proxies are in most cases considered to be the less of the two.  
But here is my take on it:

If we take a look at good’ol OO, we have constructs like private, sealed/final, virtual, override etc.  
Those constructs all have a purpose, to let the author of a class specify things like:

*“It’s all OK to alter the behaviour of this method and things should work all OK if you do because its virtual”  *
  
Or:  
*  
“You may not alter this method because nasty things might happen”*  
(e.g. sealed or private etc)

No one has ever questioned those constructs in OOP.  
So why should different rules apply to AOP?

the goal is the same as in inheritance, to alter or extend behaviour / functionality of a class.

So in my opinion inheritance based AOP is the way to go because its 100% OO compatible.  
It doesn’t break the above rules.

While you might be able to do cool hacks with code mangling, you are also opening up for a whole lot of problems.  
e.g., it requires much more of a consumer of a virtual method than a consumer of a non virtual method.

Why?

Because when you consume a non virtual method you know exactly what might happen, you know what exceptions that might occur and you know what the expected behaviour is.  
When consuming a virtual method, you don’t know what might happen because you might call the method on your base class or on a subclass and the subclass could have been provided from someone else.  
so when you consume the virtual method you might have to add some extra exception handling or make your code a bit more generic because you can’t be certain that things behave exactly as when you call the base implementation.

So if AOP would allow you to break the fundamental OO rules, you could alter the behaviour of a non virtual method and introduce behaviours that is not expected by the consumer.  
and I think that is VERY bad.  
If the author of the consuming code wrote his code knowing that it was a non virtual method he called, he did not prepare his code for anything else, and the AOP’ed variant of the provider method might screw things up big time.

And since the entire framework is designed w/o AOP in mind, I bet there is plenty of code in both your applications and in the framework itself that simply expects those non virtual methods to behave as they did when the code was written.

So in short, I don’t think AOP should be allowed to break the fundamental OO rules because most of the code you use is designed for those rules.  
(However I think its a completely different story with things like AspectJ where the language itself is designed for AOP and those who use it know that every kind of method might be intercepted.)  
The next thing is debugging.

Code mangling can accomplish lots of weird stuff like changing the base class of a type or introduce fields.  
That might seem like a cool feature but since we all write our code in .NET languages that is NOT designed for AOP, e.g. C# or VB.NET  
How are we supposed to debug such code?

The code executing is not the same code you have in your source files.  
For me, that is just madness.

In runtime proxies we do not have those problems because the proxies are just dumb objects redirecting your calls to your interceptors, mixins and base methods.  
so you will never ever need to debug the proxies themselves since they just redirect the calls.  
and your base class and interceptors are still normal .NET code which you can debug just fine.  
However there is a scenario where I do agree it is nice to be able to intercept non virtuals.  
Debug aspects.  
e.g. tracing, code coverage, interaction tests and various mock aspects.  
Such aspects is a special case for me since they do pretty much the same as your IDE debugger.  
in the debugger you can step into a private method, you can view all private variables etc.  
Debug aspects does the same but in a different way.  
Well that’s it 🙂

And as stated in the beginning, this is just my take on it.  
I’m not a fanatic so I could convert if someone just provides me some valid arguments why breaking OO rules is good in AOP 🙂

//Roger
