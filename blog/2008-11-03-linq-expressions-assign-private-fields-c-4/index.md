---
slug: linq-expressions-assign-private-fields-c-4
title: "Linq Expressions: Assign private fields (.NET 4)"
authors: [rogerjohansson]
tags: ["dlr", "private-fields", "reflection"]
---
**Hold your horses, you might not see this untill 2010**

<!-- truncate -->

In one of the PDC sessions I heard that the Linq.Expressions namespace have been extended so that it now contains expressions for pretty much everything that the new DLR can do.

Since my old post [“Linq Expressions: Access private fields”](http://rogeralsing.com/2008/02/26/linq-expressions-access-private-fields/) is by far my most read blog entry, I figured that I have to throw you some more goodies.

So here it is, the code for assigning private fields using pure Linq Expressions:

```
public static Action<T, I> GetFieldAssigner<T, I>(string fieldName)
{

   ///change this to a recursive call that finds fields in base classes to..)
    var field = typeof(T).GetField(fieldName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic); 

    ParameterExpression targetObject =
    Expression.Parameter(typeof(T), "target");

    ParameterExpression fieldValue =
    Expression.Parameter(typeof(I), "value");

    var assignment = Expression.AssignField(targetObject, field, fieldValue);

    LambdaExpression lambda =
    Expression.Lambda(typeof(Action<T, I>), assignment, targetObject, fieldValue);

    var compiled = (Action<T, I>)lambda.Compile();
    return compiled;
}
```

The code works pretty much the same way that my old field reader did except that this one will return an Action delegate that takes two args: target and fieldValue and returns void.

Some sample usage code:

```
Person roger = .....
var assigner = GetFieldAssigner<Person,string>("firstName");
assigner(roger, "Roggan");
```

By using this approach you get a nice performance boost of about 300 times vs. using reflection with FieldInfo.SetValue.  
(Assuming that you cache the assigner that is)

Pretty sweet.

BTW. Anyone know if this is available in the currently released DLR ?  
In that case you won’t have to wait for .NET 4.

//Roger
