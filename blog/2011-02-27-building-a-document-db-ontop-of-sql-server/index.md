---
slug: building-a-document-db-ontop-of-sql-server
title: "Building a Document DB ontop of Sql Server"
authors: [rogerjohansson]
tags: ["documentdb", "mongodb", "ravendb", "xml-columns"]
---
I’ve started to build a Document DB emulator ontop of Sql Server XML columns.  
Sql Server XML columns can store schema free xml documents, pretty much like RavenDB or MongoDB stores schema free Json/Bson documents.

<!-- truncate -->

XML Columns can be indexed and queried using XPath queries.

So I decided to build an abstraction layer ontop of this in order to achieve similair ease of use.  
I’ve built a serializer/deserializer that deals with my own XML structure for documents (state + metadata) and also an early Linq provider for querying.

Executing the following code:

```
var ctx = new DocumentContext("main");
var customers = ctx.GetCollection<Customer>().AsQueryable();

var query = from customer in customers
            where customer.Address.City == "abc" && customer.Name == "Acme Inc5"
            orderby customer.Name
            select customer;

var result = query.ToList();
foreach (var item in result)
{
    Console.WriteLine(item.Name);
    Console.WriteLine(item.Address.City);
}
```

Will yield the following SQL + XPath query:

```
select *

from documents

where CollectionName = 'Customer' and
   ((documentdata.exist('/object/state/Address/object/state/City/text()[. = "abc"]') = 1) and
    (documentdata.exist('/object/state/Name/text()[. = "Acme Inc5"]') = 1))

order by documentdata.value('((/object/state/Name)[1])','nvarchar(MAX)')
```

The result of the query will be returned to the client and then deserialized into the correct .NET type.
