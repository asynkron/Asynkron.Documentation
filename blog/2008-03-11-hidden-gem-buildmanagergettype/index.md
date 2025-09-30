---
slug: hidden-gem-buildmanagergettype
title: 'Hidden gem: BuildManager.GetType'
authors:
- rogerjohansson
tags:
- asp-net
---
I’ve been digging through the ObjectDataSource today and I was trying to figure out how they created the datasource instance from the type name.

<!-- truncate -->

Now some clever reader might say “I know, I know, Type.GetType(string)”… But that’s wrong..  
Type.GetType(string) requires full type names with assembly name and the whole shebang.

The ObjectDataSource is able to create instances w/o all that information.  
So after a while of digging I found a precious gem, hidden in System.Configuration:  
“BuildManager.GetType(string)”

Very very nice 🙂

I can now inherit ObjectDataSource and fetch the type via buildmanager and then call NAspect to proxy the type and get an AOP enabled datasource.

Thats all for now, just wanted to share this one 🙂
