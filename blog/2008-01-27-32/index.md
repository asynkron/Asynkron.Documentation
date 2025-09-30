---
slug: 32
title: "Lisp weekend"
authors: [rogerjohansson]
tags: ["c-lambda", "domain-specific-languages", "lisp", "net"]
---
I’ve been reading up a bit on functional programming the last few week, the reason is just to comprehend the new features and possibilities in .NET 3.5 as much as possible.

<!-- truncate -->

Anyway, I got a bit carried away and started to read about Lisp, and decided to learn what it’s all about.  
So what better way to learn a language than to make your own parser for it is there? 😉

I started to hammer away on a simple parser, and once the parser was done, I couldn’t stop, so I began writing an engine too.  
So after a few hours of Aha moments, I finally got my very own Lisp(ish) code executor and a bit more understanding for the language. 😉

Well, enough blabbering, here are a few samples of whats currently possible in my still un-named language.

**Hello world:**

    (print 'Hello world!')

**Simple function and call:**

    (defun Mul (x y) 
     (* x y))       

    (print (Mul 2 3))

**Variables:**

    (let my-var 'hello lisp') 
    (let my-int 123) 
    (let my-double 123.456) 
    (let half-pi (/ pi 2)) 
    (let my-arr (arr 1 2 3 4 5 6 7))

**Loops:**

    (foreach item my-arr 
     (print item))      

    (for i 1 20 
     (print i))      

    (let i 0) 
    (while (< i 20) 
     ((print i) (++ i)))

**Lambdas:**

    (let my-lambda (lambda (x y) (* x y))) 
    (my-lambda 2 3)

**Delegates:**

    (let my-delegate Mul) // delegate to Mul 
    (let print other-print-func) //redirect the print function to "other-print-func"

**Objects:**

    (let form (new Form)) 
    (set form Text 'hello windows forms') 
    (let button (new Button)) 
    (set button Text 'my button') 
    (set-event button Click MyButtonClick) 
    (list-add (get form Controls) button) 
    (call form Show)

**List comprehensions:**

    (foreach item (select (lambda (concat 'transformed: ' item '!')) 
                  (where (lambda (> (get item Length) 3)) 
                  (list 'foo' 'bar' 'roger' '.net' 'lisp')))       

          (print item))

The next step will be to make it possible to define your own classes.  
Im thinking of emitting true .NET classes and let the methods redirect the calls to the engine.  
Thus making it possible to redefine the behaviour of a method in runtime.

That, and find some reason to use it 😛
