---
slug: linq-to-npersist-to-ms-access
title: "Linq to NPersist to MS Access"
authors: [rogerjohansson]
tags: ["linq", "ms-access", "npersist", "sub-queries"]
---
I’ve finally seen my own Linq support Live 😛  
Untill now I’ve only been emitting NPath quereis and verified that NPath is correct.

<!-- truncate -->

The reason I havent tested it live untill now is that I only have my gaming machine to develop on atm. the dev machine is dead.

Anyway, I’m trying it against NWind MS Access DB right now and it works like a charm.  
I can even run fairly complex queries, even if it takes a bit of time on MS Access.

```
var res = from cust in ctx.Repository<Customer>() 
          where 
          cust.Orders.Any( 
                 order => order.OrderDetails.Sum( 
                     detail => detail.UnitPrice * detail.Quantity 
                                                ) > 1000) 
          orderby cust.CompanyName 
          select cust;
```

This lists all customers that have atleast one order with the order total of 1000\$.  
I was a bit nervous before and thought that maybe it will fail.. even though the NPath looks correct and the NPath to SQL generator have been working fine for the last 3 years 😉
