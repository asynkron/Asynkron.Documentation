---
slug: linqing-mgrammar-to-cil
title: "Linqing M Grammar to CIL"
authors: [rogerjohansson]
tags: []
---
Today I will present my first attempt at a M Grammar language: **Mg Basic** : -)

<!-- truncate -->

### Why Mg Basic?

This is of course not meant as a serious project where I try to introduce a new language to the community.  
The reason I created this project is simply because I wanted to learn more about the new technologies that were presented to us during the PDC conference.  
And hopefully a few others can benefit and learn from this too.

For example; this project makes heavy use of Linq Expressions, examples that generally are somewhat hard to find.  
(Actually I haven’t found any examples using the new .NET 4 expressions at all)

It also demonstrates how to parse and transform the M Graph parse tree into a real AST with very little effort.  
And It contains a few nifty patterns when using M Grammar from .NET.

### So what is Mg Basic?

In short;  
it is a statically typed language that compiles down to CIL code.  
It does not support custom types nor functions.  
It is simply a sequential Basic like language intended for demo purposes.

All in all, not very sexy at all, but hopefully somewhat interesting to dissect and play with : -)

### Technologies used:

**M Grammar  
–** Defining the language grammar.

My grammar is largely based on the “Simple” grammar from GoldParser.  
However it has been altered quite a bit and also adapted to fit M Grammar

**System.DataFlow.DynamicParser  
– **Parsing the input code.

DynamicParser is simply a generic parser for M Grammar files, it will parse the input code based on your grammar and return an ‘M Graph’

**MGraphXamlReader  
– **Deserializing the parse tree to my AST

MGraphXamlReader is a deserializer that deserializes an M Graph into a custom object graph using XAML.

**.NET 4 Linq.Expressions  
–** Compiling the AST to CIL.

Linq.Expressions is not really new in .NET 4, but they have been greatly extended to support statements and entire code blocks in .NET 4.

### Mg Basic features:

**Variables:**

```
string myString = "hello world"
int myInteger = 123
decimal myDecimal = 123.456
bool myBool = true
```

**Expressions:**

```
int myInteger = 1+2*3-x*(y+3)
string myString = "hello " + name + "!"
bool myBool = x < y
string conversion = '1 + 2 = ' + (string) (1 + 2)
```

**User interaction:**

```
string name = input
print name
```

**Loops and conditions:**

```
for int i = 1 to 10
print i
next

int i = 0
while i < 10 do
print i
i=i+1
loop

if i > 100 then
print 'i is greater than 100'
else if i > 50 then
print 'i is greater than 50'
else
print 'i is 50 or less'
end
```

### How it works:

**Step 1 – Parsing:**

The parser will load the “compiled grammar” for Mg Basic.  
A compiled grammar is essentially a look up table for a state machine, once the grammar is loaded the parser will know how to parse your input code.

The input code is then passed into the parser which will return an M Graph parse tree (unless there are syntax errors in the input code).

**Step 2 – AST resolution:**

This step generally involves quite a bit of hand coding or code generation when using other parser frameworks.  
But when working with M Grammar this is very easy;  
We simply pass the M Graph from the parser into the “MGraphXamlReader”.

The MGraphXamlReader is an open source project from Microsoft hosted on Codeplex, and I hope that it will be shipped with the final release of Oslo / M Grammar.

The MGraphXamlReader will then transform the M Graph into XAML and then deserialize the AST object graph based on that XAML code.

I did have a few problems in this step before I figured out how to solve them.  
The M Graph parse tree will contain tokens exactly as the parser captured them.  
Lets say that our grammar supports HEX values and we want to map those values to integers in our AST.

This is not supported by M Grammar itself nor by the MGraphXamlReader since you can only map verbatim values, eg. “true” can be mapped to a .NET Boolean “true”, but “0xCAFE” not be mapped to an integer.

So how can you solve it?

I solved it by adding transformer properties to my AST.  
My IntegerLiteral AST nodes will have two properties:

*“***string RawValue”** and **“int Value”**.

The grammar will map the hex vale (or any other token that needs to be mapped) to the “string RawValue” property in the AST.  
The setter of that property will then send the raw string value to a method that parses the value into the desired representation, in this case an int32 and store the parsed value in the “int Value” property.

This approach can be used for whatever mapping needs you have, eg mapping to enums or deserializing entire objects from string to object using type converters.

So once I figured that out, it was an easy task to implement it.

Another friction point was that you need to supply an “identifier -\> type” mapping for the XAML engine.  
This mapping is used so that the the M Graph can be deserialized as objects of a type mapped to an identifier.

This was also a simple task to automate, I used a bit of reflection to pull all the non abstract types from my AST namespace and mapped those to identifiers with the same name as the type.

**Step 3 – Compiling the AST into CIL code.**

This was probably the easiest step to complete.  
Normally you would do this type of thing using Code DOM or Reflection.Emit.

I decided to go for Linq.Expressions, mainly because I wanted to learn more about the new features in .NET 4, but also a bit for the hell of it : -)

I uses the old visitor pattern to accomplish this; I have a visitor that visits all my AST nodes and then transform each node into an Linq.Expression which is returned to the parent node.

Once each node is transformed, the root node expression will be placed in an lambda body.  
The lambda expression is then compiled to CIL code using the LambdaExpression.Compile method.

In my case I compile it into a standard parameter less “Action” delegate, but you can easily change this to whatever delegate type you want.

By changing the delegate type, you could implement input arguments for the compiled code.  
This could be very useful in a true DSL where you might want to pass business objects/data to the script.

Well that’s pretty much it.

So by combining M Grammar with Linq Expressions you can get a DSL with full .NET integration up and running quite fast.  
In my case the whole thing took about 10 hours to implement.  
(This does however not include the time I had to spend on learning M Grammar syntax and how to avoid ambiguity in the grammar.. there is still alot of friction there)

### Resources:

**MGraphXamlReader:  **
[http://code.msdn.microsoft.com/oslo/Wiki/View.aspx?title=MGrammarXAMLSample](http://code.msdn.microsoft.com/oslo/Wiki/View.aspx?title=MGrammarXAMLSample)

**Mg Basic Source code:  **
[Gold Parser Sample](http://dl.dropbox.com/u/63708110/GoldLinq.zip)

**Mg Basic Grammar:  **
[MG Basic Grammar](http://dl.dropbox.com/u/63708110/Simple%202.grm)

### Running the demo:

Open up the MgBasic solution in VS.NET 2010 and run it.  
The imput code is hard coded into the program.cs, so there is no fancy user interaction going on here.  
It is just a demonstration of how to parse and compile the code, not how to build a good user experience ; -)

Also note that this requires the Oslo preview in order to run.

Note 2: There are currently no warnings or error checks at all in the compiler, if you feed it invalid code, it will blow up.

**Enjoy!  **
//Roger
