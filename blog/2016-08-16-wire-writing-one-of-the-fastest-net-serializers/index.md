---
slug: wire-writing-one-of-the-fastest-net-serializers
title: "Wire – Writing one of the fastest .NET serializers"
authors: [rogerjohansson]
tags: []
---
…  
First of all, there is no such thing as ***“the fastest”*** serializer, it is all contextual.  
But under some conditions, I would however argue that Wire is, by far, the fastest of all the .NET serializers out there.

<!-- truncate -->

Given the following POCO type.

<div class="wp-block-syntaxhighlighter-code">

```
public class Poco
{
   public string StringProp { get; set; }
   public int IntProp { get; set; }
   public Guid GuidProp { get; set; }
   public DateTime DateProp { get; set; }
}
```

</div>

Round tripping *one million objects* of this type, that is, serializing and then deserializing a million objects using **Wire** with all optimizations on, completes in about *550 milliseconds* on my personal laptop.

Doing the same using **MS Bond**, which is the second fastest serializer in the benchmark, takes about *830 milliseconds*, and this is while being very generous to Bond as it has some very specific prerequisites.  
**Protobuf.NET** which is the third serializer on this benchmark completes in about *1360 milliseconds*.

Other serializers that was included in the same benchmark was **Jil**, **NetSerializer**, **FS Pickler**, **Json.NET** and .NET **BinaryFormatter**.

**Just to clarify; this is very selective benchmarking, the old *Lies, damned lies, and statistics* and all that.**  
**Running the same benchmark with smaller types, e.g. a POCO with only one or two properties favors Jil and NetSerializer a lot, NetSerializer beats Wire under those conditions.**

**I would also imagine that running benchmarks with a lot bigger types might favor e.g. Protobuf.NET as it does some clever byte buffer pooling.**

Wire was originally built as a replacement for the Json.NET based serializer we use in Akka.NET.  
Akka.NET is a concurrency and distributed computing framework based on messaging.

As such, the requirements we had for this was that it should support polymorphic types, it should support *“surrogate”* types, it should support the plethora of standard types we have in the .NET ecosystem, such as immutable collections, F# Discriminated Unions and so on, all of the things that had been bugging us with Json.NET.  
Note: there is nothing wrong with Json.NET, it is a fantastic serializer, it is just not the right choice for Akka.NET.

Messages in Akka.NET is typically quite small, thus the shape of the POCO used in the benchmark above, it is fairly representative of a message.

**This post is not intended to show how fast and fancy Wire is, but rather about some of the lessons learned while building and optimizing it.**

When I stared to build Wire, speed was not my main concern, I just wanted it to be *“fast enough”*, the main concerns was the above mentioned requirements.

Having never built a serializer before, I did not know much about the topic.  
I had a rough idea how I wanted to go about this, I knew I needed to preserve type information, even for primitives in some cases, e.g. if you serialize an array of `object` containing different primitives, which is exactly what we do for Actor constructor arguments in Akka.NET remote deployment.

It was also fairly obvious that it would be inefficient to write the entire type name for every such occurrence.

Therefore I introduced the idea of a `ValueSerialize`, this is a type that can serialize and deserialize the content of a given type, be it a complex or a primitive type.

## Looking up value serializers by type

The very early attempts contained a concurrent dictionary of vale serializers, so that the serializer could check whatever value was about to be serialized or deserialized and then look up the correct value serializer.

This worked, but doing dictionary lookups is fairly costly, so this is where I first started to introduce some optimizations.

Instead of having code like:

<div class="wp-block-syntaxhighlighter-code">

```
public ValueSerializer GetSerializerByType(Type type)
{
  ValueSerializer serializer;

  if (_serializers.TryGetValue(type, out serializer))
    return serializer;

  //more code to build custom type serializers.. ignore for now.
}
```

</div>

I turned the code into something like:

<div class="wp-block-syntaxhighlighter-code">

```
public ValueSerializer GetSerializerByType(Type type)
{
  if (type == typeof(string))
    return StringSerializer.Instance;

  if (type == typeof(Int32))
    return Int32Serializer.Instance;

  if (type == typeof(Int64))
    return Int64Serializer.Instance;
  ....
```

</div>

This was a faster for primitives, no hashing or lookup needed, only reference checking.  
But, there is one call in there for each comparison, can you spot it?

Calls to `typeof()` actually generates a bit of IL code:

<div class="wp-block-syntaxhighlighter-code">

```
ldtoken      [mscorlib]System.String
call         class [mscorlib]System.Type [mscorlib]System.Type::GetTypeFromHandle(valuetype [mscorlib]System.RuntimeTypeHandle)
```

</div>

We can prevent these extra calls per type simply by storing references to each primitive in advance:

