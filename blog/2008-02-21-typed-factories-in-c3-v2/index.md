---
slug: typed-factories-in-c3-v2
title: "Typed factories in C#3 – V2"
authors: [rogerjohansson]
tags: []
---
This is a follow up on my previous post: [http://rogeralsing.com/2008/02/21/typed-factories-in-c3-managed-new/](http://rogeralsing.com/2008/02/21/typed-factories-in-c3-managed-new/)

<!-- truncate -->

 I’ve added support for property and field initializers.  
This makes it possible to call your factory like this:

    Person person = MyFactory.Create(() => new Person("Roger", "Alsing") { 
        Age = 32, 
        SomeIntField = 4, 
        SomeIntArray = new int[]{1,2,3} 
    });

You can find the code for the improved factory class here:  
[templatedfactorycs.txt](http://rogeralsing.wordpress.com/wp-content/uploads/2008/02/templatedfactorycs.txt "templatedfactorycs.txt")   (WordPress don’t like .cs files)

Enjoy..
