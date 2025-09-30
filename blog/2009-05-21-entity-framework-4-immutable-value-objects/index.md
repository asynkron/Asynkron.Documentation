---
slug: entity-framework-4-immutable-value-objects
title: "Entity Framework 4 – Immutable Value Objects"
authors: [rogerjohansson]
tags: []
---
Ok, the title is not quire accurate, I’m not aware of any way to accomplish truly immutable types for Entity Framework.

<!-- truncate -->

However, this is a quite nice attempt IMO:

```csharp
    public class Address
    {
        //Private setters to avoid external changes
        public string StreetName { get;private set; }
        public string City { get; private set; }
        public string ZipCode { get; private set; }

        //Provide a default ctor for EF4
        [Obsolete("For EF4 Only",true)]
        public Address() {}

        //Force values to be set via ctor.
        public Address(string streetName, string city, string zipCode)
        {
            StreetName = streetName;
            City = city;
            ZipCode = zipCode;
        }

        ...equality overrides and such...
    }
```

This works very well with Entity Framework 4 and I think it is a fair compromise.

//Roger