<div class="wp-block-syntaxhighlighter-code">

```
public ValueSerializer GetSerializerByType(Type type)
{
  if (ReferenceEquals(type.GetTypeInfo().Assembly, ReflectionEx.CoreAssembly))
  {
    if (type == TypeEx.StringType) //we simply keep a reference to each primitive type
      return StringSerializer.Instance;

    if (type == TypeEx.Int32Type)
      return Int32Serializer.Instance;

    if (type == TypeEx.Int64Type)
      return Int64Serializer.Instance;
```

</div>

Another optimization that was introduced here was to only do these primitive lookups, if the type we want to lookup belongs to the the System.Core assembly.

This prevents unnecessary comparisons for any user defined type.

Once we had this, we could do fast serializer lookups for primitive types.  
**The conclusion from this part was to never assume the cost of anything, always profile, always decompile.**

## Looking up types when deserializing

Another issue that bit me big time early on, was to lookup types via. fully qualified names during deserialization.

If we want to deserialize a complex type, we first need to:

1.  Read the length of the type name
2.  Read an UTF8 encoded byte array containing the type name
3.  Translate the byte array to a string
4.  Lookup the type with this name
5.  Then finally lookup the value serializer for this type.

It turns out that looking up types through their name was really slow, e.g. `Type.GetType(name)`.  
Another thing that is horribly slow is to translate strings to and from UTF8 encoded byte arrays.

To avoid both of these issues together, I introduced the idea of an `ByteArrayKey`, a struct that contains a byte array with a pre-computed hash code.

This way, we can have a concurrent dictionary from `ByteArrayKey` to `Type` for fast lookups.  
So instead of doing step 3 and 4, I could simply take the byte array and lookup the type directly.

The only time we need to execute 3 and 4 is when we get a cache miss, if the type have not been used before. This is a one time operation per type and process.

This had some really nice effect on the deserialization performance. and I’m pretty sure most other serializers do not do this trick yet.

## Byte buffers, allocations and GC

In the very early code of Wire, I simply ignored how many allocations were made. was there a need for writing data into a buffer, I allocated the buffer in place and used it.

For example, when deserializing a string, the code looked something like:

<div class="wp-block-syntaxhighlighter-code">

```
//StringValueSerializer.cs
public override object ReadValue(Stream stream)
{
    var length = stream.ReadInt();
    var buffer = new byte[length];  //allocate a new buffer
    stream.Read(buffer,0,length);
    return Encoding.Utf8.GetString(buffer);
}
```

</div>

The above might be a bit pseudo but you get the gist of it.  
This is clearly inefficient, it will take time to allocate new buffers and it will hit the GC hard if we have a lot of unused byte arrays floating around.

To solve this issue, I introduced the concept of *“Sessions”*, there is a `SerializerSession` and a `DeserializerSession`.

In the beginning, only the deserializer session contained code to deal with buffer recycling.  
This allowed us to do something like this:

<div class="wp-block-syntaxhighlighter-code">

```
//StringValueSerializer.cs
public override object ReadValue(Stream stream, DeserializerSession session)
{
   //length of the string in bytes
   var length = stream.ReadInt();
   //fetch a preallocated buffer
   var buffer = session.GetBuffer(length);  
   return Encoding.Utf8.GetString(buffer);
}
```

</div>

The session contains a small pre-allocated buffer, which can be re-used whenever a buffer is needed.  
If a buffer with a larger size than the existing is requested, only then the buffer was re-allocated.

This saves us a lot of allocations and execution time overhead.

