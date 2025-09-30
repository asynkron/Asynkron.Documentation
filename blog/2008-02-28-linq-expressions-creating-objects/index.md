---
slug: linq-expressions-creating-objects
title: "Linq Expressions – Creating objects"
authors: [rogerjohansson]
tags: ["delegates", "lambda", "linq", "linq-expressions"]
---
This post shows how you can use Linq expression trees to replace Activator.CreateInstance.

<!-- truncate -->

**but first, please note that this is a followup on Oren’s post so read it before you read mine:  **
[http://www.ayende.com/Blog/archive/2008/02/27/Creating-objects–Perf-implications.aspx](http://www.ayende.com/Blog/archive/2008/02/27/Creating-objects--Perf-implications.aspx)

In C#3 we can use Linq expression trees to solve this problem to.  
I’m not saying that it is a better or faster solution than Oren’s IL emit version.  
The IL emit is completely optimized for what it is supposed to do, so its hard to beat.  
This is just an alternative if you are a bit affraid of IL emit ;-), Linq expressions are just easier to understand for most people. 

So how is it done?  
First we need a delegate declaration:

```
delegate T ObjectActivator<T>(params object[] args);
```

We will use this delegate in order to create our instances.  
We also need a generator that can compile our delegates from expression trees:

```
public static ObjectActivator<T> GetActivator<T>
    (ConstructorInfo ctor)
{
    Type type = ctor.DeclaringType;
    ParameterInfo[] paramsInfo = ctor.GetParameters();                  

    //create a single param of type object[]
    ParameterExpression param =
        Expression.Parameter(typeof(object[]), "args");
 
    Expression[] argsExp =
        new Expression[paramsInfo.Length];            

    //pick each arg from the params array 
    //and create a typed expression of them
    for (int i = 0; i < paramsInfo.Length; i++)
    {
        Expression index = Expression.Constant(i);
        Type paramType = paramsInfo[i].ParameterType;              

        Expression paramAccessorExp =
            Expression.ArrayIndex(param, index);              

        Expression paramCastExp =
            Expression.Convert (paramAccessorExp, paramType);              

        argsExp[i] = paramCastExp;
    }                  

    //make a NewExpression that calls the
    //ctor with the args we just created
    NewExpression newExp = Expression.New(ctor,argsExp);                  

    //create a lambda with the New
    //Expression as body and our param object[] as arg
    LambdaExpression lambda =
        Expression.Lambda(typeof(ObjectActivator<T>), newExp, param);              

    //compile it
    ObjectActivator<T> compiled = (ObjectActivator<T>)lambda.Compile();
    return compiled;
}
```

It’s a bit bloated but keep in mind that this version is completely dynamic and you can pass any constructor with any arguments to it.

Once we have the generator and the delegate in place, we can start creating instances with it:

```
ConstructorInfo ctor = typeof(Created).GetConstructors().First();
ObjectActivator<Created> createdActivator = GetActivator<Created>(ctor);
...
//create an instance:
Created instance = createdActivator (123, "Roger");
```

 And that’s it.  
I haven’t done any benchmarking to compare it to Oren’s IL emit version, but I would guess that it is almost but not quite as fast.

Benchmark – Creating 1000 000 instances:

```
Activator.CreateInstance: 8.74 sec
Linq Expressions:         0.104 sec
```

My benchmarks is w/o the .ToString() stuff that is included in Oren’s post.. so don’t compare my numbers to his.. it’s done on a different machine too.

//Roger
