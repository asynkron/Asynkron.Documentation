---
slug: linq-expressions-calculating-with-generics
title: "Linq Expressions \u2013 Calculating with generics"
authors:
- rogerjohansson
tags:
- delegates
- lambda
- linq
---
**You can find the full code for this post here:  **
[**http://www.puzzleframework.com/Roger/GenericMath.cs.txt**](http://www.puzzleframework.com/Roger/GenericMath.cs.txt) 

<!-- truncate -->

The .NET framework lacks support for calculating with generic types.  
There is no way to ensure that a generic type supports operations like Add, Sub, Div and Mul etc.

More about the problem can be found here:  
[http://www.thescripts.com/forum/thread278230.html](http://www.thescripts.com/forum/thread278230.html)

*“They are not. There have been a few threads on this subject before,  
and the conclusion was that it is impossible to perform any of the  
built-in mathematical operations on generic types.”*

Many have tried to come up with solutions for calculating with generic types, most of them based on provider solutions where you have to provide a “Calculator” class for each type that you want your generic class to support.  
Quirky to say the least..

One such solution exists here: [http://www.codeproject.com/KB/cs/genericnumerics.aspx](http://www.codeproject.com/KB/cs/genericnumerics.aspx)

And don’t get me wrong, I’m NOT saying that those are bad implementations, it was just not possible to solve this in any clean way before.

But now when we have Linq Expression Trees we can solve this. and do it quite nicely.

We can produce delegates that performs the math operations for us.  
Like this:

```csharp
private static Func<T, T, T> CompileDelegate
 (Func<Expression,Expression,Expression> operation)
{
    //create two input parameters
    ParameterExpression leftExp =
        Expression.Parameter(typeof(T), "left");

    ParameterExpression rightExp =
        Expression.Parameter(typeof(T), "right");

    //create the body from the delegate that we passed in
    Expression body = operation(leftExp, rightExp);

    //create a lambda that takes two args of T and returns T 
    LambdaExpression lambda =
        Expression.Lambda(typeof(Func<T, T, T>), body, leftExp, rightExp);

     //compile the lambda to a delegate 
    // that takes two args of T and returns T 
    Func<T, T, T> compiled = (Func<T, T, T>)lambda.Compile(); 
    return compiled; 
}
```

 We can now call this method and get our typed delegates for math operations:

```csharp
private static readonly Func<T, T, T> Add =
    CompileDelegate(Expression.Add);
```

And this is pretty much all the magic we need to solve the problem with generics and math operations.  
I have created a generic class that support all the standard operators based on this approach.

**You can find the full code here:  **
[**http://www.puzzleframework.com/Roger/GenericMath.cs.txt**](http://www.puzzleframework.com/Roger/GenericMath.cs.txt)

This makes it possible to use code like this:

```csharp
private static T DoStuff<T>(T arg1, T arg2, T arg3)
{
    if (!Number<T>.IsNumeric) 
        throw new Exception("The type is not numeric");       

    Number<T> v1 = arg1; 
    Number<T> v2 = arg2; 
    Number<T> v3 = arg3; 
         
    return v1 * v2 - v3; //not possible with normal generics
}
```

OK that was a very naive example, but at least you can see that it is possible to perform calculations on the generic type.
So no more provider based calculator classes, just fast typed delegates 🙂

Enjoy

**\[Edit\]  **
For those who are interested in this kind of stuff, there is a project called MiscUtil that can be found here:  
[http://www.yoda.arachsys.com/csharp/miscutil/](http://www.yoda.arachsys.com/csharp/miscutil/)

They do the same stuff as in this article, but much more complete and polished code than my sample.

//Roger
