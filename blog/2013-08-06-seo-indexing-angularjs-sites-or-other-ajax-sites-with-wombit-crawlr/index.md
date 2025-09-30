---
slug: seo-indexing-angularjs-sites-or-other-ajax-sites-with-wombit-crawlr
title: "SEO \u2013 Indexing AngularJS sites (or other ajax sites) with Wombit Crawlr"
authors:
- rogerjohansson
tags:
- ajax
- seo
---
Lately I have been diving deep into single page app development.  
One specific problem that I never knew about before was that it is a true pain to make ajax sites crawlable.

<!-- truncate -->

Someone might say that HTML5 with pushstate is the answer, but those are a special case, your server still have to generate all the indexable content for those.  
Dynamic client side content will still not be indexed.

So lets stick to pure client side apps for now.

In order to make such site crawlable, your server have to respond to a specific query from the bots.  
Google will convert any hashbang url into an “ugly” url.  
“strongur.com/#!/about” becomes “strongur.com/?\_escaped_fragment\_=/about”  
(see [https://developers.google.com/webmasters/ajax-crawling/docs/html-snapshot](https://developers.google.com/webmasters/ajax-crawling/docs/html-snapshot) for more details.)

So how are you supposed to deal with this?  
How could your server possibly respond with the same result as your client side generated page would do?

This is how we do it:

We have developed a snapshot service. <a href="http://crawlr.wombit.se" rel="nofollow">http://crawlr.wombit.se</a>  
This service will let you pass an url to it and get the dynamic content back as a snapshot.

In my site I do it like this, using MVC4:

```csharp
        public ActionResult Index()
        {
            string fragment = Request.QueryString["_escaped_fragment_"];
            if (fragment != null)
            {
                //note that # must be url encoded or it will not be passed to wombit crawlr
                string url = "http://www.strongur.com/%23!" + fragment;
                url = url.Replace("#", "%23");

                //ask crawlr for the dynamic content of the url
                var res = HttpUtil.Post(string
       .Format("http://crawlr.wombit.se/Crawler/htmlsnapshot?url=" + url));

                //return the result to the client
                return Content(res);
            }

            //request is not a bot request, return the single page app view
            return View();
        }
```

If the request is a bot request using escapded fragment, I ask Crawlr.wombit.se for the dynamic content of this page and return this to the client (the bot).  
If the request is a normal request, then I simply return my single page view (e.g. index.html)

Thats it, now your site is crawlable by both google and bing.

The url you need to post/get is <a href="http://crawlr.wombit.se/Crawler/htmlsnapshot?url=http://yoururlhere" rel="nofollow">http://crawlr.wombit.se/Crawler/htmlsnapshot?url=http://yoururlhere</a>

HTH  
//Roger
