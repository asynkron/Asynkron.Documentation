---
slug: why-mapping-dtos-to-entities-using-automapper-and-entityframework-is-horrible
title: "Why mapping DTOs to Entities using AutoMapper and EntityFramework is horrible"
authors: [rogerjohansson]
tags: ["automapper", "cqrs", "datatransferobject", "ddd", "dto", "entities", "entityframework", "linq", "mapping"]
---
One of the most common architectures for web apps right now is based on passing DataTransferObjects(DTOs) to and from CRUD services that updates your business/domain entities using tools like AutoMapper and EntityFramework.

<!-- truncate -->

I will try to explain why this is a truly horrible approach.

# Horrible from a technical perspective

Firstly, lets set up a scenario that we can reason about here:  
The scenario here is an Order service with an Order entity and an OrderDTO.

Example code (pseudo code):

```csharp
 //entities
 class Order
     int Id //auto inc id
     List<Detail> Details

 class Detail
     int Id //auto inc id
     decimal Quantity
     string ProductId

 //DTO's
 class OrderDTO
     int Id
     List<DetailDTO> DetailsDTO

 class DetailDTO
     int Id
     decimal Quantity
     string ProductId
```

I’m pretty sure you have seen something similar to this before.

Lets also assume there is some sort of service that updates orders:

```csharp
    public void CreateOrUpdateOrder(OrderDTO orderDTO)
    {
       ...
    }
```

So what do we need to do in order to make this work?  
Maybe you do something like this:

```csharp
    public void CreateOrUpdateOrder(OrderDTO orderDTO)
    {
        //this code would probably reside somewhere else, 
        //in some app startup or config
        Mapper.CreateMap<OrderDTO,Order>();
        Mapper.CreateMap<DetailDTO,Detail>();

        //real code starts here
        var context = ... //get some DbContext
        var order = Mapper.Map<OrderDTO,Order>(orderDTO);
        context.OrderSet.Add(order); 
        context.SaveChanges();
    }      
```

Looks fair enough?

This will work fine for a new order, the above code will map from DTOs to new entities and then add the new entities to the dbcontext and save the changes.  
All is fine and dandy.

But what happens if we pass an existing order?  
We will get into trouble because of the context.OrderSet.Add, existing orders will become new orders in the DB because we are always “adding”.  
So what can we do about this?

Maybe we can do it like this?

```csharp
public void CreateOrUpdateOrder(OrderDTO orderDTO)
{
   //this code would probably reside somewhere else, 
   //in some app startup or config
   Mapper.CreateMap<OrderDTO,Order>();
   Mapper.CreateMap<DetailDTO,Detail>();

   //real code starts here
   var context = ... //get some DbContext

   //try to fetch an existing order with the same Id as the DTO
   var order = context.OrderSet.FirstOrDefault(o => o.Id == orderDTO.Id);
   if (order == null)
   {
       //if no order was found, create a new and add it to the context
       order = new Order();
       context.OrderSet.Add(order);
   }
        
   //Map the DTO to our _existing_ or new order
   Mapper.Map<OrderDTO,Order>(orderDTO,order); 
   context.OrderSet.Add(order); 
   context.SaveChanges();
}      
```

Ah, that’s better, right?  
Now we will not add new orders every time we try to update an existing one.  
So, whats the problem now?

We still create new entities every time for each detail, AutoMapper knows nothing about EF and ID’s so it will simply recreate every object in the .Details collection.  
So even if we can create and update the order entity, we are still messed up when dealing with the details.

Lets try again:

```csharp
public void CreateOrUpdateOrder(OrderDTO orderDTO)
{
   var context = ... //get some DbContext
   
   //let automapper be able to find or create the entity based on Id
   Mapper.CreateMap<OrderDTO,Order>()
   .ConstructUsing((OrderDTO orderDTO) =>
   {
       if (orderDTO.Id == 0)
       {
           var order = new Order();
           context.OrderSet.Add(order);
           return order;
       }
       return context
              .OrderSet.Include("Details")
              .First(o => o.Id == orderDTO.Id);
   });

  //let automapper be able to find or create the entity based on Id
  Mapper.CreateMap<DetailDTO, Detail>()
  .ConstructUsing((DetailDTO detailDTO) =>
  {
      if (detailDTO.Id == 0)
      {
          var detail = new Detail();
          context.DetailSet.Add(detail);
          return detail;
      }
      return context
            .DetailSet.First(d => d.Id == detailDTO.Id);
   });    
 
   //AutoMapper will now know when to create a 
   //new entity and when to fetch one from the DbContext       
   Mapper.Map<OrderDTO,Order>(orderDTO); 

   context.SaveChanges();
}      
```

