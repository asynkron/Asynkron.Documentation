---
slug: linq-expressions-access-private-fields
title: "Linq Expressions \u2013 Access private fields"
authors:
- rogerjohansson
tags:
- delegates
- lambda
- linq
---
In this post I will show how you can use Linq Expressions to access private (or public) class fields instead of using Reflection.FieldInfo.

<!-- truncate -->

Normally when you want to access a field by its name on a type you have to resort to reflection.  
You will end up with something like this:

```csharp
FieldInfo field = MyType.GetField("someField",BindingFlags.NonPublic | .... );
object res = field.GetValue (MyObj);
```

This suffers from a lot of drawbacks, it’s ugly, it’s untyped and it’s horribly slow to access data via FieldInfo.

Instead of playing around with FieldInfo, you can now use Linq Expressions to build a typed delegate that does this for you.

Here is how you do it:

```csharp
public static Func<T,R> GetFieldAccessor<T,R>(string fieldName)
{
    ParameterExpression param =
        Expression.Parameter(typeof(T), "arg");

    MemberExpression member =
        Expression.Field(param, fieldName);

    LambdaExpression lambda =
        Expression.Lambda(typeof(Func<T,R>), member, param);

    Func<T,R> compiled = (Func<T,R>)lambda.Compile();
    return compiled;
}
```

So what does this method do?  
The first line in it will create a parameter expression, that is an argument that will be passed into our delegate eventually.

The next line creates a member expression, that is the code that access the field we want to use.  
If you look at the code, you will see that we create an expression that access fields (Expression.Field) and that the first arg is the parameter we created before and the 2nd arg is the name of the field we want to access.  
So what it does is that it will access the named field on the object that we pass as an argument to our delegate.

The 3rd line is where we create our lambda expression.  
The lambda expression is the template for our delegate, we describe what we want to pass into it and what we want to get out of it.

The last part of the code will compile our lambda into a typed delegate: Func\<T,R\>, where T is the type of the argument we want to pass it and R is the type of the result we want to get out of it.

Here is an example on how to use this code:

```csharp
Person person = new Person();
person.FirstName = "Roger";
var getFirstName = GetFieldAccessor<Person,string> ("firstName");
... 
//typed access via delegate 
string result = getFirstName(person);
```

Also do note that the “firstName” arg is the name of the field we want to access, not the property that I access in the sample.

This approach is also much faster than Reflection.FieldInfo.  
I made a little benchmark where I accessed the same field a million times.

The Reflection.FieldInfo approach took **6.2 seconds** to complete.  
The Compiled lambda approach took **0.013 seconds** to complete.  
That’s quite a big difference.

So with this approach you can optimize your old reflection code and get some serious performance gains..

Well, that’s all for now.

Enjoy.

//Roger

[![](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2frogeralsing.com%2f2008%2f02%2f26%2flinq-expressions-access-private-fields%2f)](http://www.dotnetkicks.com/kick/?url=http%3a%2f%2frogeralsing.com%2f2008%2f02%2f26%2flinq-expressions-access-private-fields%2f)

See also:

- [Linq Expressions – Calculating with generics](http://rogeralsing.com/2008/02/27/linq-expressions-calculating-with-generics/)
