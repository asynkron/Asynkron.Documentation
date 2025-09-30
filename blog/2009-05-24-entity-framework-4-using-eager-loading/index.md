---
slug: entity-framework-4-using-eager-loading
title: "Entity Framework 4 – Using Eager Loading"
authors: [rogerjohansson]
tags: []
---
When Linq To Sql was released we were told that it did support eager loading.  
Which was a bit misleading, it did allow us to fetch the data we wanted upfront, but it did so by issuing one database query per object in the result set.  
That is, one query per collection per object, which is a complete performance nightmare. (Ripple loading)

<!-- truncate -->

Now in Entity Framework 4, we can actually do *true* eager loading.  
EF4 will issue a single query that fetches the data for all the objects in a graph.  
This have been possible in other mappers for a long time, but I still think it is awesome that Microsoft have finally listened to the community and created a framework that from what I’ve seen so far, does exactly what we want.

So how do you use eager loading in EF4 ?

Eager loading is activated by calling **“ObjectSet\[of T\].Include(“Details.Product”)”**, that is, a dot separated property path.  
You can also call include multiple times if you want to load different paths in the same query.

There are also a few attempts out in the blog world to try to make it easier to deal with eager loading, e.g. by trying to remove the untyped string and use lambda expressions instead.

I personally don’t like the lambda approach since you can’t traverse a collection property that way; “Orders.Details.Product” , there is no way to write that as a short and simple lambda.

My own take on this is to use extension methods instead.  
I always use eager loading on my aggregates, so I want a simple way to tell my EF context to add the load spans for my aggregates when I issue a query.  
(Aggregates are about consistency, and Lazy Load causes consistency issues within the aggregate, so I try to avoid that)

Here is how I create my exstension methods for loading complete aggregates:

```csharp
public static class ContextExtensions
{
  public static ObjectQuery<Order> 
           AsOrderAggregate(this ObjectSet<Order> self)
  {
    return self
        .Include("Details.ProductSnapshot")
        .Include("CustomerSnapshot");
  }
}
```

This makes it possible to use the load spans directly on my context without adding anything special to the context itself.  
(You can of course add this very same method inside your context if you want, I simply like small interfaces that I can extend from the outside)

This way, you can now issue a query using load spans like this:

```csharp
var orders = from order in context.OrderSet.AsOrderAggregate()
             select order;
```

And if you want to make a projection query you can simply drop the “AsOrderAggregate” and fetch what you want.

HTH.

//Roger
