---
slug: query-objects-vs-dsl
title: Query Objects vs. DSL
authors:
- rogerjohansson
tags:
- domain-specific-languages
---
<span> **THIS IS AN OLD POST FROM MY OLD BLOG**</span> (2006)

<!-- truncate -->

 Most O/R Mappers today support some sort of Query Objects.  
Query Objects are often some sort of semi fluent combination of objects and methods where you can build a query.  
   
Query objects also seem to be the preferred way to build queries in code because they are “Typed”.  
Being “Typed” comes with two major benefits, you get intellisense (to some extent) and you get compiler warnings if you do something way too funky with your query.  
   
When Mats Helander started to build NPersist, he went for a DSL approach instead of QO’s and invented NPath which object query language similar to SQL in syntax.  
   
So why go for an untyped DSL instead of typed QO?  
   
Well, one thing that QO’s does not do is to verify your logic, you need unit tests for that.  
And once you’ve got unit tests, the benefit of being strictly typed is reduced because with unit tests you can clearly see if your untyped code does work or not.  
   
QO’s still got the benefit of intellisense,  
But let’s look at the readability of two queries:  
   
(the queries come from : <u>[http://www.mygenerationsoftware.com/phpbb2/viewtopic.php?t=107](http://www.mygenerationsoftware.com/phpbb2/viewtopic.php?t=107)</u>)  
   
**SQL:**

    SELECT * FROM Employees 
    WHERE LastName LIKE 'A%' AND LastName IS NOT NULL OR 
    ( City LIKE 'Ind%' OR HireDate BETWEEN '1/1/95' AND '4/4/04' )

\[edit: added npath sample\]

**NPath:**

    SELECT * FROM Employee 
    WHERE LastName LIKE 'A%' AND LastName != NULL OR 
    ( City LIKE 'Ind%' OR HireDate BETWEEN #1/1/95# AND #4/4/04# )

NOTE: npath specifies classes and properties , not tables and fields  
See: \*\*\* Missing Page \*\*\* : Old blog is gone  
\[/edit\]  
 

**dOOdas ORM:**

    Dim emps As Employees = New Employees 
    emps.Where.LastName.Value = "A%" 
    emps.Where.LastName.Operator = WhereParameter.Operand.Like 
    Dim wp As WhereParameter = emps.Where.TearOff.LastName 
    wp.Operator = WhereParameter.Operand.IsNotNull 
    emps.Query.AddConjunction WhereParameter.Conj.Or 
    emps.Query.OpenParenthesis() 
    emps.Where.City.Conjuction = WhereParameter.Conj.And 
    emps.Where.City.Value = "Ind%" 
    emps.Where.City.Operator = WhereParameter.Operand.Like 
    emps.Where.HireDate.Conjuction = WhereParameter.Conj.Or 
    emps.Where.HireDate.Operator = WhereParameter.Operand.Between 
    emps.Where.HireDate.BetweenBeginValue = "1/1/95" 
    emps.Where.HireDate.BetweenEndValue = "4/4/04" 
    emps.Query.CloseParenthesis()

Are QO’s really sane?  
If the whole purpose of an O/R Mapper is to reduce code and enable RAD, shouldn’t it be easier to query your DB?  
I was a LLBL gen pro user a few years ago and loved most parts of it, but I just couldn’t stand the QO’s.  
Just making a query with a few conditions and some sorting would generate queries similar to the one above.  
Even if Frans has excellent documentation and the classes got intellisense and all, I still had to spend way too much time  
just to make a simple query that should take a few seconds to write.  
(I have to add that I haven’t looked at LLBL Gen since and Frans might have altered the API or added some DSL, I’m just stating what I experienced with it about 2 years ago.  
my arguments are also targeted against QO’s in general, not only the ones in LLBL Gen)

Later on I got in contact with Mats and saw NPath for the first time, and I loved it, NPath is the \#1 reason I teamed up with Mats and started co-develop NPersist.  
With NPath I can write queries that are similar to SQL but instead of targeting your DB schema you target your domain classes and properties, and instead of creating joins you just traverse property paths.

So even if NPath is untyped I still find it way more productive than any QO’s and I get a smaller code base which is easy to read and since I do unit tests I can verify that my untyped queries does work as intended.  
It would be very interesting to hear other opinions on this topic and why QO’s still is the most common way to make queries in O/R Mappers?  
Is it because of the intellisense?  
or because most people don’t do unit tests?  
or just because it looks cool with some huge object graph?  
or because most O/R vendors don’t know how to make a decent parser?

Fire away! 🙂

\[edit\]  
Just added this sample incase anyone is interested in NPath and in mem querying:  
[http://web.archive.org/web/20070103130842/http://blogs.wdevs.com/phirephly/archive/2006/02/03/12096.aspx](http://web.archive.org/web/20070103130842/http://blogs.wdevs.com/phirephly/archive/2006/02/03/12096.aspx)  
\[/edit\]