OK, now we are on the right track, we can update existing entities and create new entities when needed.  
All of the magic is in the AutoMapper config.  
Nice, right?  
This will work fine for every Create or Update scenario.

Well, err.. it won’t handle deleted details. if a detain have been removed from the orderDTO detail collection, then we will have detail entities that are unbound in entity framework.  
We have to delete those otherwise we will have a foreign key exception when calling SaveChanges.

OK, so lets see what we can do about this:

```csharp
public void CreateOrUpdateOrder(OrderDTO orderDTO)
{
   var context = ... //get some DbContext
     
   Mapper.CreateMap<OrderDTO,Order>()
   .ConstructUsing((OrderDTO orderDTO) =>
   {
       if (orderDTO.Id == 0)
       {
           var order = new Order();
           context.OrderSet.Add(order);
           return order;
       }
       return context
              .OrderSet.Include("Details")
              .First(o => o.Id == orderDTO.Id);
       })
       //find out what details no longer exist in the 
       //DTO and delete the corresponding entities 
       //from the dbcontext
       .BeforeMap((dto, o) =>
       {
          o
           .Details
           .Where(d => !dto.Details.Any(ddto => ddto.Id == d.Id))
           .ToList()
           .ForEach(deleted => context.DetailSet.Remove(deleted));
       });

       Mapper.CreateMap<DetailDTO, Detail>()
      .ConstructUsing((DetailDTO detailDTO) =>
      {
         if (detailDTO.Id == 0)
         {
            var detail = new Detail();
            context.DetailSet.Add(detail);
            return detail;
         }
         return context.DetailSet.First(d => d.Id == detailDTO.Id);
      });    
 
     Mapper.Map<OrderDTO,Order>(orderDTO); 

     context.SaveChanges();
}      
```

Ah, sweet, now we can handle add, update and deletes for the order details.  
This code will work fine in your unit tests..

But..

It will bite you in production.  
Why?  
Because we are binding the dbcontext using closures in the static AutoMapper mappings.  
This code is not thread safe, if two requests arrive at the server at the same time, it will break, becuase both will have mappings bound to one of the active DbContexts.

AutoMapper’s static Mapper class is not threadsafe, we have to modify our code even further.

```csharp
public void CreateOrUpdateOrder(OrderDTO orderDTO)
{
   var config = new ...

   //create an instanced mapper instead of the static API
   var mapper = new AutoMapper.MapperEngine(config);
   var context = ... //get some DbContext
     
   config.CreateMap<OrderDTO,Order>()
   .ConstructUsing((OrderDTO orderDTO) =>
   {
      if (orderDTO.Id == 0)
      {
          var order = new Order();
          context.OrderSet.Add(order);
          return order;
      }
      return context.OrderSet.Include("Details").First(o => o.Id == orderDTO.Id);
   })
   //find out what details no longer exist in the DTO and delete the corresponding entities 
   //from the dbcontext
   .BeforeMap((dto, o) =>
   {
     o
     .Details
     .Where(d => !dto.Details.Any(ddto => ddto.Id == d.Id)).ToList()
     .ForEach(deleted => context.DetailSet.Remove(deleted));
   });

   config.CreateMap<DetailDTO, Detail>()
   .ConstructUsing((DetailDTO detailDTO) =>
   {
       if (detailDTO.Id == 0)
       {
            var detail = new Detail();
            context.DetailSet.Add(detail);
            return detail;
       }
       return context.DetailSet.First(d => d.Id == detailDTO.Id);
   });    
 
   mapper.Map<OrderDTO,Order>(orderDTO); 

   context.SaveChanges();
}      
```

Now then?  
Yeah, we solved it.  
This will work in threaded environments and it does solve the add,modify and delete issues.

However, our code is now so bloated with AutoMapper configs that it is hard to tell what is going on here.  
Even if this solves the use case here, I find this a horrible design, give this so called “simple design” to a rookie that is going to maintain this code for years to come and he will not have any idea what to do with it.

