---
slug: making-a-custom-linq-engine
title: "Making a custom Linq engine"
authors: [rogerjohansson]
tags: ["c", "linq", "o-r-mapping"]
---
[**You can download the complete source here**](http://www.puzzleframework.com/Blog/Downloads/customlinq.zip "Full source code")  
**NOTE:** The download contains much more than this post.

<!-- truncate -->

Today I’m going to show how to make a custom linq engine.

So, why would you want to create your own engine?

Well replicating the standard in mem engine is pretty pointless except for educational purposes.  
But you might need custom engines for your own frameworks where you want to query your own special DB or media of some sort.  
We use this in NPerist, we transform the linq query into our own NPath DSL and then run the NPath query through NPersist into the database.

Anyway, back to the sample.  
Lets start by creating a simple console application and add the following code in the Main method:

    using System.Linq; 
    ... 
    ... 
    ... 
    //setup test data 
    List<string> source = new List<string>() { 
        "public", 
        "protected internal", 
        "void", 
        "static", 
        "for", 
        "string", 
        "int", 
        "long", 
        "List<T>" 
    };                  

    //run a simple query 
    var result = from item in source 
                 where item.Length > 1 
                 select item + " hello linq"; //display the result                

    Console.WriteLine(); 
    Console.WriteLine("Result:------------------------"); 
    foreach (var item in result) 
    { 
        Console.WriteLine("{0}", item); 
    }

Nothing fancy, we simply init a list with a few strings, and then we run a standard linq query on it.

Now lets start writing our own Linq engine.  
To do this we need a few delegates:

    // T = item type 
    // IN = item type IN 
    // OUT = item type OUT  
      
    //delegate to handle the where clause 
    public delegate bool WhereFunc<T>(T type);                

    //delegate to handle the select clause 
    public delegate OUT SelectFunc<IN, OUT>(IN item);

We also need two extension methods:

    namespace MyLinqEngine; 
    { 
    public static class Sequence 
    { 
        //extension method that will handle where clauses 
        public static List<T> Where<T> 
        (this List<T> source, WhereFunc<T> matchDelegate) 
        { 
            //create a result list 
            List<T> result = new List<T>();         
            //scan all items in the source 
            foreach (T item in source) 
            { 
                //check for match 
                bool match = matchDelegate(item);             
                if (match) 
                { 
                    //add match to result 
                    result.Add(item); 
                } 
            } 
       
            return result; 
        }     
        
        //extension method that will handle select clauses 
        public static List<OUT> Select<IN, OUT> 
        (this List<IN> source, SelectFunc<IN, OUT> selectorDelegate ) 
        { 
            //create a result list 
            //since the result will have the exact same size as 
            //the source we can init it with a fixed size 
            List<OUT> result = new List<OUT>(source.Count);                  
            //scan each item in the source 
            foreach (IN item in source) 
            { 
                //transform the items in the source to an 
                //item of the given out type 
                OUT resultItem = selectorDelegate(item); 
                result.Add(resultItem); 
            }         
            return result; 
        } 
    } 
    }

And that’s it!  
That’s all you need in order to create the simplest form of custom Linq engine.

The default Linq extensions are activated by the “using System.Linq;” at the top of your program.cs class file.  
We can now remove that line and replace it with “using MyLinqEngine;” in order to activate our own linq extensions.

You’ve now got your very own debuggable Linq engine.

Happy coding.

//Roger

[**You can download the complete source here**](http://www.puzzleframework.com/Blog/Downloads/customlinq.zip "Full source code")  
**NOTE:** The download contains much more than this post.
