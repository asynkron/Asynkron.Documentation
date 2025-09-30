---
slug: angularjs-and-seo-part-2
title: "AngularJS and SEO – Part 2 – Title and meta description"
authors: [rogerjohansson]
tags: []
---
This is a follow up on [AngularJS and SEO – Part 1](http://rogeralsing.com/2013/08/11/angularjs-and-seo-part-1/ "AngularJS and SEO – Part 1")

<!-- truncate -->

Getting your site in the Google and Bing index may be the most important step but you still need to optimize your content for searchability.

e.g. you will have to deal with title tags and meta description for each page in order to rank well.  
There is nothing built in for AngularJS to deal with this, so we had to roll our own directives for this.

We do use TypeScript, but you can easily convert this to plain javascript.

```typescript
module directives {
    class ViewTitleDirective implements ng.IDirective {
        restrict = 'E';
        link($scope, element: JQuery) {
            var text = element.text();
            element.remove();
            $('html head title').text(text);
        }
    }

    class ViewDescriptionDirective implements ng.IDirective {
        restrict = 'E';
        link(scope, element) {
            var text = element.text();
            element.remove();
            $('html head meta[name=description]').attr("content", text);
        }
    }

    app.directive('viewTitle', () => new ViewTitleDirective());
    app.directive('viewDescription', () => new ViewDescriptionDirective());
}
```

And to use this you simply place a view-title inside one of your view templates, like so:

```html
<view-title>Some page title</view-title>
<view-description>Some page description</view-description>
.. the rest of your ng-view template here
```

By doing this, you not only set a nice title for your single page app, but you also make the title and description indexed if you use the service in part 1, because the service will capture the dynamic DOM containing the new title and meta description.

HTH
