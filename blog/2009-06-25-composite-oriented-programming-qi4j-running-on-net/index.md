---
slug: composite-oriented-programming-qi4j-running-on-net
title: 'Composite Oriented Programming: QI4J running on .NET'
authors:
- rogerjohansson
tags:
- composite-oriented-programming
- cop
---
For the last month I have been spending my spare time porting the awesome Java framework QI4J to .NET.  
QI4J is the brain child of Rickard Öberg and Niclas Hedhman and it attempts to enable Composite Oriented Programming for the Java platform.  
(For more info regarding Composite Oriented Programming see the QI4J website: [http://www.qi4j.org/](http://www.qi4j.org/) )

<!-- truncate -->

I’m well aware that others have been doing spikes on COP for .NET, a few of those attempts can be found here:  
[http://stackoverflow.com/questions/152196/composite-oriented-programming-cop-net-4-0-mef-and-the-oslo-repository](http://stackoverflow.com/questions/152196/composite-oriented-programming-cop-net-4-0-mef-and-the-oslo-repository)

However, I think it is sad to not reuse all of the effort and brain power that has been put into QI4J, and thus I decided to port it instead.

The code is currently only available from my SVN repository at google code:  
[http://code.google.com/p/alsing/source/checkout](http://code.google.com/p/alsing/source/checkout)

**Please note that the code will be released under the same license as the Java version (Apache License version 2.0)  
And copyright notices for the ported code will also be applied to give credit where credit is due.**

The .NET version is largely identical to the Java version as it is pretty much a plain class by class port.  
However there are a few exceptions:

The concept of “Property\<T\>” is not available in the .NET version since C# and most .NET languages does support properties out of the box and it would feel awkward to write things like:

**“order.Customer.Set(theCustomer)”** rather than **“order.Customer = theCustomer”**

However, the framework does rely on the Property\<T\> internally and thus most of the state holding infrastructure is also identical to the Java version.

The Java version relies on its own set of query expressions while my plan is to possibly reuse those internally but rather expose a LINQ API for querying.  
(I have not yet started to build that)

Currently supported concepts:

- [Transient Composites](http://www.qi4j.org/48.html).
- Prototyping
- [Typed and Generic Concerns.](http://www.qi4j.org/50.html)
- [Typed and Generic Side Effects.](http://www.qi4j.org/63.html)
- [Typed Mixins](http://www.qi4j.org/58.html), [Generic Mixins](http://www.qi4j.org/55.html) and [Private Mixins](http://www.qi4j.org/220.html).
- Most of the QI4J injection annotations.

Soon to come:

- [Value Composites](http://www.qi4j.org/65.html)
- [Service Composites](http://www.qi4j.org/62.html)
- Immutable properties
- [Abstract Mixins](http://www.qi4j.org/44.html) (which sadly won’t be as nice as in Java due to language differences)

And I will ofcourse post a few samples of what you can do with this ASAP, I just wanted to drop a little sneak peek 🙂

//Roger
