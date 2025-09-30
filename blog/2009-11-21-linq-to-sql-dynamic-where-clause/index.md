---
slug: linq-to-sql-dynamic-where-clause
title: "Linq To Sql: Dynamic Where Clause"
authors: [rogerjohansson]
tags: []
---
### Dynamic where clause using Linq To SQL:

<!-- truncate -->

Let’s say we need to implement a search method with the following signature:

    IEnumerable FindCustomers(string name,string contactName,string city)

If the requirement is that you should be able to pass zero to three arguments to this method and only apply a “where” criteria for the arguments that are not null.  
Then we can use the following code to make it work: 

```
IList<Customer> FindCustomers(string name,string contactName,string city)
{
     var query = context.Cutomers;

     if (name != null)
        query = query.Where ( customer => customer.Name == name );

     if (contactName != null)
        query = query.Where ( customer => customer.ContactName == contactName );

     if (city!= null)
        query = query.Where ( customer => customer.City == city );

     return query.ToList();
}
```

This way we can pass different combinations of arguments to the method and it will still build the correct where clause that executes at database level.

Do note that this only works when the different criteria should be “AND”‘ed together, but it’s still pretty useful for use cases like the one above.
