---
slug: using-command-pattern-to-capture-language-and-intent-for-services
title: "Using Command Pattern to capture language and intent for services"
authors: [rogerjohansson]
tags: []
---
This is a follow up to my previous post [http://rogeralsing.com/2013/12/01/why-mapping-dtos-to-entities-using-automapper-and-entityframework-is-horrible/](http://rogeralsing.com/2013/12/01/why-mapping-dtos-to-entities-using-automapper-and-entityframework-is-horrible/)

<!-- truncate -->

That post was about both the technical and conceptual problems faced when using DataTransferObjects(DTOs) as the base of your service design.

In this post I will try to show you another way to model services that does not suffer from those problems on neither plane.

First, let’s talk about language.  
I want to capture language and intent when modelling services, that is, I want to see the same vocabulary that the domain experts on my team use in my code.

Let’s re-use the same scenario as we used in my previous post:

```
//entities
class Order
    int Id //auto inc id
    string DeliveryAddress
    ICollection Details

class Detail
    int Id //auto inc id
    decimal Quantity
    string ProductId
```

Maybe our domain experts have told us that we need to be able to do the following:

Place new orders.  
Edit an existing order.  
Add a product to an order.  
Change the quantity of a product in an order.  
Remove a product from an order.  
Set a delivery address for an order.  
Ship an order.  
Cancel an order.

If you are used to think in terms of CRUD, you might look at this and think:  
Well, “placing an order” is the same as “CreateOrder”.  
And “Editing an existing order” is the same as “UpdateOrder”.  
And “Cancel an order” is the same as “DeleteOrder”  
And I’ll solve the rest just by passing my DTO, let’s put a DeliveryAddress and a nullable ShippingDate property on order and just copy details from the DTO to the order.

OK, you will probably get away with it (for now), but the code will look like something in the previous post liked at the top here.  
And most importantly, you will lose semantics and intention.

e.g. Does “order.ShippingDate = DateTime.Now” mean that the order is shipped now? that it is up for shipping?  
What if we reset the order.ShippingDate to null? does that mean that the order have been returned to us?  
Is that even a valid state transition?  
Your code might be small’ish, except for the weird change tracking replication you have in your update service.

Wouldn’t it be nice if we instead could capture valid state transitions and the domain experts language at the same time?  
What if we do something like this:

```
public int PlaceNewOrder(){
    using (UoW.Begin())
    {
       var order = new Order();
       UoW.Add(order);
       UoW.Commit();
       return order.Id;
    }
}

public void AddProduct(int orderId,string productId,double quantity)
{
    using (UoW.Begin())
    {
       var order = UoW.Find(o => o.Id == orderId);
       if (order.IsCancelled)
          throw new Exception("Can not add products to cancelled orders");

       var detail = new Detail
       {
           ProductId = productId,
           Quantity = quantity,
       }
       order.Details.Add(detail);
       UoW.Commit();
    }
}

public void ShipOrder(int orderId,DateTime shippingDate)
{
  ...
}
```

This is of-course a very naive example, but still, we managed to capture the language of the domain experts, and even if this will make our code more verbose, it captures explicit state transitions in a very clean way.  
Someone new to the project can open up this code and they will be able to figure out what is going on in each individual method.  
e.g. you will most likely not misunderstand the intention of a method called “ShipOrder” which takes an argument called ShippingDate.

So far so good, but from a technical point of view, this code is horrible, we can’t expose a service interface that is this fine-grained over the wire.  
This is where command pattern comes in.

Lets redesign our code to something along the lines of:

```
public static class OrderService
{
    public static void Process(IEnumerable<command></command> commands)
    {
        var ctx = new MyContext();
        Order order = null;
        foreach (var command in commands)
            order = command.Execute(ctx, order);
        ctx.SaveChanges();
    }
}

public abstract class Command
{
    public abstract Order Execute(MyContext container,Order order);
}

public class CreateNewOrder : Command
{
    public override Order Execute(MyContext container, Order order)
    {
        order = new Order();
        container.OrderSet.Add(order);
        return order;
    }
}

public class EditExistingOrder : Command
{
    public int OrderId { get; set; }
    public override Order Execute(MyContext container, Order order)
    {
        order = container.OrderSet.Single(o => o.Id == OrderId);
        return order;
    }
}

public class SetDeliveryAddress : Command
{
    public string DeliveryAddress { get; set; }

    public override Order Execute(MyContext container, Order order)
    {
        order.Address = DeliveryAddress;
        return order;
    }
}

public class RemoveProduct : Command
{
    public string ProductId { get; set; }

    public override Order Execute(MyContext container, Order order)
    {
        order.Details.Remove(d => d.Name == ProductId);
        return order;
    }
}

public class AddProduct : Command
{
    public string ProductId { get; set; }
    public decimal Quantity { get; set; }

    public override Order Execute(MyContext container, Order order)
    {
        var detail = new Detail
        {
            Name = ProductId,
            Quantity = Quantity,
        };
        order.Details.Add(detail);
        return order;
    }
}
...etc
```

So, what happened here?  
We have created a single operation, Execute, that receives a sequence of “commands”.  
Each command is modeled as a subclass of “Command”.  
This enables us to send a sequence of commands and process them all in the same transaction.

We have captured language, intentions, and each command can easily be tested.  
And as a bonus, it doesn’t suffer from the weird mapping problems that the DTO approach suffers from.

Another nice aspect of this is that if we want to edit a few details of a large object, e.g. we want to change quantity of a single product in an order of 100 order details, we can send a single command.

So to sum it up, pros:

- Captured domain language
- Explicit state transitions
- Network effective
- Testable
- Easy to implement, no odd change tracking problems like using the DTO approach
- Extensible, we can easily add new commands to the existing pipeline w/o adding more service operations

Cons:

- Verbose
- Puts somewhat more responsibility on the client

The code in this example can of-course be improved, we are using an anemic domain model right now, but the essence of the command pattern can be seen here.

I will post a more “correct” implementation in my next post

That’s all for now
