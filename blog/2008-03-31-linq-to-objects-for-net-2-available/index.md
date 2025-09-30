---
slug: linq-to-objects-for-net-2-available
title: Linq to objects for .NET 2 available
authors:
- rogerjohansson
tags:
- lambda
- linq
---
Patrik Löwendahl blogged about using C#3 features in .NET 2 via VS.NET 2008 a few days ago:  
[http://www.lowendahl.net/showShout.aspx?id=191](http://www.lowendahl.net/showShout.aspx?id=191)

<!-- truncate -->

There are quite a few of the new features that works straight out of the box.  
However, Linq does not, alot of the code that Linq uses is simply not present in the .NET 2 BCL.

So, inspired by Patriks post I opened up an [old custom Linq engine that I wrote a while back](http://rogeralsing.com/2008/01/10/making-a-custom-linq-engine/) and spiced it up and adapted it for .NET 2.  
I also added a few of the standard list extensions such as “Take” “Skip” etc.

**The code can be found here:  **
[**www.puzzleframework.com/Roger/LinqForNet2.zip**](http://www.puzzleframework.com/Roger/LinqForNet2.zip)

And before you get all excited, this is only Linq to objects, NOT Linq to SQL….

The code supports the following Linq constructs, features and list extensions:

- <div>

  from (ok ok, I didn’t have to code anything for that)

  </div>

- <div>

  where

  </div>

- <div>

  join

  </div>

- <div>

  groupby

  </div>

- <div>

  orderby

  </div>

- <div>

  select

  </div>

- <div>

  Take

  </div>

- <div>

  Skip

  </div>

- <div>

  TakeWhile

  </div>

- <div>

  SkipWhile

  </div>

- <div>

  Distinct

  </div>

- <div>

  Deferred execution

  </div>

Enjoy : – )

 //Roger
