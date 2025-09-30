---
slug: orm-and-c3-anonymous-types
title: "ORM and C#3 anonymous types"
authors: [rogerjohansson]
tags: ["anonymous-types", "c", "linq", "o-r-mapping"]
---
Here goes my first blog post in 1+ years.

<!-- truncate -->

Nowadays I’m playing around with VS 2008 trying to abuse all the new features as much as possible.

Earlier today I was talking to Mats Helander about making a NPersist v3, for .NET 3.5.  
We were discussing new features such as supporting anonymous types instead of our old “Tabular” concept.

After a while I started to think about the possibilities to use anonymous types to create read only views for stored procs,  
and I came up with a quite slick solution ( in my own opinion OFC 😉 )

Anyway, here is what I came up with:

    //create a prototype for our result 
    var prototype = new { FirstName = "" , Age = 0 , Email = "" };      

    //fill a list with items of the above type with data from an sproc 
    var res = MyDal.ExecuteStoredProc(prototype, "sp_MyStoredProc", p1, p2, p3);      

    //present the data in our top notch UI 
    foreach (var item in res) 
    { 
        Console.WriteLine("FirstName = {0}", item.FirstName); 
    }

What I do here is:  
I create an object of an anonymous type, which will act as a prototype for our result.  
The anonymous type contains our properties and the type for each property.

Then I pass the prototype object into my DAL and ask my DAL to execute an stored procedure with some args.  
The DAL executes procedure and fill a generic list of my anonymous type with the result.  
And then return the filled list the consumer.

This allows the consumer to call a stored procedure and get the result in an objectified way.  
Making it possible to work with his data in a typed way w/o adding typed datasets or entity classes.  
OK, the anonymous type is a sort of entity class too.  
But since it can be designed per use case, you do not have to clutter the project with loads of view specific classes.

Well that’s it for now.  
Full sample code will be provided soon.

//Roger
