---
slug: entity-framework-to-rest-efrest
title: "Entity Framework to REST – EfREST"
authors: [rogerjohansson]
tags: []
---
I’ve been doing a fair amout of rest API coding lately, and what struck me during this time was that it was horribly hard to actually create a clean custom REST API using .NET.  
Sure, there is WebApi and OData and alot of other stuff.  
Odata almost gets me where I want to be, but it does have it’s limitations.

<!-- truncate -->

I like to design my services according to the guidelines that <a href="http://stormpath.com" rel="nofollow">http://stormpath.com</a> has: [http://www.stormpath.com/blog/designing-rest-json-apis](http://www.stormpath.com/blog/designing-rest-json-apis)  
I really do like their approach to how services should be designed.

So I decided to give it a try if I could accomplish this kind of design using standard tools; WebApi and EF5:

The goal was to be able to:

1.  Select all data needed for a given resource in one go, a single database call.
2.  Transform my Entity Model to resources any way I want, not expose my entities directly to the world
3.  Include a resource path (href) for each resource.
4.  <span>Support ?fields=…  to select a subset of fields il the resource</span>
5.  Support ?expand=… to expand navigational properties in the resource
6.  Re-use select projections for multiple resources

1\) This is really important IMO, I’m not a big fan of ripple loading where a single entity fetch results in a ton of database calls.  
This can be accomplished using entity framework using projections (or .Include()).

```
var result = model.Users.Select (u => new {
        id = u.Id,
        name = u.Name,
        items = u.Items.Select (i => new {
          id = i.Id,
          name = i.Name,
        })
    }).ToList();
```

This would select users together with their “items” whatever that might be in a single go.  
And this is the way I normally use EF for selecting specific subsets of data.

2\) Transforming my data into resources is also something I find important. I do not want to expose entities straight off to the wire. I might have calculated properties and data from external resources included in my result.

Luckily, transformations can be solved the same way as the above example, using projections. so this approach solves both point 1) and 2).

3\) I don’t like to include Id’s as properties in my resources, I want to expose a “href” for the resource, ofcourse, this href may include the ID of the entity behind the resource, but the data exposed will be a href to where the actual resource can be found.

This makes it possible to get/post/put/delete directly to the href of the resource w/o manually building an URL from ID’s and strings in the client.

To solve this I like to do something along the lines of this:

```
var result = model.Users.Select (u => new {
        href = "/api/v1/users/" + u.Id,
        name = u.Name,
        items = u.Items.Select (i => new {
          href = "/api/v1/users/" + u.Id + "/items/" + i.Id,
          id = i.Id,
          name = i.Name,
        })
    }).ToList();
```

This is however not possible with Entity Framework.  
WHAT?!  
No, Entity Framework can’t translate the above code to SQL.  
You have to resort to SqlFunctions and weird casts to make it work. making the code unreadable.  
This could however be fixed with some Linq Expression Tree magic.  
I rolled my own ExpressionTreeVisitor and simply patched the above code into the code that EF needs in order to work.

4 and 5)  
Some clients may want to exclude certain fields in order to lower request times and memory consumption for e.g. mobile devices.  
This is somewhat tricky using Entity Framework since we are in a strongly typed environment here.  
How do you make a Linq request against an anonymous type return only a subset of what is specified in the query?  
<span>-More Linq expression magic and some Reflection.Emit, I rewrite the above query according to the ?fields/expand arguments passed into the service, selecting a new type which contains only those fields.</span>

6\) Re-use of projections in Entity Framework is a no-go, you simply can not do it more than at the base level.  
e.g.  
You can do var res = model.Users.Select(someProjectionExpression);  
But you can not do this for subqueries:

```
Expression<Func<Item,object>> itemProjection = i => new {
          id = i.Id,
          name = i.Name,
        };

Expression<Func<User,object>> userProjection = u => new {
        id = u.Id,
        name = u.Name,
        items = u.Items.Select (itemProjection)
    };
```

This will give a compile error if User.Items is of type ICollection of T since we are trying to pass an Expression.  
This was also solved using the ExpressionVisitor, I simply expand the Linq Expression in the Select call.

<span>Well..  that’s pretty much it, I have implemented the above features in a small framework called EfRest, which can be found here: </span><a href="https://github.com/rogeralsing/EfRest">https://github.com/rogeralsing/EfRest</a>

Here is a real world example using the framework in WebApi:

```
//projection for "Site" resource
public Expression<Func<Site, object>> SiteSelector()
{
    return s => new
    {
        href = sitesUrl + "/" + s.Id,
        name = s.Domain,
        sitemapUrl = s.SiteMapUrl,
        pages = new
        {
            href = sitesUrl + "/" + s.Id + "/pages",
            items = s
                    .WebPages
                    .ExpandSelect(PageSelector())
        }
    };
}

//projection for "Page" resource
public Expression<Func<WebPage, object>> PageSelector()
{
    return p => new
    {
        href = sitesUrl + "/" + p.Site.Id + "/pages/" + p.Id,
        fetchDate = p.FetchDate,
        statusCode = p.StatusCode,
        url = p.Url,
        botVisits = new
        {
            href = sitesUrl + "/" + p.Site.Id + "/pages/" + p.Id + "/botvisits",
            items = p
                .BotVisits
                .ExpandSelect(BotSelector())
        }
    };
}

//projection for "BotVisit" resource
public  Expression<Func<BotVisit, object>> BotSelector()
{
    return b => new
    {
        name = b.BotName,
        visitDate = b.VisitDate,
    };
}

[Authorize]
[HttpGet("api/v1/users/me/sites/{siteId}")]
public HttpResponseMessage MeSitesGet(int siteId, string fields = null,string expand = null)
{
    using (var model = new ModelContainer())
    {
        var res = model
            .Sites
            .AsResource(fields, expand) //apply what fields and expands to include
            .Where(s => s.UserId == WebSecurity.CurrentUserId && s.Id == siteId)
            .OrderBy(s => s.Domain)
            .ExpandSelect(SiteSelector()) //note ExpandSelect instead of Select
            .FirstOrDefault();

        return Request.CreateResponse(HttpStatusCode.OK, res);
    }
}
```

The above sample is used on our Javascript SEO tool [RankJS.com](http://www.RankJS.com "SEO Enable your javascript site")

Enjoy!
