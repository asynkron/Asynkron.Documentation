---
slug: ddd-nworkspace-experiment
title: "DDD – NWorkspace Linq experiment"
authors: [rogerjohansson]
tags: []
---
In Jimmy Nilsson’s book  “Applying Domain Driven Design and Patterns” he writes about a project of his called “NWorkspace”, which is a kind of abstraction layer for O/R mappers.

<!-- truncate -->

The concept is to let your Repositories only talk to the workspace abstraction, making it possible to swap underlying mapper.

The biggest problem with such abstraction is querying, there have never existed a standard way to make queries for domain models in .NET.  
So you end up abstracting the querying mechanism too, and that in turn forces you to create translators from your own query model to the underlying mappers query model.

Now days we have Linq.  
Linq allows us to create queries in a standardized way against domain models.

So, yesterday I decided to try to make a Linq based abstraction layer in the spirit of NWorkspace.  
*(Note: My project is simply a ripoff from Jimmy’s concept, there is no relation to the real NWorkspace)*

First I had to pick some different persistance tools, so I decided to go with NHibernate, LinqToSql and DB4O (object DB for .NET)

Once I had selected the persistence tools I started writing my abstraction layer.  
It turned out to be really easy to implement, one interface with five methods:  
LinqQuery\[of T\] //creates a Linq query  
Add(T) //attaches a transient entity to the workspace  
Delete(T) //removes a persistent entity from the workspace  
Commit() //commits all changes to the persistent store  
Rollback() //discards all changes

I then created an implementation for each of the persistence tools for my interface.

So now I can pass instances of my workspace into my repositories and make them operate almost agnostic of what persistence tool I use.

I say “almost” because there are a bit too many differences between the tools when it comes to query support and entity design.

LinqToSql is far from being POCO / PI, and even if NH and DB4O are both POCO’ish, there are still differences.

There are also differences in the Linq support, so you can not always run the same type of queries against the different workspace implementations.

But all in all, it turned out really nice, making the Repository design much cleaner.  
As long as you adapt your domain model for whatever persistence tool you use and don’t use too complex queries, the most of your repositories and business logic can remain unchanged.

Pretty slick IMO.

//Roger
