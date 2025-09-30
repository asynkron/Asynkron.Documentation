---
slug: building-a-document-db-ontop-of-sql-server
title: Building a Document DB on Top of SQL Server
authors:
- rogerjohansson
tags: []
---
I’ve started to build a Document DB emulator on top of SQL Server XML columns.
SQL Server XML columns can store schema-free XML documents, pretty much like RavenDB or MongoDB stores schema-free JSON/BSON documents.

<!-- truncate -->

XML columns can be indexed and queried using XPath queries.

So I decided to build an abstraction layer on top of this in order to achieve similar ease of use.
I’ve built a serializer/deserializer that deals with my own XML structure for documents (state + metadata) and also an early Linq provider for querying.

Executing the following code:

```csharp
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

```sql
select *

from documents

where CollectionName = 'Customer' and
   ((documentdata.exist('/object/state/Address/object/state/City/text()[. = "abc"]') = 1) and
    (documentdata.exist('/object/state/Name/text()[. = "Acme Inc5"]') = 1))

order by documentdata.value('((/object/state/Name)[1])','nvarchar(MAX)')
```

The result of the query will be returned to the client and then deserialized into the correct .NET type.
