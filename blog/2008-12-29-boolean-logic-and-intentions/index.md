---
slug: boolean-logic-and-intentions
title: "Boolean logic and intentions"
authors: [rogerjohansson]
tags: []
---
Boolean logic

<!-- truncate -->

I’ve seen quite a few blog and forum posts about how developers “abuse” boolean logic.  
The most common of these examples would probably be something like:

```
bool userIsAuthenticated = Foo || Bar;
if (userIsAuthenticated)
{
   return true;
}
else
{
   return false;
}
```

And people are arguing about how bad that is and that it can be shortened down to:

```
bool userIsAuthenticated = Foo || Bar;
return userIsAuthenticated;
```

And then the next guy comes along and says it can be shortened down even more to:

```
return Foo || Bar;
```

And the general consensus is that the developer who wrote the first piece of code don’t know how boolean logic works and should be fired etc, the standard internet forum user attitude.

I personally find this somewhat strange, because I don’t think the first version is that bad.  
Sure, it is bloated and much bigger, but is that all that counts?

I’m not into the “less is more” mindset, I’m well aware that allot of code can be shrunken into short incomprehensible nested and recursive expressions.

I don’t want “small” code, I want readable code that clearly communicates the intentions of the developer.

I find the first version very explicit, it tells the reader the exact intentions of the developer.  
You can easily add comments to that kind of structure.  
And you can also set breakpoints on the two return clauses, making life easier while debugging.

Don’t get me wrong, I would most likely go for the 2nd version in most cases;  
Do the assignment on one line and then return that result.  
But in some special scenarios I might go for the first version, simply because it communicates the intentions better.

The first version also opens up ways for us to add alternative flows.  
e.g. Special logging messages when the result is true.

And I have to say that the same goes for:

```
if ( Foo == false )
```

It might be bloated, but the intention is very clear here.  
The code could be shorter, but it isn’t, just because I want you to see my intentions.  
So, Am I crazy?  
Or do you also think that verbose code sometimes express the intentions better?
