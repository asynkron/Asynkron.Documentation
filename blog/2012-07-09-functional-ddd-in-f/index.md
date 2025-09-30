---
slug: functional-ddd-in-f
title: "Functional DDD in F#"
authors: [rogerjohansson]
tags: []
---
After watching Greg Youngs presentation on Functional DDD ([http://skillsmatter.com/podcast/design-architecture/ddd-functional-programming](http://skillsmatter.com/podcast/design-architecture/ddd-functional-programming)) I decided to give it a try using F#

<!-- truncate -->

I have to say I was sort of pleasantly surprised how well the entire concept works with a functional language.

This is only a spike on my part so don’t expect too much, but the code shows how Gregs ideas can be implemented using F#

```
//state for order line items
type LineItem =
    {
        Quantity : float;
        ProductId : int;
    }

//events that can be consumed by the order aggregate root
type OrderEvents =
    | Created of System.DateTime
    | RemovedItemId of int
    | ItemAdded of LineItem

type Order = 
    { //the order state 
        Id : int;
        CreatedDate : System.DateTime;
        Items : list<LineItem>;
    }

    //helper func to create new instances
    static member Create() = 
        { 
            Id = 1; 
            CreatedDate = System.DateTime.Now; 
            Items = []; 
        }

    //event handler, this consumes an event and uses it to construct a new version of the "this" argument
    static member Apply (this,event) = 
        match event with
        | Created(createdDate)      -> 
            {this with CreatedDate = createdDate; }
        | ItemAdded(item)           -> 
            {this with Items = item :: this.Items; }
        | RemovedItemId(productId)  -> 
            {this with Items = this.Items |> List.filter(fun i -> i.ProductId <> productId); }

    
    static member AddItem (productId,quantity) this =
        if quantity <= 0.0 then 
            failwith  "quantity must be a positive number"

        this,ItemAdded { Quantity = quantity; ProductId = productId; }
    
    static member RemoveProduct (productId) this =
        this,RemovedItemId(productId)

[<EntryPoint>]
let main argv =
    let o = Order.Create() 
            |> Order.AddItem (123,5.0) 
            |> Order.Apply
            |> Order.AddItem (555,3.0)
            |> Order.Apply
            |> Order.AddItem (22,2.2)
            |> Order.Apply 
            |> Order.RemoveProduct(123)
            |> Order.Apply

    //do stuff with the order
   
```

The idea here is that instead of using “Do” functions like Greg does, I use an “Apply” function wich consumes an event which is an F# discriminated union type.  
The actual entity state is implemented using F# records, the apply function creates new versions of such record based on previous state and the consumed event.
