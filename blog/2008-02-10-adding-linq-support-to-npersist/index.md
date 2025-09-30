---
slug: adding-linq-support-to-npersist
title: "Adding Linq support to NPersist"
authors: [rogerjohansson]
tags: ["c", "framework", "linq", "net", "o-r-mapping", "puzzle"]
---
I’m currently adding some real Linq support to NPersist.  
I did start on it when the first public previews of Linq was released, but then I was kind of stuck in World of Warcraft for a while (OK, slightly more than a while).  
But I’ve finally broken out of the world of Azeroth and I’m back in the real world again.

<!-- truncate -->

So, here is a few sneak peeks of what will be possible:

```
 var res = from cust in ctx.Repository<Customer>() 
          where (from order in cust.Orders 
                 where order.OrderDate == 
                 new DateTime(2008,01,01) && order.Total == 3.1 
                 select order).Count > 0 
          select cust;
```

 The Linq query will be turned into our own DSL NPath :

```
select * 
from Customer 
where ((( 
    select count(*) 
    from Orders 
         where ((OrderDate = #2008-01-01#) and (Total = 3.1)) 
        ) > 0))
```

The NPath query will then be transformed into SQL once the user tries to access the result.  
Sure, it is some slight overhead to transform a 2nd query language, but the NPath parser is extremely fast, and NPersist use NPath internally so we just wanted to avoid making two SQL generators.

The SQL generation is by far the biggest beast inside NPersist, it’s big, furry and very angry, so we just want to stay away from it if we can. 😉

We have also managed to solve the problem with Linq and Load spans that have haunted us since we first saw Linq.  
*“How the heck do we add load spans to the select when we cannot change the syntax of the select part?”  *
The solution is quite simple: *“You don’t”  *
Instead, we pass the loadspan to the query source, like this:

```
var res = from cust in ctx.Repository(new LoadSpan<Customer> 
("Name","Email","Address.StreetName"))    
```

```
          select cust; 
```

This way we do not need to invent weird hacks that don’t really fit into the Linq syntax.  
The solution might have been obvious for others, but we were really stuck on it, pretty much because we have always specified load spans in the select clause of NPath.
