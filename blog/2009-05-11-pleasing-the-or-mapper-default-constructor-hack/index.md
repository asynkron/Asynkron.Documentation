---
slug: pleasing-the-or-mapper-default-constructor-hack
title: "Pleasing the O/R Mapper – Default Constructor Hack"
authors: [rogerjohansson]
tags: []
---
## Hack of the day:

<!-- truncate -->

Most O/R mapper frameworks require entities to implement a default constructor.

This is most often not a big deal, most entities would support a default constructor no matter if the mapper needed it or not.  
However, if you intend to expose an entity that only support a copy constructor.

Let’s say for the sake of the argument that we have an immutable “Order” class, that can only be created by passing an “OrderRequest”:

```
public class Order
{
   public Order( OrderRequest request )
   {
         this.Customer = request.Customer;
         this.Details =
                  request
                  .Details
                  .Select ( requestDetail => 
                                new OrderDetail (requestDetail))
                  .ToList();
         ...
   }

   ....
}
```

No matter if the order is only partially or completely immutable, you want to force developers to instantiate the order by the above constructor.

But if the mapper forces you to supply a default constructor, then you can no longer guarantee that the class is used correctly.

So what can be done about it?

I’ve come up with a hack that prevents this problem, but be aware that this is a pure hack 😉  
You can provide a default constructor and mark it with the “Obsolete” attribute.

This can prevent your code from calling the constructor while allowing the mapper framework to create the entities through reflection (which most POCO mappers already do).  
You can even separate out this hack code from the actual entity using partial classes:

```
public partial class Order
{
   public Order( OrderRequest request )
   {
         this.Customer = request.Customer;
         this.Details =
                  request
                  .Details
                  .Select ( requestDetail => 
                                new OrderDetail (requestDetail))
                  .ToList();
         ...
   }

   ....
}

--other file--

public partial class Order
{
     [Obsolete("For NHibernate use only!",true)]
     public Order() {}
}
```

To keep the hack code away and a safe distance from the actual implementation you could place all those partial default ctor snippets in a separate file or so.

e.g. “NHibernateHack.cs” or something similair.

Also note that for NHibernate, there are other options see: [http://nhforge.org/blogs/nhibernate/archive/2008/12/12/entities-behavior-injection.aspx](http://nhforge.org/blogs/nhibernate/archive/2008/12/12/entities-behavior-injection.aspx)

But this trick is applies to any mapper that creates instances through reflection and requires a default ctor.  
Or maybe this is an old trick, but it does fill it’s purpose.

//Roger
