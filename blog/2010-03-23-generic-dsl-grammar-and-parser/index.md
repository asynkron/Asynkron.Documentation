---
slug: generic-dsl-grammar-and-parser
title: "Generic DSL Grammar and Parser"
authors: [rogerjohansson]
tags: ["ast", "dsl", "gold-parser", "intentional"]
---
About a year ago I blogged about an idea of an extensible language; [http://rogeralsing.com/2009/03/18/an-intentional-extensible-language/](http://rogeralsing.com/2009/03/18/an-intentional-extensible-language/)   
Since then, I have been experimenting with this concept quite a bit.

<!-- truncate -->

I have now created a more complete grammar which contains hard-coded support for some constructs, e.g. assignments, lambdas, binary and unary operations.  
What I ended up with is not a language, but rather a parser for a structured document.  
You can think about it like XML, XML gives you structured documents which you can traverse and transform via code.

This is pretty much exactly the same, but the syntax looks like a C derivate rather than a mark up language.

So what’s the point of it?

The idea is to make it possible for developers to create their own textual DSL’s without having to care about any of the gory details of parsing and grammar construction.

A lot of people are currently using XML to define different types of rules or entire scripts, e.g. build scripts or custom business rules.  
This works great since it is easy to deal with XML documents via code.

The downside of XML based DSLs is that they are extremely hard to read and edit!  
(I know that a lot of people disagree with me here)

Let’s say for the sake of the argument that we want to define some custom business pricing rules.  
Using XML that could look something like:

```
<rules>
   <rule product="50050" >
      <condition>
          <greaterthan>
              <leftoperand>
                    <property value="quantity" />
              </leftoperand>
              <rightoperand>
  <integerliteral value="200" />
              </rightoperand>
          </greaterthan>
      </condition>
      <price>
            <add>
  ... etc etc ...
            </add>
      </price>
   </rule>
</rules>
```

Such XML rule definition can easily bloat from something fairly simple to something completely horrible when more requirements are thrown at it.

Using the generic DSL grammar that I have created, the above rules would look something like this:

```
product 50050
{
    when (quantity > 200) then (20 - quantity / bonus);

    when ... //more pricing rules for same product
};
```

Or you could use it to define Google protobuffer messages:

```
message OrderPlaced
{
 1 Guid MessageId;
 2 Guid CustomerId;
 3 int OrderId;
 4 List(OrderDetail) Details;
};
```

Or what about defining some CQRS entity definitions?

```
public entity Customer
{
    private string Name;

  command Rename(string newName)
    {
      require (newName != null);
      Renamed (newName);
    };

   event Renamed(string newName)
    {
        this.Name = newName;
    };
};
```

How it works, in short:  
The grammar is based on a few simple constructs;  
Every line is an “statement” and statements are an expression terminated with “;”.

An expression can be things like an assignment,a lambda, a binary operation or a “Chain”.  
A “Chain” consists of zero or more constructs that occurs in a whitespace separated sequence.  
Members of a chain can be primitive constructs such as primitives, identifiers, bodies `{a;b;c;}` and tuples `(a,b,c)`.  
Since there is only a handful of constructs, it is very easy to traverse and analyze the parsed documents.

If we take the above “customer entity” definition, we would get a structure like:  
A statement (chain) containing: public, entity, customer, body.  
Where the first 3 elements are identifiers and the last item is a body.  
A body is a structure containing zero or more statements.  
So the body of the customer entity would consist of 3 statements, the member variable “name”, the command “Rename” and the event “Renamed”.  
Each of those statements are chains containing their own sub items.

I am currently cleaning up the parser and I will also add some convenience methods to make it easier to match structures in the resulting document.  
So code and more examples will hopefully be up in a few days.

//Roger
