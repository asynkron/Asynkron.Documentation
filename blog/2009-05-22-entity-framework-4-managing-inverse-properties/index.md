---
slug: entity-framework-4-managing-inverse-properties
title: "Entity Framework 4 – Managing inverse properties"
authors: [rogerjohansson]
tags: []
---
**\[EDIT\]  
I was wrong!**

<!-- truncate -->

**It is perfectly possible to do one directional associations in EF4 and POCO mode.  
You simply have to manually remove the “ *\<NavigationProperty* ..” tags from your mapping files.**

**Awesome work EF4 design team 🙂**

**\[/EDIT\]**

**Original post:**  
To my surprise I’ve found out that Entity Framework 4 don’t support one directional collection properties.  
That is, if you have the entity “Order” which has an “Details” property, then the “OrderDetail” entity \_*must*\_ have an “Order” property.

To make things worse, those properties do not have any auto sync mechanism if you are using POCO entities.  
They could very well have supported this by adding an inverse management aspect to their run-time proxies that they use for lazy loading in POCO.

While I do think this is a lacking feature, it is not really a show stopper for me.  
We can work around this problem by applying the “Law of Demeter” principle.

We can design our entities like this:

**OrderDetail:**

```csharp
public class OrderDetail
{
    ...properties...

    [Obsolete("For EF4 Only!",true)]
    public OrderDetail()
    { }

    public OrderDetail(Order order)
    {
        this.Order = order;
    }
}
```

**Order:**

```csharp
public class Order
{
    ...properties...

    public void AddProduct(Product product,
                                   double quantity,
                                   double itemPrice)
    {
        var detail = new OrderDetail(this)
        {

//offtopic: you might want to associate
//the product via ID or via a snapshot instead
//depending on how you deal with cross aggregate references
            Product = product,

            Quantity = quantity,
            ItemPrice = itemPrice,
        };

        Details.Add(detail);
    }
}
```

This way, we get a whole bunch of positive effects:

We solve the problem with inverse properties, inverse management is handled inside the “AddProduct” method in the order.

We get a nice way to handle consistency in our aggregate roots, the methods can easily update any accumulated values in the order or change status of the order when we add or remove order details.  
This is what aggregates in DDD is all about so you should probably do this anyway, regardless if EF4 did support inverse property management or not.

We add domain semantics to the model, “AddProduct” or “ChangeQuantity” have meaning in our model, thus we get a more self explaining model.

This is a quite nice example of how lacking framework features can force you to write better code.  
If we did have support for inverse property management, we might get sloppy and just go the path of least resistance.

//Roger
