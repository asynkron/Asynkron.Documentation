---
slug: massive-improvements-to-pigeon-akka-actors-for-net
title: "Massive improvements to Pigeon \u2013 Akka Actors for .NET"
authors:
- rogerjohansson
tags:
- actor-model
- net
---
The last few weeks have been busy busy.  
Me and [Aaron](http://www.aaronstannard.com/) have been making some massive improvements to Pigeon.  
Most of the Akka features are now completed, remoting still needs some love and after that we will start porting Akka clustering.

<!-- truncate -->

One of the latest features we have added is logging.  
We support the same features as real Akka, so logging can be done using the ActorSystem.EventStream, and there is also a BusLogging LoggingAdapter.

We are also leveraging the real Akka config, so we can enable logging based on the same configuration options that Akka has.  
Here is a snapshot of the output from the StandardOutLogger when booting the ChatServer example:

```text
2014-02-21 22:40:44 DebugLevel EventStream - subscribing [akka://all-systems/StandardOutLogger] to channel Pigeon.Event.Info [Thread 9]
2014-02-21 22:40:44 DebugLevel EventStream - subscribing [akka://all-systems/StandardOutLogger] to channel Pigeon.Event.Warning [Thread 9]
2014-02-21 22:40:44 DebugLevel EventStream - subscribing [akka://all-systems/StandardOutLogger] to channel Pigeon.Event.Error [Thread 9]
2014-02-21 22:40:44 DebugLevel EventStream - StandardOutLogger started [Thread 9]
2014-02-21 22:40:44 DebugLevel akka.tcp://MyServer@localhost:8081 - now supervising akka.tcp://MyServer@localhost:8081/user [Thread 10]
2014-02-21 22:40:44 DebugLevel akka.tcp://MyServer@localhost:8081 - now supervising akka.tcp://MyServer@localhost:8081/system [Thread 10]
2014-02-21 22:40:44 DebugLevel akka.tcp://MyServer@localhost:8081/system - now supervising akka.tcp://MyServer@localhost:8081/system/deadLetterListener [Thread 11]
2014-02-21 22:40:44 DebugLevel EventStream - subscribing [akka.tcp://MyServer@localhost:8081/system/deadLetterListener] to channel Pigeon.Event.DeadLetter [Thread 9]
2014-02-21 22:40:44 DebugLevel akka.tcp://MyServer@localhost:8081/system - now supervising akka.tcp://MyServer@localhost:8081/system/logMyServer-DefaultLogger [Thread 10]
2014-02-21 22:40:44 DebugLevel EventStream(MyServer) - Default Loggers started [Thread 11]
2014-02-21 22:40:44 DebugLevel EventStream - subscribing [akka.tcp://MyServer@localhost:8081/system/logMyServer-DefaultLogger] to channel Pigeon.Event.Error [Thread 11]
2014-02-21 22:40:44 DebugLevel EventStream - unsubscribing [akka.tcp://MyServer@localhost:8081/system/logMyServer-DefaultLogger] from channel Pigeon.Event.Debug [Thread 11]
2014-02-21 22:40:44 DebugLevel EventStream - unsubscribing [akka.tcp://MyServer@localhost:8081/system/logMyServer-DefaultLogger] from channel Pigeon.Event.Info [Thread 11]
2014-02-21 22:40:44 DebugLevel EventStream - unsubscribing [akka.tcp://MyServer@localhost:8081/system/logMyServer-DefaultLogger] from channel Pigeon.Event.Warning [Thread 11]
2014-02-21 22:40:44 WarningLevel ActorSystem(MyServer) - {
  akka : {
    log-config-on-start : on
    stdout-loglevel : DEBUG
    loglevel : ERROR
    actor : {
      provider : "Pigeon.Remote.RemoteActorRefProvider, Pigeon.Remote"
      debug : {
        receive : on
        autoreceive : on
        lifecycle : on
        event-stream : on
        unhandled : on
      }
    }
    remote : {
      server : {
        host : localhost
        port : 8081
      }
    }
  }
} [Thread 9]
2014-02-21 22:40:44 DebugLevel akka.tcp://MyServer@localhost:8081/user - now supervising akka.tcp://MyServer@localhost:8081/user/ChatServer [Thread 10]
2014-02-21 22:40:45 DebugLevel akka.tcp://MyServer@localhost:8081/user/ChatServer - received handled message ChatMessages.ConnectRequest [Thread 11]
```

Alot of the existing features have also been refined to conform even more to real Akka, e.g. ActorSelection have been rewritten to behave exactly like in Akka.  
ActorRefs are now also serializable in messages, so you can send messages containing actorrefs across the wire and use them on remote systems.  
The Akka RemoteDaemon is also coming along nicely, so we can create actors on remote nodes this way, the underlying deployment features are however not completed yet.

The Props class have also gotten new features, we can now configure dispatchers and mailboxes via the config and there is also a new dispatcher that lets you run actors in the main thread, to allow GUI updates in WPF/WinForms.

Well, there are alot of new features and bugfixes, so if you are interested in Actor Model Programming in .NET be sure to check out the Pigeon repository at [https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)

//Roger
