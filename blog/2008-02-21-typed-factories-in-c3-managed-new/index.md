---
slug: typed-factories-in-c3-managed-new
title: "Typed factories in C#3 – Managed “new”"
authors: [rogerjohansson]
tags: ["c", "design-patterns", "factory-methods", "managed-new"]
---
One thing that always bothered me with factory methods in earlier versions of C# is that the only way to make a generic factory method, you have to pass in all the constructor args as an object array.

<!-- truncate -->

A normal factory method might look something like this:

    public T Create<T>(params object[] args) 
    ...

And you invoke it with:

    Person person = MyFactory.Create<Person>(arg1,arg2,arg3);

When doing so, you have no clue what args you can pass to it, there is no intellisense here, we only know that our Create method takes a dynamic numer of args.

So wouldn’t it be sweet if we could make a factory that knows what args you can pass to it?  
I think so, and I found a solution for it today.

I solved it like this:

    Person person = MyFactory.Create(() => new Person("Roger","Alsing"));

As you see, instead of passing an object array to my create method, I pass it a lambda expression.  
The Create method can then examine the expression tree from the lambda, and do whatever it want with the parameters.

The code for dealing with this looks like this:

    static T Create<T>(Expression<Func<T>> exp) 
    {            
        LambdaExpression lambda = exp as LambdaExpression; 
        NewExpression body = lambda.Body as NewExpression;                 
        List<object> argsList = new List<object>(); 
        foreach (var arg in body.Arguments) 
        { 
            //create a lambda to wrap up the expression for "arg" 
            LambdaExpression argLambda = Expression.Lambda(arg); 
            //compile the lambda 
            var argDel = argLambda.Compile(); 
            //get the arg value by invoking the compiled lambda 
            object argValue = argDel.DynamicInvoke(); 
            //add the raw value to the arg list 
            argsList.Add(argValue); 
        }     
        object[] argsArr = argsList.ToArray();     
        //this is where you might want to modify. 
        //eg, make it create some proxy type instead 
        //this is an naive example so I will just create an instance 
        //of the original type and return it.. 
        T instance = (T)Activator.CreateInstance(typeof(T), argsArr); 
        return instance; 
    }

This way I could make typed factory calls for eg. NAspect or NPersist and let the factory return an AOP proxy that is instanced with the parameters from the lambda expression.

Or you could use it in order to describe different singletons, create singletons based on the inparams.  
Patrik Löwendahl blogged about singleton patterns today [http://www.lowendahl.net/showShout.aspx?id=187](http://www.lowendahl.net/showShout.aspx?id=187)  
You can do the same with this approach, but with the benefit that you get typed inparams for the constructor.

You could say that this becomes a form of managed “new”, where you can write a “new” expression and benefit from intellisense and all that, and still be able to override the “new” and return other types or whatever you want.

Hope you like it 🙂

\[edit\]  
An improved version of this with support for property/field initializers can now be found at:  
[http://rogeralsing.com/2008/02/21/typed-factories-in-c3-v2/](http://rogeralsing.com/2008/02/21/typed-factories-in-c3-v2/)
