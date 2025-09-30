---
slug: building-a-framework-the-early-akka-net-history
title: "Building a framework \u2013 The early Akka.NET history"
authors:
- rogerjohansson
tags:
- actor-model
- message-passing
- open-source
---
In this post, I will try to cover some of the early history of Akka.NET and how and why things turned out the way they did.  
**Akka.NET of course have some parallel histories going as there are many contributors on the project.  
But the post is written from my own point of view and my reasons for getting involved in this.  **

<!-- truncate -->

## The butterfly effect

Back in 2005, I attended an architecture workshop initiated by Jimmy Nilsson, hosted in Lillehammer Norway.  
One of the attendees there was a Einar Landre, he worked for Statoil at the time, and he talked about how they used asynchronous systems and how you could build eventually consistent systems using message passing.  
I was totally sold on the concepts and as soon as I got back from the workshop, I introduced the concepts at my work, and build my first asynchronous message passing application, which is actually still in use today, ten years later.  
This had a huge impact on me, and changed how I came to reason about systems and integrations and why I almost a decade later thought it was a good idea to port Akka.

I also met Mats Helander, he had just started developing an Object Relatonal mapper called NPersist.  
NPersist was based on code generation, so I showed him my framework for aspect oriented programming I was building at the time, and explained how that would be able to get rid of all the code generation and make NPersist persistence ignorant via POCOs.  
Me and Mats started working on these two tools together, we packaged them under an umbrella project called Puzzle Framework.  
Back then, our competitor NHibernate was in alpha stage and featurewise we were way ahead of them.

But as time passed by, it turned out that NHibernate would become the winner, not because it was better, but because it attracted a lot more people due to it’s well known sister project, Hibernate on the JVM.  
Hibernate had a lot of learning material; books, videos and tutorials.  
So having the same framework on .NET of-course ment that you could re-use existing knowledge or learn from the vast set of resources.

Eventually me and Mats dropped the development of NPersist, at this time, NHibernate was already the de-facto standard and Linq to SQL had just been released, there were simply no reason for us to keep the project alive any more.

**The most important thing that I learned in this process, was that adoption will always outweigh features, that is; documentation, ease of use and familiarity are worth more than shiny features if no one knows how to use them.**

## Laying the foundation

Now fast forward to 2013.  
I was doing a consultancy gig for a Swedish agency, that project contained a fair deal of concurrency, multiple systems integrating with each other, all touching the same data, possibly at the same time.  
During this project, I got more and more frustrated with the lack of concurrency tools for .NET, I started reading up on this topic and eventually stumbled upon the actor model and Akka on the JVM.

As often when I find an interesting programming topic, I had to try to implement some of these concepts myself, as this is my way of learning.  
I did some weekend hacking, first using F# with pattern matching, mailbox processors and all the goodness that exists there.  
I played around with some proof of concept implementations of the core concepts of Akka, as a learning experience and with the intent to make something I might be able to use in my everyday work.

However, I knew that if I ever should have any chance to get to use any of this in my client projects, I would have to switch over to C#, and the same was true to a large extent for attracting contributors, simply because C# has a much larger market share than F# has.

I also remembered the lesson learned from NPersist vs NHbernate, there were already a handful of small hobby hacks or abandoned actor frameworks on .NET, but I knew that if I would contribute to one of those, or roll my own, the result would still be something new unproven, untrusted and it would be extremely hard to get any adoption of such effort.

## Porting Akka

A few weeks passed and eventually I actually had something that worked pretty well, quite a few of the core Akka-Actor features and some rudimentary Akka-Remote support like remote deployment and a fairly complete HOCON configuration parser was now in place.  
The code was published on Github and the project was named “Pigeon” in a lame attempt to play on carrier pigeons for message passing.  
(The name Pigeon can still be seen in the Akka.NET source code, as the main configuration file is still called “Pigeon.conf”)

The networking layer was a problem, I didn’t have much experience writing low level networking code, so the first early attempts of Akka-Remote used SignalR for communication, which later was replaced with a very naive socket implementation.

## First class support for F#

Even if I decided to go for C# as the language of implementation, I still wanted to involve the F# community.  
F# has a truly awesome opensource community around it, and I had seen that there was a genuine interest in the actor model over at the F# camp.  
So I sent out a few requests on the F# forums, looking for someone who could help me build an idiomatic F# API on top of the C# code.

## The Co-Pilot

One day in February (2014), I got an email by a guy named Aaron.

This is the actual letter:

> Hello Roger!
>
> My name is Aaron Stannard – I’m the Founder of MarkedUp Analytics, a .NET startup in Los Angeles. We build analytics and marketing automation tools for developers who author native applications for Microsoft platforms, including native Windows.  
> I began my own port of Akka to C# beginning in early December, and took a break right around Christmas. I just got back to it this week and discovered Pigeon when I was researching some details about the TPL Dataflow! I wish you had started this project a few weeks earlier 😉  
> My implementation of Akka is right around the same stage / maturity as yours, but Pigeon offers much better performance (3.5-5x), is more simply designed than mine, and you’ve already made a lot of headway on features that I haven’t even started on like Remoting and Configuration.  
> Therefore, I would like to stop working on my own implementation of Akka and support Pigeon instead. I think that would be a much better use of my time than trying to invent it all on my own.  
> I’m an experienced .NET OSS contributor – I currently maintain FluentCassandra (popular C# Cassandra driver) and have a bunch of projects of my own that I’ve open-sourced.
>
> I plan on using Pigeon in at least two of our services, both of which operate under high loads.
>
> Please let me know how I can help!  
> Best,  
> Aaron Stannard • Founder • MarkedUp

**“I plan on using Pigeon in at least two of our services, both of which operate under high loads.”**

Say WAAT!?

It turned out that Aaron had created his own networking lib called Helios, which was exactly what Akka-Remote needed.  
Aaron joined the effort and started working on the akka-remote bits while I focused mostly on akka-actor and akka-testkit.  
We had some nice progress going, and we contacted Jonas Bonér of Typesafe to see if we could use the name Akka as we aimed to be a pure port, which we got an OK to do.

## Lift off

Now the project started to gain some real attention.  
Håkan Canberger joined the team and Jérémie Chassaing contributed the first seed of the F# API.

At the same time, my youngest son Theo was born, 10 weeks too early and 1195 grams small, so I spend the next two months full time in the hospital, managing pull requests and issues on my phone.

This turned out to be a good thing for the project, up until that point, I had seen the project as “mine”, which is not a good mindset to have when trying to run a community project.

Meanwhile we gained more users and contributors and Aaron and Håkan were busy pushing new features.  
Now all of a sudden we have people like the F# language inventor Don Syme retweeting our tweets.

Bartosz joins the team and sets out to complete the F# API.  
This results in even more attention from the F# community, and Don Syme even did a code review of one of the F# API pull requests.

From that point on, the project have been pretty much self sustaining, with new contributors stepping up and contributing entire modules or integrations.

**A lot** more have of course happened since then, which may be the subject of another post, but I hope this post gives some insight into why Akka.NET came to be and why some of the early design choices was made.

With that being said, I’m sure the other developers have some interesting stories to share on why they got involved and what lead them down this route.

//Roger