Pros of this design:

- Looks simple on paper
- Easy to implement on **read** side and **client side**

Cons:

- Bloody horrible to implement on the write side, and gets even worse the larger the DTO is
- Relies on magic names if using AutoMapper
- Network ineffective if dealing with large DTOs
- You lose semantics and intentions, there is no way to know *WHY* a change happened

But do note that this can be a valid design, IF, you use a document database or similar.  
That is, if you don’t have a relational storage where you have to analyze what changes was made to the server data.  
e.g. in a Rest API using MongoDB or such, but that has little to do with the key points in this article, which is auto mapping to ORMapper entities.

One of the biggest pain points in this specific case is actually AutoMapper, I think AutoMapper is a great tool, just not for this specific usecase.  
If we remove automapper from the equation here. we could end up with some code that looks like this:

```csharp
public void CreateOrUpdateOrder(OrderDTO orderDTO)
{
    var ctx = ... //get some DbContext
    var order = ctx.OrderSet.FirstOrDefault(o => o.Id == orderDTO.Id);
    if (order == null)
    {
        order = new Order();
        ctx.OrderSet.Add(order);
    }

    //Map properties
    order.Address = orderDTO.Address;            

    //remove deleted details
    order.Details
    .Where(d => !orderDTO.Details.Any(detailDTO => detailDTO.Id == d.Id))
    .Each(deleted => ctx.DetailSet.Remove(deleted));

    //update or add details
    orderDTO.Details.Each(detailDTO =>
    {
        var detail = order.Details.FirstOrDefault(d => d.Id == detailDTO.Id);
        if (detail == null)
        {
            detail = new Detail();
            order.Details.Add(detail);
        }
        detail.Name = detailDTO.Name;
        detail.Quantity = detailDTO.Quantity;
    });

   context.SaveChanges();
}      
```

IMO, this is cleaner, a rookie should not have much problem understanding what is going on, possibly that the “Remove deleted details” part may cause some confusion.  
But still, more readable than the first AutoMapper approach (And refactor friendly).

If I saw the above code in a real project, I wouldn’t be too bothered, it’s not a disaster, but do remember that it will get worse the larger and more complicated the DTO is.  
Just imagine that the details have references to product entities, we soon have a big ball of “ripple load” where each detail iteration causes a load on product.  
If you continue down this route, you will have a really hard to maintain code base and an angry DB breathing up your butt because the code is touching persisted objects in every iteration..

**Conclusion:**  
AutoMapper is a great tool, but it is not built for mapping DTOs to O/R-Mapped entities. it lacks knowledge about things like dirty tracking, identity maps and orphan entities.  
EntityFramework is what it is, many will bash it for being a naive mapper, I think it does it’s job in most cases even if it cant handle all the fancy mappings that NHibernate can.  
The problem here is that most people knows little to nothing about how an ORM really works behind the scenes, and simply believes that you can slap a changed object graph onto the Context/Manager/Session/UoW and the mapper should magically figure out what the heck you did to that object. sorry but that’s not how it works.  
If it did, it would have to do crap loads of queries against the database to compare the new state to the old state.  
If you decide to use an advanced tool like an ORM, make sure you know how they work, ORM’s are insanely complex and they try to hide that complexity from you by simulating that you are working with a normal object graph, this is the true danger of ORMs, they make explicit concepts like a db-query implicit. you can’t see what is going on, you just touch objects and properties.

# Horrible from a conceptual perspective

The design described in this post prevents you from doing Domain Driven Design, it is 100% impossible to use DDD if you are patching state directly into your entities from an DTO.  
You are simply throwing state around w/o any safety net, your entities can go into all sorts of invalid states.

e.g. if you receive a “TraingleDTO” with all its angles set to 0 , oh well, just slap those numbers straight into your Triangle entity.. a total sum for all angles of a triangle that equals 0 is valid, right?

When I do domain modelling I want to capture the language and intentions of the domain experts.  
If the domain experts say that you can add a product to an order, I want to see that somewhere in my code.  
But more on that in the next post.

Well, this is all for now, I hope I managed to explain some of the pitfalls of this architecture.

In my next post I will be explaining why Command pattern and semantics matter.
