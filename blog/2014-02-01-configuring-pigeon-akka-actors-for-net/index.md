---
slug: configuring-pigeon-akka-actors-for-net
title: "Configuring Pigeon – Akka Actors for .NET"
authors: [rogerjohansson]
tags: ["actor-model", "akka", "hocon", "pigeon", "typesafe"]
---
When I began to write the configuration support for my Akka Actors port “Pigeon”, I used JSON for the config files.  
I’ve now managed to get some nice progress porting Typesafe’s Configuration library too.  
So Pigeon now uses HOCON notation for the config files, and thus, allows for re-use of real Akka config files in Pigeon.

<!-- truncate -->

This means you can write configurations like:

```
var config = ConfigurationFactory.ParseString(@"
# we use real Akka Hocon notation configs
akka {
    remote {
        #this is the host and port the ActorSystem will listen to for connections
        server {
            host : 127.0.0.1
            port : 8080
        }
    }
}
");
//consuming code
var port = config.GetInt("akka.remote.server.port");
```

This might sound overly optimistic, since Pigeon currently only utilize a handful of the properties from the config.  
But still, it’s pretty much only substitution support and numeric units that is missing from the config lib now, so I hope to have a fully working config system in a few days.

Once that is done, I will start incorporating it in the ActorSystem and it’s sub modules.  
For those who are interested, the configuration support can be reused in other kinds of applications.  
You can read up on the HOCON spec from Typesafe here: [https://github.com/typesafehub/config/blob/master/HOCON.md](https://github.com/typesafehub/config/blob/master/HOCON.md)  
My port to .NET can be found here:[ https://github.com/rogeralsing/Pigeon/tree/master/Pigeon/Configuration](https://github.com/rogeralsing/Pigeon/tree/master/Pigeon/Configuration)

If you are interested in using Actor Model programming for .NET, please check out Pigeon:  
[https://github.com/rogeralsing/Pigeon](https://github.com/rogeralsing/Pigeon)
