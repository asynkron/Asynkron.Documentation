---
slug: entity-framework-4-entity-dependency-injection
title: "Entity Framework 4 – Entity Dependency Injection"
authors: [rogerjohansson]
tags: []
---
When dealing with a fat domain model, there is often a need to be able to inject different services into your entities.  
e.g. you might want to inject some domain service like “ITaxCalcualtorService” or an infrastructure service like “IEmailNotificationService” into your entities.

<!-- truncate -->

If we rely completely on eager loading, then this is not a big problem, we can simply let or repositories iterate over each entity once we have fetched them from the DB and inject our services.  
But when it comes to Lazy Load, we can no longer do this, in this case we need to get notified by the O/R mapper when an entity have been materialized so that we can inject our services into it.

If you are aiming to use Entity Framework 4 once it is released, you can accomplish this with the following code snippet:

```csharp

..inside your own EF container class..

public MyContext()
    : base("name=MyContext", "MyModelContainer")
{
    ...
    ObjectStateManager.ObjectStateManagerChanged +=
    ObjectStateManagerChanged;
}

// this handler gets called each time the
// containers statemanager is changed
void ObjectStateManagerChanged(object sender,
                          CollectionChangeEventArgs e)
{
    // we are only interested in entities that
    // have been added to the state manager
    if (e.Action != CollectionChangeAction.Add)
        return;

    var state = ObjectStateManager
                    .GetObjectStateEntry(e.Element).State;

    // we are only interested in entities that
    // are unchanged (that is; loaded from DB)
if (state != System.Data.EntityState.Unchanged)
        return;

    OnEntityMaterialized(e.Element);
}

// this method gets called each time
// an entity have been materialized
private void OnEntityMaterialized(object entity)
{
    if (entity is Order)
    {
        Order order = entity as Order;
        // use property injection to assign 
        // a taxcalculator service to the order
        order.TaxCalculatorService =
SomeDIContainer.GetObject<ITaxCalculatorService>();
    }
}
```

The above is a very naïve example, but it does show how you can catch the materialization of a specific entity type and then configure that entity.

This allows us to add complex domain logic to our entities.  
We can for example call a method like: “order.CalculateTotals()” where the CalculateTotals method now uses the ITaxCalculatorService.

HTH.

//Roger
