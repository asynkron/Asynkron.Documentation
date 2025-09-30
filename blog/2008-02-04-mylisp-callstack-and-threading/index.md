---
slug: mylisp-callstack-and-threading
title: "MyLisp: Callstack and threading"
authors: [rogerjohansson]
tags: []
---
I’ve added multi threading support to MyLisp today.

<!-- truncate -->

The earlier implementation of the callstack was not up to the task, so I had to rewrite it completely.  
The new callstack is based on stack frames which can hold local symbols.

So behold! 🙂 , the first multi threaded application in MyLisp

    (func FooBar () 
      ( 
        (let i 0 
          (for i 0 1000000 
            (print (format "thread {0}" i)))))) 

    (= thread (new-thread FooBar)) 
    (call thread Start) 
    (for i 0 1000000 
      (print (format "main {0}" i)))

Sure , the “new-thread” function is a bit of cheating, I dont have any generic code for .NET delegate \<-\> MyLisp delegate yet.  
So I have to use hard coded methods to cast from and to delegates for now.

OK, this was not much of a real post, more of a *“yay, it works!”* shout 🙂
