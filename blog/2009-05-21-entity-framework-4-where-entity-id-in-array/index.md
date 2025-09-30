---
slug: entity-framework-4-where-entity-id-in-array
title: "Entity Framework 4 – Where Entity.Id in Array"
authors: [rogerjohansson]
tags: []
---
Here is a little trick if you want to issue a query to the database and select a batch of entities by ID only:

<!-- truncate -->

```csharp
//assemble an array of ID values
int[] customerIds= new int[] { 1, 2, 3 };

var customers = from customer in context.CustomerSet
                where customerIds.Contains(customer.Id)
                select customer;
```

This will make Entity Framework issue an SQL query with the where clause **“where customerId in (1,2,3)”**, and thus, you can batch select specific entities with a single query.  
I will get back to this idea in a later post because this is related to how I design my entities and aggregates in DDD.

//Rogerr
