---
slug: lazy-evaluation
title: "Lazy evaluation"
authors: [rogerjohansson]
tags: []
---
My Lisp now supports Lazy evaluation.

<!-- truncate -->

I’ve made it possible to define per function if it should use lazy or eager evaluation.  
(The next step will be to decide that through code analysis.)

For those who don’t know what lazy evaluation is about, the purpose of lazy evaluation is to avoiding unnecessary calculations.

Take the following example (in C#)

    public static void FooBar () 
    { 
      int res = GetSomeValue();         
      //pass the value to a logger 
      Logger.Log ("value of GetSomeValue was:" , res); 
    }          

    public static int GetSomeValue() 
    { 
     //some realy heavy algorithm here 
     ... heavy code ... 
     ... more heavy code ...   
     return res; 
    }           

    ... logger code ...           

    public void Log (string message,params object[] args) 
    { 
     //lets assume we can attach multiple providers to our logger 
     foreach (LogProvider provider in LogProviders) 
     { 
      provider.WriteString(message,args); 
     } 
    }

In this case, we would always need to execute “GetSomeValue” first in order to call our logger.  
EVEN if there is no provider attached to the logger.  
So, even if we don’t want to write anything to disc or DB or anywhere, we would still have to call “GetSomeValue”.

It is ofcourse possible to add special code to your consumer , “if (logger.Providers.Count == 0) then ignore…”.  
But that forces you to add responsibility to your code that isn’t supposed to be there.  
My FooBar method should not have to care about the number of log providers etc.

Lazy evaluation can solve this for us.  
By applying Lazy evaluation to “GetSomeValue” method, we would only need to call the method once the result of it is used.  
Sounds odd?  
How can you use the result before the code have executed?

It’s quite simple, its done through delegates, we can even do this in C# by passing delegates around.  
However, you do have to know that you are passing delegates and not simple values, so it is not very implicit in C#.

In My Lisp, the code would look something like this:

    (func FooBar () 
        ( 
            (= res (GetSomeValue)) 
            (call logger log "value of GetSomeValue was:" res)))     

    (lazy-func GetSomeValue () 
        ( 
             ... heavy code ... 
             ... more heavy code ... 
            (return res)))     

    ...logger...     

    (func Log (message data) 
        ( 
            (foreach provider Providers     

                ;;; GetSomeValue will be called here 
                (call provider WriteString message data))))

As you see, there is no special code to handle the lazy evaluation.  
The only thing that I need to do was define “GetSomeValue” as a lazy function.

So if we do not have any log providers attached to our logger, “GetSomeValue” will never be executed, since its result is never needed.

And if there are providers attached, “GetSomeValue” will be executed from within the foreach loop inside the logger.  
(Once, then caching its value)

Pretty slick IMO.
