---
slug: angularjs-directive-to-check-that-passwords-match-followup
title: "AngularJS directive to check that passwords match – Followup"
authors: [rogerjohansson]
tags: []
---
This is a follow up on [angularjs-directive-to-check-that-passwords-match](http://blog.brunoscopelliti.com/angularjs-directive-to-check-that-passwords-match) by Bruno Scopelliti.

<!-- truncate -->

I found Bruno’s blog a while back when I started reading about AngularJS.  
I started out by using the directive that is described in his blogpost but later dropped it in favor for a rewrite in “the Angular way”.

Bruno’s example relies on JQuery and DOM-event in order to do it’s magic, which does work fine, but for someone learning AngularJS it might not be the best example out there.  
So here is my take on the very same directive:

```javascript
app.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel); 

                //get the value of the other password  
                var e2 = scope.$eval(attrs.passwordMatch);
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both 
                //passwords are the same, else invalid
                control.$setValidity("unique", n);
            });
        }
    };
}]);
```

This works by comparing variables on the current scope instead of reading values from Input elements using JQuery.

Usage:

```html
<input type="password"  
     ng-model="password2" 
     password-match="password1" />
```

**Important!:**  
This directive will only set the form control to valid or invalid when the passwords match or mismatch.  
In order to show the errors in the form, do read up on form validation using AngularJS.  
e.g. from Bruno’s blog here: <a href="http://blog.brunoscopelliti.com/form-validation-the-angularjs-way" rel="nofollow">http://blog.brunoscopelliti.com/form-validation-the-angularjs-way</a>
