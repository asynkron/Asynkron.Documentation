---
slug: more-on-plastic
title: "More on Plastic"
authors: [rogerjohansson]
tags: []
---
I’ve added some more features to my toy language “Plastic”.

<!-- truncate -->

**Partial application of function arguments.**  
This is now used for generators.  
Yield is no longer a core function, instead, each generator takes a closure as its last argument which is then supplied by the foreach function.  
This way the foreach body don’t have to be stored as a symbol, it is just passed as an argument to the generator.

```
func Range(low,high,yield)
{
    for(let i=low,i<=high,i++)
    {
        yield(i);
    };
};

// apply value to "low"
let From10 = Range(10);

// apply value to "high"
foreach(x in From10(20))
{ //this block is transformed to a closure and passed to yield
    print(x);
};
```

**Break and Continue**  
Loop behavior can now be altered with break and continue.  
I implemented those as special values that breaks any execution flow almost like exceptions.  
The values are then bubbled up to the first loop which consumes the values and perform the appropriate action.

I guess exceptions and “return” could be implemented the same way.

**\[Edit\]**

I’ve added some basic one way coroutine support to support breaking out of generators that are constructed from nested loops.  
Before, a break would only exit the most inner loop of the generator.

Now I can do things like this:

```
func primes(low,high,yield)
{    
    foreach(i in range(low,high))   
    {             
         foreach(j in range(2,i/2))        
         { 
             if (i % j == 0)
             {
                break;
             };
         }
         else
         {  
             yield(i);
         };         
    }; 
};


foreach(prime in primes(2,100))
{
    print(prime);
    if (prime > 50,break);
}
else
{
    print(""done"");
};
```
