---
slug: robus-xml-serialization
title: "Robust XML Serialization"
authors: [rogerjohansson]
tags: ["deserialization", "deserializer", "generics", "serialization", "serializer", "soap", "xml"]
---
OK, I’ve had it with the serializers in .NET.  
All of them are lacking atleast some features that I need.

<!-- truncate -->

XML serializer can not handle circular references.  
Soap serializer can not handle generics.  
Binary serializer is decent but will crash and burn if your class schema change (this applies to all the others to).

And then we have all those WCF thingies, but they require contracts/interfaces.

So I got tired of this mess and I’ve finally rolled my own XML serializer.

**My serialzier supports:**

- Circular references
- Generic lists
- Error resolution
- Clean XML format 

The error resolution works by raising events so that the developer can either ignore errors or resolve fields and types himself.

I have also added a default resolver that will handles missing “backing fields”

I’m using this serializer in Caramel Studio for the save file format.  
So even if the model for my Caramel classes changes, you will still be able to load the files and you will only lose some settings.

The serializer is now part of my Alsing.Core project that can be found in the SVN repository at my google code site:  
[http://code.google.com/p/alsing](http://code.google.com/p/alsing)

**So what’s NOT supported then?**

Currently lists will be treated in a special way, so only content of lists is serialized, any other custom state in a list will not be serialized.  
I will add support for this later.

Multi dimentional arrays are not supported yet.

**Work in progress:**

I will make it possible to substitute types on serialization and deserialization, so that you can serialize graphs of proxy objects and then deserialize the same graph again by letting your proxy factory create the instances for you.

//Roger
