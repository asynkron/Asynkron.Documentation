---
slug: learning-azure-day-2-servicebus
title: "Learning Azure, Day 2 | Servicebus"
authors: [rogerjohansson]
tags: ["servicebus"]
---
This is a continuation of my completely random learning experiences while trying to learn the Azure plattform.

<!-- truncate -->

## Future messages

When you send a message on the Azure Servicebus, you have the option to set a `ScheduledEnqueueTimeUtc` property.  
This value decides *when* the message will be visible to the receivers, it is kind of like sending a message in the future.

So when is this useful?

Let’s say we want to send a payment reminder 20 days after an order was placed, but only if no payments have arrived.  
We could solve this using future messages.

Consider the following flow of messages

Receive `PlaceOrder` message -\> Send `Reminder` (set `ScheduledEnqueueTimeUtc` to 20 days in the future)

..20 days pass

Receive `Reminder` message -\> Check if the order have been paied, if not, send the reminder to the buyer using snailmail or email

This way, you don’t have to build additional scheduling logic to your system or add polling tables to your database, it is handled by the Servicebus itself.

Looks super useful, I have to look into how this scales, if messages can be kept for years without side effects.

That’s all for now