Recently, Szymon Kulec (<a href="http://blog.scooletz.com" rel="nofollow">http://blog.scooletz.com</a>, <a href="https://twitter.com/Scooletz" rel="nofollow">https://twitter.com/Scooletz</a>), part of the Particular Software team, started contributing to Wire.

He has added some truly awesome optimizations to Wire.  
One of the things that he did was to introduce the same buffer concept for serializer sessions.

So when data is being written to a stream, we can now use the same trick.  
He created an allocation free bitconverter, much like the built in `BitConverter` but instead writing bytes into an existing array.

This allowed us to go from code that looked like this:

<div class="wp-block-syntaxhighlighter-code">

```
//Int64ValueSerializer.cs
public override void WriteValue(Stream stream, object value)
{
     long l = (long)value;
     var bytes = BitConverter.GetBytes(l) //this allocates a new byte array every time
     stream.Write(bytes,0,bytes.length)
}
```

</div>

To something like this:

<div class="wp-block-syntaxhighlighter-code">

```
//Int64ValueSerializer.cs
public override void WriteValue(Stream stream, object value, SerializerSession session)
{
     const size = 8;
     long l = (long)value;
     var buffer = session.GetBuffer(size); //fetch a preallocated buffer
     NoBitConverter.GetBytes(l, buffer)    //write the Int64 to the buffer
     stream.Write(bytes,0,size)
}
```

</div>

This way, we eliminate the same allocation and execution time overhead for allocating buffers when serializing.

There are some interesting tradeoffs here also.

### Buffer recycling

In Protobuf.NET, Marc Gravell uses a BufferPool, which contains a lock free pool of byte arrays.  
These arrays are fairly large, IIRC they are 1024 bytes, and they can be recycled, so once you are done with one of them, you can release it back to the pool.

This is obviously good if you need large buffers as you avoid allocations and execution time overhead from creating them.

It is fairly easy to use those from within Wire and make the session types use the same BufferPool type, I have tried this myself.  
However, it turns out that just by touching the `Interlocked` members that are used inside the buffer pool, this hurts our performance in Wire for the kind of objects we aim to optimize for.

Therefore, we do not do this. we instead allocate a small byte array for each call to Serialize or Deserialize and resize if needed.

## Clever allocations

The session types contains different types of lookups, e.g. there are lookups from identifier to object, from identifier to type, from type to identifier and so forth. things that the different sessions need to keep track of while serializing or deserializing.

One such lookup that is being hammered pretty hard during serialization is for checking if we need to output the type manifest for the object that is about to be written.

The type manifest should only be written once per session and then it should instead output an identifier to the already written manifest.

This was originally done using a `Dictionary`.

There are two things going on here, first we need to allocate this dictionary object for each session, as it keeps track of types per session, and we need to perform lookups against it.

Both of those operations are a bit costly, and most messages that we want to serialize are simple POCO’s with a few primitive properties only.

Do we really need to allocate and use this dictionary even if there only will be a single type in it most of the times?

No, we can simply cheat and allocate it later.  
Like this:

<div class="wp-block-syntaxhighlighter-code">

```
public class FastTypeUShortDictionary
{
  private int _length; //this keeps track on how many types have been added
  private Type _firstType; //at first, just just set this member field
  private Dictionary<Type, ushort> _all; //this is only allocated once there are two types
```

</div>

The lookup will have 0 to n entries.  
When there are 0 entries, we know there is nothing in it, so there are no allocations and any lookup will just return directly.  
When there is 1 entry, the `_firstType` is set, so any lookup just compares the lookup type with the `_firstType` field.. still no allocations or hash lookups.  
Only once we add a second type to the lookup, we will fallback and allocate the dictionary.

This save us a lot of allocations and heavy hashing lookups as most types are just a single user type and a few primitives.

## Boxing, Unboxing and Virtual calls

As you might have seen already, the interface of the `ValueSerializer` type contains methods like `abstract object Read(...)` and `abstract void Write(..., object value,...)`

This causes boxing to occur for any value type being written or read.  
I was skeptical that there would be any good solution to this due to the shape of the value serializer type that I defined very early on in the project.

Szymon however figured out that as we already do code generation for complex types, we could just as well let the value serializer join the code generation process.

He introduced the idea of `EmitWriter` and `EmitReader` into the value serializer.  
This allows us to have typed implementations for each primitive and let the value serializer hook into the code generation process to inject the correct code to read and write the primitive, without calling any virtual method and without boxing.

We let the value serializer emit its code using an `ICompiler` abstraction, like so:

<div class="wp-block-syntaxhighlighter-code">

```
public sealed override void EmitWriteValue(ICompiler<ObjectWriter> c, int stream, int fieldValue, int session)
{
    var byteArray = c.GetVariable<byte[]>;(DefaultCodeGenerator.PreallocatedByteBuffer);
    c.EmitStaticCall(_write, stream, fieldValue, byteArray);
}
```

</div>

## Fast creation of empty objects

Wire relies on the old `FormatterServices.GetUninitializedObject(type)` in order to create empty instances of objects, this is because all types do not have a default constructor, and, we can’t know if the constructor has side effects or not.

But it turns out that calling a constructor is actually faster, the problem is that we need to know if it has side-effects or not.

You can however extract this information:

<div class="wp-block-syntaxhighlighter-code">

```
var defaultCtor = type.GetTypeInfo().GetConstructor(new Type[] {});
var il = defaultCtor?.GetMethodBody()?.GetILAsByteArray();
var sideEffectFreeCtor = il != null && il.Length <= 8; //this is the size of an empty ctor
if (sideEffectFreeCtor)
```

</div>

By extracting the constructor method body as IL byte code, and then just checking if it is 8 bytes (or less) then we know it is an empty constructor, and thus side effect free.

There are of-course a lot of other optimizations and interesting things going on in Wire, but at least this post give some insight into what and how we solved the main issues we experienced while building it.
