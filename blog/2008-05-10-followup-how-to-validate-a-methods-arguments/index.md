---
slug: followup-how-to-validate-a-methods-arguments
title: "Followup: How to validate a method\u2019s arguments?"
authors:
- rogerjohansson
tags:
- arguments
- extension-methods
- validation
---
A few days ago I and Fredrik Normén had a discussion about argument validation here: [http://weblogs.asp.net/fredriknormen/archive/2008/05/08/how-to-validate-a-method-s-arguments.aspx](http://weblogs.asp.net/fredriknormen/archive/2008/05/08/how-to-validate-a-method-s-arguments.aspx)

<!-- truncate -->

The discussion got kind of stuck in my head, so I have been thinking a bit more about it.  
And today I came up with a solution that I think is both clean and easy to extend.

## Fluent Argument Validation Specification

The idea is to transform the value of the argument that should be validated into an object which contains both value and argument name, so that this object can be passed around to different fluent validation methods.  
By doing this, we can now add new extension methods for the generic argument class in order to extend our fluent validation API.

A fulent API will let us read and write the requirements just like a specification for each argument.

**Here is an example of the consumer:**

```csharp
public static void MyMethod(string someArg,int someOtherArg)
{
    someArg.RequireArgument("someArg")
           .NotNull()
           .ShorterThan(10)
           .StartsWith("Roger");

    someOtherArg.RequireArgument("someOtherArg")
                    .InRange(10,100)
                    .NotEqual(33)
                    .NotEqual(51)
        //do stuff
}
```

As you can see, we only have to specify the argument name in the require method.  
The require method will return an instance of **“Validation\<T\>”** which is our generic argument class.

The argument class have no own instance methods, instead we have extension methods which are fluent so that we can call them in a chain.

These extension methods can operate directly on **“Validation\<T\>”**,with or without generic constraints.  
We can also add extension methods for specific types, like: **“Validation\<string\>”**, and thus allow us to validate strings in different ways than other types.

But enough talking, here is the required code to accomplish this:

**The implementation of the Validation\<T\> class:**

```csharp
public class Validation<T>
{
    public T Value { get; set; }
    public string ArgName { get; set; }
    public Validation(T value, string argName)
    {
        Value = value;
        ArgName = argName;
    }
}
```

**The implementation of the Require method:**

```csharp
public static class Extensions
{
    public static Validation<T> RequireArgument<T>(this T item, string argName)
    {
        return new Validation<T>(item, argName);
    }
}
```

**And the implementation of the different validation methods:**

```csharp
public static class ValidationExtender
{
    [DebuggerHidden]
    public static Validation<T> NotNull<T>
        (this Validation<T> item) where T : class
    {
        if (item.Value == null)
            throw new ArgumentNullException(item.ArgName);
        return item;
    }
    [DebuggerHidden]
    public static Validation<string> ShorterThan
        (this Validation<string> item, int limit)
    {
        if (item.Value.Length >= limit)
            throw new ArgumentException(
                  string.Format("Parameter {0} must be shorter than {1} chars",
                      item.ArgName,limit)
                                        );
        return item;
    }
    [DebuggerHidden]
    public static Validation<string> StartsWith
        (this Validation<string> item, string pattern)
    {
        if (!item.Value.StartsWith(pattern))
            throw new ArgumentException(
      string.Format ("Parameter {0} must start with {1}",item.ArgName, pattern)
                                       );
        return item;
    }
        //other validation methos
        .....
}
```

The **\[DebuggerHidden\]** attribute is optional, but it will make your stacktrace look better since it will break in the method that performs the Require call, and not inside the validation methods.

So by using the debugger hidden attribute we can get the behaviour as seen on this screenshot:

![](https://i0.wp.com/www.puzzleframework.com/Roger/validationexception.png)  
 

Enjoy

//Roger
