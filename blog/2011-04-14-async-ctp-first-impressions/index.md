---
slug: async-ctp-first-impressions
title: "Async CTP first impressions"
authors: [rogerjohansson]
tags: []
---
This is just my first observations. nothing fancy..

<!-- truncate -->

I’ve just installed the new Async CTP (for C# 5 async features)  
The SP1 Refresh can be found here: [http://msdn.microsoft.com/sv-se/vstudio/async/](http://msdn.microsoft.com/sv-se/vstudio/async/)

The new async and await features makes async programming so much sweeter, it lets you write async code in a sequential manner.  
e.g.

```
static async void ShowGoogleHtmlCode()
{
  WebClient client = new WebClient();
   var result = await client.DownloadStringTaskAsync("http://www.google.com");
   Console.WriteLine(result);
}
```

This code looks sequential, but the code will return/yield back to the caller when it hits the “await” keyword.  
Once the expression after “await” completes, the code will continue to run.

So far so good.  
However, there are some design considerations.

Consider this:

```
public async void SetupUi()
{
  var blogService = new BlogServiceClient();
     var categories = await blogService.GetCategories();
  var latestPosts = away blogService.GetLatestPosts();

     this.Categories.DataSource = categories;
     this.Posts.DataSource = latestPosts;
}
```

This code will call GetCategories and GetLatestPosts at the same time and then wait for \_both\_ of them to complete before continuing to fill the GUI elements.  
If you are doing a Silverlight app, then you probably want to display each GUI element as soon as possible, and thus, the above code could be rewritten to:

```
public async void SetupUi()
{
  SetupCategories();
  SetupPosts();
}

public async void SetupCategories()
{
  var blogService = new BlogServiceClient();
     var categories = await blogService.GetCategories();
     this.Categories.DataSource = categories;
}

public async void SetupPosts()
{
  var blogService = new BlogServiceClient();
  var latestPosts = away blogService.GetLatestPosts();
     this.Posts.DataSource = latestPosts;
}
```

This way, the async calls will be independent of each other and fill the corresponding GUI element once the data it needs has been fetched.

Also, if you were to write the first code in this way:

```
public async void SetupUi()
{
  var blogService = new BlogServiceClient();
     var categories = await blogService.GetCategories();
     this.Categories.DataSource = categories;

  var latestPosts = away blogService.GetLatestPosts();
     this.Posts.DataSource = latestPosts;
}
```

In this case, the call to GetCategories would be invoked, and the code waits for it to complete.  
Once the categories have been fetched, the GUI element is filled and \_then\_ the call to GetLatestPost() would be invoked.  
Thus, the async calls would not execute at the same time and the time span for the SetupUI to complete would be the same as if all of it were sync code.

Thats all for now..
