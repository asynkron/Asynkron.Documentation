---
slug: linq-to-sql-poco-and-value-objects
title: "Linq To Sql: POCO and Value Objects"
authors: [rogerjohansson]
tags: []
---
### Fetching POCO Entities and Value Objects using Linq To SQL

<!-- truncate -->

Linq To Sql support neither POCO Entities nor Value Objects when using it as an O/R Mapper.  
What we can do is to treat it as a simple auto generated Data Access Layer instead.

By treating it as a DAL we can manually handle the data to object transformations in a type safe manner.  
If we for example want to fetch a list of POCO Customers that also have an immutable Address value object associated to them,  
we could use the following code to accomplish this:

```csharp
//Poco prefix only used to distinguish between l2s and poco entities here
IList<Customer> FindCustomers(string name)
{
   var query = from customer in context.Customers
                   where customer.Name == name
                   select new PocoCustomer
                   {
                      Id = customer.Id,
                      Name = customer.Name,
                      Address = new PocoAddres
                            (customer.AddressStreet,
                             customer.AddressZipCode,
                             customer.AddressCity)
                   };

    return query.ToList();
}
```

This approach is quite handy if you work with multiple data source and don’t want to mix and match entities with different design in the same domain.

I’m sure many will find this approach quite dirty, but I find it quite pragmatic;  
You can be up and running with a clean domain model in just a few minutes and simply hide the Linq To Sql stuff behind your DAL classes.

This works extremely well if you are into the “new” Command Query Separation style of DDD.  
You can use Linq To Sql to create typed transformations from your Query layer and expose those as services.

Personally I’ve grown a bit tired of standard O/R mapping frameworks, simply because they try to do too much.  
There is a lot of magic going on, it’s hard to keep track on what gets loaded into memory and when they will hit the database.

If I’m required to use both a memory profiler and a O/R mapper profiler in order to use the framework successfully, then something is very wrong with the whole concept.

This dumbed down DAL approach to Linq To Sql however makes the code quite explicit, you know when you hit the DB and what you get from it.  
Sure you lose features like dirty tracking that mappers generally give you, but this can be accomplished by applying a Domain Model Management framework on top of  your POCO model.  
Or maybe you just want to expose your objects as services and don’t care about those features.

**\[Edit\]  **
In reply to Patriks comment:

If you go for Command Query Separation, you would only query the query layer, so you wouldn’t need to handle updates there.  
And when it comes to writing data, you do that in the command layer , the commands carries the changes made from the GUI and thus you wouldn’t need to “figure out” what has changed.  
The commands will carry that information for you.

Tracking changes in the GUI could simply be done by storing snapshots of the view specific data when you send a query.  
Then pass a user modified projection together with the original snapshot to a command builder.  
You could then submit the commands for processing.  
**\[/Edit\]**

( hmmm, I somehow managed to turn a post about Linq To Sql into a rant about other O/R mappers, I usually do it the other way around 🙂 )
