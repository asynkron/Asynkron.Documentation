---
slug: angularjs-and-seo-part-1
title: "AngularJS and SEO – Part 1 – Get your JS site indexed"
authors: [rogerjohansson]
tags: []
---
In this series we will go through a few steps on how to make your AngularJS site crawlable by google and other search engines.  
Note: This part does apply to Knockout, Backbone and other frameworks to.

<!-- truncate -->

First, there are a few misconceptions floating around on how this works, lets clear those out first:

> Google bot can run javascript and you don’t have to do anything in order to make your site crawlable!

<span>Yes, No or Maybe.  
</span><span>See: </span><a href="http://en.wikipedia.org/wiki/Googlebot">http://en.wikipedia.org/wiki/Googlebot<br />
</a>See: [http://searchengineland.com/google-can-now-execute-ajax-javascript-for-indexing-99518  
S](http://searchengineland.com/google-can-now-execute-ajax-javascript-for-indexing-99518)ee: [http://www.quora.com/Search-Engine-Optimization-SEO/How-do-search-engines-treat-websites-built-with-Angular-js](http://www.quora.com/Search-Engine-Optimization-SEO/How-do-search-engines-treat-websites-built-with-Angular-js)

The article about google beeing able to read FB and Discqus comments, this does not mean google bot can execute javascript, it could be that googlebot simply is hardcoded to handle FB and Discus comments in some special way.

For this series we can safely say that googlebot and bingbot does NOT execute AngularJS and you will have to deal with this manually

> HTML5 and Push state will make your site crawlable by google.

<span>NO, \_server side delivered content\_ will make your site crawlable, some push state based sites do generate their main content server side using PHP, ASP.NET or NodeJS and deliver the initial content that way.</span>

Thus, the content is available for googlebot to crawl.

The fact that there is push state and javascript involved on the client side is completely beside the point, server side content and URL’s that resolve is what matters.

Google and bingbot supports a technique or hack in order to make javascript driven sites crawlable.  
See [https://developers.google.com/webmasters/ajax-crawling/docs/specification](https://developers.google.com/webmasters/ajax-crawling/docs/specification)

If you use HashBang URLs. e.g. *mysite.com/#!/profile*  
The search bots can replace the hashbang with *?\_escaped_fragment\_=*  
Thus turning the above URL into an “Ugly URL” : mysite.com/?*\_escaped_fragment\_=/profile*

This way, your server can intercept the request and deliver a static snapshot of your dynamic content.  
You will have to add some code or configure your webserver in order to make this work. but it does work and that is what is important.

We (Wombit) have released a free service for this purpose.  
You can find it here: [http://www.RankJS.com](http://www.rankjs.com "SEO Enable your Javascript site")  
When used, it will use a virtual browser to read the dynamic content of your website and capture the DOM that has been generated.  
This result will then be returned to you from our servers.  
You can then either store this as static snapshots on your own server, or, simply return it to google bot directly upon request.

Lets see how this can be done (using ASP.NET MVC4)

```csharp
public ActionResult Index()
{
    string fragment = Request.QueryString["_escaped_fragment_"];

    //if the fragment is present
    if (fragment != null)
    {
        //build an url that should be scraped
        //this example assumes that you use hashbang #! url's
        string url = string.Format("http://{0}/%23!{1}", Request.Url.Authority ,fragment);

        var snapshotUrl = string.Format("http://crawlr.wombit.se/Crawler/htmlsnapshot?url={0}",url);
        //ask Wombit.Crawler for the dynamic content
        using (var client = new WebClient()) // WebClient class inherits IDisposable
        {
            var content = client.DownloadString(snapshotUrl);
            return Content(content);
        }
    }

    //return the view for our single page app
    return View();
}
```

This way, when google bot asks for an “ugly URL”, your server will return a HTML snapshot from the Crawlr service.  
And that is all you need in order to get your AngularJS/Knockout/Backbone/React site in the google and bing index.

That said, there are plenty of other things you need in order to rank well, but this will get you indexed.
