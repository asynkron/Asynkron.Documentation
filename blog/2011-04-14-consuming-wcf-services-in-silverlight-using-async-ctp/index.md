---
slug: consuming-wcf-services-in-silverlight-using-async-ctp
title: "Consuming WCF services in Silverlight using Async CTP"
authors: [rogerjohansson]
tags: []
---
Here is a small sample of how you can consume WCF services using the new Async CTP features.

<!-- truncate -->

**Example, filling a listbox with categories of some sort.**

```csharp
private async void FillCategories()
{
    var client = new MyServiceReference.MyServiceClient();
    //yield untill all categories have been fetched.
    var categories = await client.GetCategoriesTaskAsync();
    categoriesListBox.DataContext = categories;
}

..elsewhere..

//this extension makes it possible to get a Task of T back from our service client
public static class MyServiceClientExtensions
{
    public static Task<IList<Category>> 
                GetCategoriesTaskAsync(this MyServiceClient client)
    {
        var taskCompletion = new TaskCompletionSource<IList<Category>>();
        client.GetCategoriesCompleted += (s, e) =>
                {
                    if (e.Error != null)
                        taskCompletion.TrySetException(e.Error);
                    else
                        taskCompletion.TrySetResult(e.Result);
                };
        client.GetCategoriesAsync();

        return taskCompletion.Task;
    }  
}
```
