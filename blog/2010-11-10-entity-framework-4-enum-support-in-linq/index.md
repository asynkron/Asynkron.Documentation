---
slug: entity-framework-4-enum-support-in-linq
title: "Entity Framework 4 Enum support in Linq"
authors: [rogerjohansson]
tags: []
---
As many of you might know, Entity Framework 4 still lacks support to map enum properties.  
There are countless of more or less worthless workarounds, everything from exposing constants integers in a static class to make it look like an enum to totally insane generics tricks with operator overloading.

<!-- truncate -->

None of those are good enough IMO, I want to be able to expose real enum properties and make Linq queries against those properties, so I’ve decided to fix the problem myself.

My approach will be using Linq Expression Tree rewriting using the ExpressionVisitor that now ships with .net 4.  
By using the ExpressionVisitor I can now clone an entire expression tree and replace any node in that tree that represents a comparison between a property and an enum value.

In order to make this work, the entities still needs to have an O/R mapped integer property, so I will rewrite the query from using the enum property and enum constant to use the mapped integer property and a constant integer value.

For me this solution is good enough, I can make the integer property private and make it invisible from the outside.

Example

```
public class Order
{
     //this is the backing integer property that is mapped to the database
  private int eOrderStatus {get;set;}

  //this is our unmapped enum property
  public OrderStatus Status
     {
  get{return (OrderStatus) eOrderStatus;}
            set{eOrderStatus = (int)value;}
     }

     .....other code
}
```

﻿This code is sort of iffy and it does violate some POCO principles but it is still plain code, nothing magic about it..

So how do we get our linq queries to translate from the enum property to the integer property?

The solution is far simpler that I first thought, using the new ExpressionVisitor base class I can use the following code to make it all work:

```
namespace Alsing.Data.EntityFrameworkExtensions
{
    public static class ObjectSetEnumExtensions
    {
        private static readonly EnumRewriterVisitor visitor = new EnumRewriterVisitor();
        private static Expression< Func< T, bool>> ReWrite< T>(this Expression< Func< T, bool>> predicate)
        {
            var result = visitor.Modify(predicate) as Expression< Func< T, bool>>;
            return result;
        }

        public static IQueryable< T> Where< T>(this IQueryable< T> self,
            Expression< Func< T, bool>> predicate) where T : class
        {
            return Queryable.Where(self, predicate.ReWrite());
        }

        public static T First< T>(this IQueryable< T> self,
            Expression< Func< T, bool>> predicate) where T : class
        {
            return Queryable.First(self, predicate.ReWrite());
        }
    }

    public class EnumRewriterVisitor : ExpressionVisitor
    {
        public Expression Modify(Expression expression)
        {
            return Visit(expression);
        }

        protected override Expression VisitUnary(UnaryExpression node)
        {
            if (node.NodeType == ExpressionType.Convert && node.Operand.Type.IsEnum)
                return Visit(node.Operand);

            return base.VisitUnary(node);
        }

        protected override Expression VisitMember(MemberExpression node)
        {
            if (node.Type.IsEnum)
            {
                var newName = "e" + node.Member.Name;
                var backingIntegerProperty = node.Expression.Type.GetMember(newName, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public)
                    .FirstOrDefault();

                return Expression.MakeMemberAccess(node.Expression, backingIntegerProperty);
            }

            return base.VisitMember(node);
        }
    }
}
```

The first class, is an extension method class that overwrite the default “where” extension of IQueryable of T.  
The second class is the actual Linq Expression rewriter.

By including this and adding the appropriate using clause to your code, you can now make queries like this:

```
var cancelledOrders = myContainer.Orders.Where(order => order.Status == OrderStatus.Cancelled).ToList();
```

You can of course make more complex where clauses than that since all other functionality remains the same.

This is all for now, I will make a followup on how to wrap this up in a Linq query provider so you can use the standard linq query syntax also.

Hope this helps.

//Roger
