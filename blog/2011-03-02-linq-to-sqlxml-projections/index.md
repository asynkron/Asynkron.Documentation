---
slug: linq-to-sqlxml-projections
title: "Linq to SqlXml: Projections"
authors: [rogerjohansson]
tags: []
---
I’ve managed to add projection support to my Linq to Sql Server Xml column implementation.

<!-- truncate -->

Executing this Linq query:

```csharp
var query = (from order in ctx.GetCollection().AsQueryable()
                where order.OrderTotal > 100000000
                where order.ShippingDate == null
                where order.OrderDetails.Sum(d => d.Quantity * d.ItemPrice) > 10
                select new
                {
                    OrderTotal = order.OrderDetails.Sum(d => d.ItemPrice * d.Quantity),
                    CustomerId = order.CustomerId ,
                    Details = order.OrderDetails
                })
                .Take(5);
```

Will yeild this Sql + XQuery:

```sql
select top 5 Id,DocumentData.query(
'<object type="dynamic">
 <state>
  <OrderTotal type="decimal">
   {fn:sum( 
              for $A in /object[1]/state[1]/OrderDetails[1]/object/state[1] 
                      return ($A/ItemPrice[1] * $A/Quantity[1]))}  </OrderTotal>
  <CustomerId type="guid">
   {xs:string(/object[1]/state[1]/CustomerId[1])}
  </CustomerId>
  <Details type="collection">
   {/object[1]/state[1]/OrderDetails[1]/object}
  </Details>
 </state>
</object>') as DocumentData

from documents
where
CollectionName = 'Order'  and
(documentdata.exist('

/object/state[(fn:sum( 
        for $A in /object[1]/state[1]/OrderDetails[1]/object/state 
             return ($A/Quantity[1] * $A/ItemPrice[1])) > xs:decimal(10)) and

/object[1]/state[1]/ShippingDate[1][@type="null"] and
(/object[1]/state[1]/OrderTotal[1] > xs:decimal(100000000))]

')) = 1
```
