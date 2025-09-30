---
slug: lisp-operators
title: "Lisp operators"
authors: [rogerjohansson]
tags: []
---
I just got home from a conference with my new job, a little bit tipsy and couldn’t sleep.  
So I decided to add some new features to my Lisp clone.

<!-- truncate -->

I’ve made it possible to set operator priority for functions.  
Eg.

    (operator-priority + 1) 
    (operator-priority - 1) 
    (operator-priority * 2) 
    (operator-priority / 2)

This will make the engine scan every list that does not start with a function for operators.  
The engine will enter a loop that search for the operator with the highest priority and replace the operator together with the left and right argument with a new list where the operator is the first arg (a function call).  
The process will be repeated untill no operators are found.

So a statement like:

    (let a ((1 + 10) * 3 / 5 - 1))

Will be turned into:

    (let a (-(/(*(+ 1 10) 3) 5) 1))

Which is a normal Lisp expression that can be evaluated.

Well, thats it for now, I’d better get some sleep now.

 \[Edit\]

**Update:**

Ok, I’ve decided to change this a little bit.  
The syntax will be:

    (# 1 + 2 * 3 / 4)

And \# will be a function that takes the rest of the formula as args.  
Thus, not breaking any Lisp rules or syntax.

Remeber kids,  
Don’t drink and develop…
