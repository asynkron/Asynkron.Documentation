---
slug: more-linq-support-for-npersist
title: More Linq support for NPersist
authors:
- rogerjohansson
tags:
- linq
---
I’ve added a bit more Linq support for NPersist today.

<!-- truncate -->

The nice thing is that we can “cheat” in our Linq provider, we can transform our Linq queries into NPath queries.  
Thus, I don’t have to touch the wicked SQL generation.  
I just have to produce valid NPath, which is pretty similar to Linq.

Just look at the following code:

```csharp
private string ConvertAnyExpression(MethodCallExpression expression)
{ 
    string fromWhere = ConvertExpression(expression.Arguments[0]);     
    if (expression.Arguments.Count == 1) 
        return string.Format("(select count(*) from {0}) > 0", fromWhere); 
    else 
    { 
        LambdaExpression lambda = expression.Arguments[1] as LambdaExpression; 
        string anyCond = ConvertExpression(lambda.Body); 
        return string.Format("(select count(*) from {0} and {1}) > 0", fromWhere,anyCond); 
    } 
} 
```

That’s all the code that we needed in order to support “list.Any()” and “list.Any(x =\> ….)”.
This both makes the Linq provider easier to build, and it makes it way easier to unit test it too.  
We simply have to compare the result with an expected NPath string.  
Like this:

```csharp
string expected = "select * from Customer where ((Customer != ?))";
string actual = res.Query.ToNPath(); 
Assert.AreEqual<string>(expected, actual);
```

So I think we have most of the standard query elements in place now.  
I just have to add support for a few more things inside NPath, things like “skip”, “is” etc.
