---
slug: nworkspace-linq-workspace-followup
title: "NWorkspace / Linq Workspace Followup"
authors: [rogerjohansson]
tags: ["ddd", "linq", "nworkspace"]
---
I’m still playing around with the outcome my [Linq Workspace Experiment](http://rogeralsing.com/2008/07/03/ddd-nworkspace-experiment/).

<!-- truncate -->

And I have to say that I’m fairly pleased with the result, it’s only a handful of code (less than 100 LoC) but it makes testing so much easier.

I’m so pleased with it that we will be using this in a fairly large live project, a large portion of every Swedish citizens that turn 18 will pass through this system 🙂

It has enabled us to test all of our service methods with in mem data w/o ever changing,faking or mocking our repositories.

So cheers to both Erik Meijer for making Linq such a cool tool and to Jimmy Nilsson for inventing the workspace pattern 🙂
