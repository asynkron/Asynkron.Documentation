---
slug: i-thought-i-knew-c
title: "I thought I knew C#"
authors: [rogerjohansson]
tags: []
---
I honestly thought I had a pretty fair grasp on C# for the last few years.

<!-- truncate -->

But apparently there are features that I haven’t known about.

The first one is covariance on arrays in C#

```csharp
string[] strings = new[]{"Hello","Covariance"};

//assign the string array to an object array
object[] objects = strings;

objects[0] = "Hi"; //OK
objects[1] = 123; //runtime exception
```

I know that true covariance and contravariance will come in C# 4.

But I really didn’t know it was already implemented for arrays, I found this out maybe two months ago.

Also note the last line, we got dynamic type checks in C# , ewwww 😉

Another feature I didn’t know about is this:

```csharp
this = new Foo();
```

Think I’m kidding with you?

Assignments to “this” ??

This is actually possible inside **structs**, which makes sense when you think about it, since you only overwrite the memory for the struct.

But I honestly didn’t know this was possible until I saw the Tuple struct in MEF a few days ago.

Maybe this is common knowledge, but if someone had told me that you could assign values to “this” in C# before I saw that, I would have slapped him.

//Roger
