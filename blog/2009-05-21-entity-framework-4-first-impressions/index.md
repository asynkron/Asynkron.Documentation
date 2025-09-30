---
slug: entity-framework-4-first-impressions
title: "Entity Framework 4 – First Impressions"
authors: [rogerjohansson]
tags: []
---
I downloaded the VS 2010 beta1 today and started to dissect Entity Framework 4.

<!-- truncate -->

(Also note the name: EF4.. The new name comes from .NET \_4\_ )

Here are my initial impressions:

### POCO Support.

POCO comes in two flavors: Run-time POCO and Compile-time POCO:

Run-time POCO is where the framework interact with your POCO types directly.  
This approach lacks support for lazy load due to the fact that there is no lazy loading code in your POCO classes.

Compile-time POCO is where the framework create run-time proxies on-top of your POCO entities and applies the lazy load support inside the proxies.  
Thus, the entities used in run-time are far from POCO.

The POCO support also include ValueObjects, so you can map POCO value objects too.

I’m very pleased to see that these features are finally coming.  
(We did have this in NPersist in 2005, but it’s still nice 😉 )  
 

### Lacking support for extensibility.

This was both expected and sad to see at the same time.  
The entire materialization mechanism of EF4 is black boxed, there are no extension points at all.

I was hoping for some materialization event where one could override the default object creation process.  
And thus apply more behaviors to the objects, e.g. via NAspect and proxify the entities even more.

(This feature is missing from Linq to Sql and MEF too, so I wasn’t too surprised)

 

### Design by Contract .

This is not really a feature of EF4 but rather of .NET framework 4.  
But as far as I can tell, contracts <span>seems</span> to work fine within your entities.  
I still need to do a few more tests and see how well the contracts play with the run-time proxies though.  
More to come in later posts…
