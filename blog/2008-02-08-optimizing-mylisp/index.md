---
slug: optimizing-mylisp
title: "Optimizing MyLisp"
authors: [rogerjohansson]
tags: ["c", "l", "lisp", "mylisp", "optimizing"]
---
Today I stumbled across the weirdest thing.

<!-- truncate -->

I was comparing the performance of MyLisp to L# and MyLisp was terribly slow in comparison.  
(Running the exact same Fibonacci code)

So I checked the code of L# and they seem to do pretty much the same as I do, quite similar design and code.

The only thing I could find was that I evaluated the first arg twice when calling Add, Sub,Mul and Div.  
So I changed the code for those functions so that all args are evaluated only once.  
And suddenly the performance was increased by some 1000 times or so, things that took a bout a minute before now completes in less than 0.1 sec.  
I would get it if performance was increased about 2 times, but not like this.  
The only thing I can think of is that the original code did some bugged recursive evaluation of some sort.

Well, I’m happy about the performance gain, but a bit annoyed that I can’t find the reason why the old code was so much slower.

Updated source code (C# 3) can be downloaded at:  
[http://www.puzzleframework.com/roger/mylisp.zip](http://www.puzzleframework.com/roger/mylisp.zip)

**\[Edit. oh dear god I’m so stupid..\]**

Two minutes after I published this post I found the cause.  
I even wrote the reason in this post..  
I evaluated the first arg in Add, Sub, Mul, Div twice.  
And the Fib code looks like this:

    (= fibonacci (fn (n) 
       (if (< n 2) n 
          (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))) 
    ;;;         ^ problem is right there...

The first arg of the last Add call is a recursive call to itself..  
I feel so dumb now..  
Well I guess the best way to find the cause of a problem is to try to describe it for someone else. 

In this case it was pretty much like that IQ test where you should count the letter “F”‘s in an english text where most people don’t count the “F” in “of”.

I was only looking at the (- n 1) and (-n 2) parts of the code..  
Not seeing that I was also adding the result of recursive function calls.
