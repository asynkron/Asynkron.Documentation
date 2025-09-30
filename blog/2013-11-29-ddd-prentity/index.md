---
slug: ddd-prentity
title: "DDD \u2013 Prentity?"
authors:
- rogerjohansson
tags:
- cqrs
---
This post is actually a question:

<!-- truncate -->

Is there any word for an entity/object that not yet have any value to the domain at hand?  
e.g. an entity like a document that can be edited until some point in time where it gets processed and the result is then used in some domain action.

Lets say I download a job application in PDF format and save on my computer, I can edit the data in the application over and over and re-save and the state changes/transitions are not interesting to anyone.  
The objects state only become interesting once it enters the domain it belongs to.

Another example could be a shopping cart, OK, I know that there might be actual domain logic attached to a shopping cart in many cases.  
But if we look at it in real life with a real physical shopping cart, nobody cares if I add or remove items to my cart until I go to check out.

Or maybe a draft email, I can edit and change it in any way I want and it is not until I press “Send” that the contents/state of the object becomes important, even if the object is persistent. (I can re-open my draft and continue so it is persisted)

**The reason I got to think about this is because this is actually a case where it will be OK to map from DTO to entity straight of w/o any implications.**

**Many people (including me) in the DDD community don’t like to map from DTO to entity because you lose semantics and intention.**  
**But I was thinking about this today and in that kind of case, that might be a completely valid approach.  
This is a special kind of object that does not need the same design considerations as a “normal” domain entity would have.  
That is the key here, it doesn’t have any domain value and therefore the design can be lighter/simpler than we otherwise need/should use.**

That is, before it gets any value to the domain at hand. you simply map it from DTO to entity in order to make it persistent and  it doesn’t matter if you lose intention here since it does not yet hold any value to anyone, you just save it so you can continue edit it later.  
And at some point in time, pass it into the domain.  
(Am I repeating myself now?)

Agree? disagree?

**\[Edit\]**  
My friend Henric @fat_coder suggested that this might be a command.  
Maybe it actually is?

Could it be that a command could be persistent and editable before it is sent of to a command handler?

Interesting thought..  
I do like the idea, it could be a ApplyForJobCommand in the job scenario, and a CheckoutCommand in the shopping cart scenario.
