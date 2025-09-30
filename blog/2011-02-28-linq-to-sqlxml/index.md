---
slug: linq-to-sqlxml
title: "Linq to SqlXML"
authors: [rogerjohansson]
tags: ["documentdb", "sql-server", "xml", "xpath", "xquery"]
---
I’m hacking along on my Document DB emulator ontop of Sql Server XML columns.

<!-- truncate -->

I have some decent Linq support in place now.  
The following query:

```csharp
var query = from order in orders
            //must have status shipped
            where order.Status >= OrderStatus.Shipped      
            //must contain foo or bar products
            where order.OrderDetails.Any(d => d.ProductNo == "Foo" || d.ProductNo == "Bar")
            //must have an order total > 100
            where order.OrderDetails.Sum(d => d.ItemPrice * d.Quantity) > 100 
            select order;
```

will yield the following Sql + XQuery to the Sql Server:

```sql
select *
from documents
where CollectionName = 'Order'  and 
--must have an order total > 100
(documentdata.exist('/object/state[(
     fn:sum( 
          for $A in OrderDetails[1]/object/state 
                return ($A/ItemPrice[1] * $A/Quantity[1])) > xs:decimal(100))]') = 1) and 
--must contain foo or bar products
(documentdata.exist('/object/state[OrderDetails[1]/object/state[((ProductNo[1] = "Foo") or 
 (ProductNo[1] = "Bar"))]]') = 1) and 
--must have status shipped
(documentdata.exist('/object/state[(Status[1] >= xs:int(2))]') = 1)
```
