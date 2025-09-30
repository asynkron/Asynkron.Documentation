---
slug: linq-expressions-from-and-to-delegates
title: "Linq Expressions – From and to delegates"
authors: [rogerjohansson]
tags: []
---
I’m getting quite a few hits on my blog regarding Linq Expressions and how to convert those to and from delegates, so I figure I can just as well make a small post about it.

<!-- truncate -->

### From Delegate to Expression;

This is not really possible, you can never cast or convert an existing delegate into an expression tree.  
You can however assign lambda expressions to expression trees exactly the same way as you assign them to a delegate.

```
//assign a lambda expression to a delegate
Func<int> myDelegate = () => 1 + 2 + a +b;

or:

//assign a lambda expression to an expression tree
Expression<Func<int>> myExpressionTree = () => 1 + 2 + a +b;
```

Notice that you do exactly the same thing, except that the expression tree version wraps the delegate type inside a generic expression class.  
The C# compiler will figure out what your intentions are and compile the code in completely different ways for those two cases.  
This is the reason why you can not use “var” as the type for a lambda assignment, the compiler have no way to figure out if you want a delegate or an expression tree, or even what type the delegate should have.

The first case will generate an anonymous method that is assigned to the delegate var “myDelegate”.  
While the expression tree version will complile the expression into code that builds the expression tree and then asigns the result to the Expression var “myExpressionTree”.

You can also pass lambda expressions exactly the same way;

```
//pass a lambda expression as a delegate

Foo( () => 1 + 2 + a +b );

....

void Foo (Func<int> myExpressionTree)
{..}

or:

//pass a lambda expression as an expression tree

Foo( () => 1 + 2 + a +b );

....

void Foo (Expression<Func<int>> myExpressionTree)
{..}
```

Note that the calling code looks exactly the same in both cases, it is only the definition of the methods that are called that differs.  
This is also how Linq to Objects and Linq to SQL works.

The Linq to Objects provider uses delegates, while the Linq to SQL provider receives expression trees that are later converted into ad hoc SQL statements.

So in short, the compiler can compile the same expressions into two different forms, but you can not cast or convert from a delegate into an expression tree.

### From Expression to Delegate;

Linq expression can not be casted or converted into delegates, they can however be “compiled” into delegates.

eg:

```
//create an linq expression
Expression<Func<int>> myExpressionTree = () => 1 + 2 + a +b;

//compile the expression into a delegate
Func<int> myDelegate = myExpression.Compile();
```

The above code is ofcourse useless, you should of course not create expressions and then immediately compile them into delegates.  
That would be silly since you could assign the lambda into a delegate directly.

However, there are cases where you might want to add code in between the creation of the expression and the delegate compilation.  
eg. you might want to analyze the expression and take certain actions depending on the contents of the expression tree and if some criteria is met, compile the delegate.

The most common reason why you would want to compile linq expressions into delegates is however a completely different story.  
Since .NET 3.5 , there are a complete namespace of expression classes.  
You can manually build expression trees using those classes and call compile on that tree in order to compile it into CIL code.  
This means that you can use the Linq Expression trees as the foundation of a simple compiler.

And as of .NET 4.0, we are getting even more power for our expression trees, the entire Dynamic Language Runtime is build around the Linq Expressions.  
So you can build expression trees containing if statements, for loops, variable declarations, assignments etc etc.

But more about that in another post 🙂

//Roger
