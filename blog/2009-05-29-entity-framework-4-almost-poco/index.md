---
slug: entity-framework-4-almost-poco
title: "Entity Framework 4 – “Almost” POCO"
authors: [rogerjohansson]
tags: []
---
This is a short rant..

<!-- truncate -->

I have been very impressed with EF4 so far, but I’ve now found out that **EF4 will NOT support enums**.  
I find this is very strange, I can’t see how Microsoft can claim POCO support and not support one of the most common code constructs.

More info here:

[http://social.msdn.microsoft.com/Forums/en-US/adonetefx/thread/7659feab-d348-4367-b2cd-0456b20262fe](http://social.msdn.microsoft.com/Forums/en-US/adonetefx/thread/7659feab-d348-4367-b2cd-0456b20262fe)

Someone might claim that you can create a private property containing the mapped integer value and then make a public property exposing the enum.  
But this comes with two major drawbacks:

1\) You can’t create Linq queries that are executed at DB level if you use unmapped properties.  
The Linq query would have to use the integer property, and thus loosing it’s semantics.

2\) That is not POCO, that is mapper requirements leaking all over the place.
