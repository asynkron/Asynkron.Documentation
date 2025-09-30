---
slug: aop-vs-oop-ignorance
title: "AOP vs. OOP Ignorance"
authors: [rogerjohansson]
tags: []
---
Yesterday Fredrik Normén wrote a post [about crosscutting concerns.](http://weblogs.asp.net/fredriknormen/archive/2008/12/04/isn-t-it-boring-to-write-crosscutting-concerns.aspx)  
Torkel Ödegaard also wrote [a followup on it.](http://www.codinginstinct.com/2008/12/crosscutting-concerns-aop.html)

<!-- truncate -->

And I did blog about this a [few years ago.](http://rogeralsing.com/2008/01/08/code-mangling-aop-vs-runtime-proxy-aop/)

Since the topic was brought up, I’ll give it another shot.

Most developers are still having some real issues to grasp the connection between AOP and OOP.

Lets take this from the perspective of C#;

When you decided to use C#, you most likely did so because you thought the language had some qualities connected to it.  
One reason is probably because it is object oriented.  
C# comes with quite decent OOP support, eg. it supports modifiers that let you communicate to the consumer of your classes if you consider it is safe to alter the behaviour of your classes or not.

The main reason why it is bad to allow every method to be altered is that it is harder harder to guarantee that both your code and your consumers code will still work as intended.  
eg. if you are consuming a non virtual method and you know that it will only throw FooExceptions, then you can be certain that you only need to catch FooExceptions.

In the case of virtual methods, you can not be certain of anything and you need to code more defensivly when you consume it.

Most C# developers would agree that inheritance modifiers are a good concept and that this will prevent consumers from using your API incorrectly.

But when it comes to AOP, then most developers throw away all their knowledge of fundamental OOP and get all excited by the power of AOP black magic.

For example, the by far most common argument against proxy based AOP is; *“proxy based AOP only works on virtual methods or interfaces”*

What developers need to understand is that OOP inheritance and AOP incerception both targets the same problem area;  
**They are both means to extend and alter the behaviour of your code.**

With OOP inheritance you can override the behaviour of a method **and either add new behaviours or completely replace the original behaviour.**

With AOP interception you can intercept a method **and either add new behaviours or completely replace the original behaviour.**

See the similarities?

They both do the same thing, but in different ways.

Now if they both do the same thing, and all of our code is designed to conform and play by the OOP rules.  
Then the AOP way MUST conform to the same OOP rules or you will get some serious problems.

If AOP were to have it’s own set of rules, then this would completely nullify the rules of OOP;  
The “virtual” and “sealed” keywords would not mean anything anymore because you could easily ignore them using AOP.  
By ignoring the OOP rules we can no longer use the same way to reason about code as we do today.

You need to choose, either we play by the OOP rules all the time, or we completely ignore them and play by the “alter everything” AOP rules.

And I’m not saying that the latter is a bad choice.

Languages like Ruby are excellent for this, it does not have inheritance modifiers and it also allows you to alter the behaviour of everything.

The key problem here is; C# is NOT designed this way, it is designed to conform to the OOP rules, the entire code-base of .NET is designed to conform to the OOP rules.  
Therefore, the “alter everything” approach does not play well with .NET.

You can of-course argue that; *“I’ve used Post# successfully w/o breaking anything”.*  
But it is not really me that you should take that argument with, if you think that the “alter everything” is the way to go, you should say that to Anders Hejlsberg and tell him that he was wrong to include sealed and virtual in C# and that those rules have no purpose.

If you want to be able to extend your code, then you need to make it extensible.  
Just because you use an AOP framework that can alter everything doesn’t mean that it is safe to do so.  
You have to take the same precautions when extending with AOP as when extending with OOP.

We have come to learn this when we deal with TDD, it requires a certain design in order for your code to be testable.  
The same applies to AOP via proxies, you have to design a certain way to make it work.  
And luckily, the same design that makes it possible to do TDD also makes it possible to apply proxy based AOP.

The number one argument from the AOP critics is;  
*“You can not see what is actually going on by looking at the code”*

If you play by the OOP rules, the above argument is no more true for AOP than it is for inheritance in OOP.  
But if you play by the “alter everything” approach, then that argument is completely true and the critics are right.  
I could no longer make an assumption that non virtual method code infront of me does just what it says, it could do something completely different.

 

 

Enjoy.

PS.  
Proxy based AOP is the shit 😉

//Roger
