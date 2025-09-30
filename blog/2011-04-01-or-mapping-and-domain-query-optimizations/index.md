---
slug: or-mapping-and-domain-query-optimizations
title: "O/R Mapping and domain query optimizations"
authors: [rogerjohansson]
tags: ["ddd", "ef4"]
---
One of the cons of O/R mapping is that the abstraction is a bit too high.  
You write object-oriented code and often forget about eventual performance problems.

<!-- truncate -->

Take this (somewhat naive) example:

```csharp
class Customer
{
   ...
  public double GetOrderTotal()
   {
       var total = ( from order in this.Orders
                        from detail in order.Details
                        select detail.Quantity * detail.ItemPrice)
                       .Sum();

       return total;
   }
}
```

For a given customer, we iterate over all the orders and all the details in those orders and calculate the sum of quantity multiplied with itemprice.  
So far so good.

This will work fine as long as you have all the data in memory and the dataset is not too large, so chances are that you will not notice any problems with this code in your unit tests.

But what happens if the data resides in the database and we have 1000 orders with 1000 details each?  
Now we are in deep s##t, for this code to work, we need to materialize at least 1 (cust) + 1000 (orders) \* 1000 (details) entities.  
The DB needs to find those 1 000 001 rows , the network needs to push them from the DB server to the App server and the App server needs to materialize all of it.  
Even worse, what if you have lazy load enabled and aren’t loading this data using eager load?  
Then you will hit the DB 1 000 001 times… GL with that! 🙂

So clearly, we can not do this in memory, neither with lazy load nor eager load.

But what are the alternatives?  
Make an ad hoc sql query?  
In that case, what happens to your unit tests?

Maybe we want to keep this code, but we want to execute it in the database instead.

This is possible if we stop beeing anal about “pure POCO” or “no infrastructure in your entities”

Using an unit of work container such as [https://github.com/rogeralsing/Precio.Infrastructure](https://github.com/rogeralsing/Precio.Infrastructure)

We can then rewrite the above code slightly:

```csharp
class Customer
{
   ...
  public double GetOrderTotal()
   {
  var total = ( from customer in UoW.Query<Customer>() //query the current UoW
                        where customer.Id == this.Id //find the persistent record of "this"
                        from order in customer.Orders
                        from detail in order.Details
                        select detail.Quantity * detail.ItemPrice)
                       .Sum();

       return total;
   }
}
```

This code will run the query inside the DB if the current UoW is a persistent UoW.  
If we use the same code in our unit tests and use an in mem UoW instance, this code will still work, if our customer is present in the in mem UoW that is..

So the above modification will reduce the number materialized entities from 1 000 001 to 1 (we materialize a double in this case)

I don’t know about you , but I’d rather clutter my domain logic slightly and get a million times better performance than stay true to POCO and suffer from a broken app.
