---
slug: the-simplest-form-of-configurable-dependency-injection
title: "The simplest form of configurable Dependency Injection"
authors: [rogerjohansson]
tags: []
---
I love the concept of dependency injection, but I’ve never found a dependency injection framework that I think is easy enough to use.

<!-- truncate -->

They either rely on XML configurations that are really awkward.  
Others have force you to resolve objects by some untyped string ID.

I don’t want that.  
I want to resolve my objects through normal methods, that’s intuitive and the code becomes readable too.

However, if you try to accomplish this by code without writing yet another framework.  
You will either have to decide if you want your resolver to have static or instance methods.

If you go for instance methods, then you will have to make some sort of factory for the factory itself if you want to be able to return other implementations of the same factory.

If you go for static methods, you will probably end up with a static dead factory that you can’t change in run-time, since that’s the nature of static methods.

I personally like the simplicity of the static methods, but as I said, they are not configurable.

But there is a quite slick solution to this problem;  
I have started to use static delegates for this instead.

By exposing static delegates I can get the same simplicity as when calling static methods, but  
at the same time achive the pluggability of instance methods (or rather of different implementations of the same factory).

Here is some sample code:

```

//The Class that you use to get your objects
public static class Config
{
    public static Func<IDbConnection> GetConnection = 
      DefaultConfig.GetConnection;

     public static Func<IDbCommand> GetCommand = 
      DefaultConfig.GetCommand;
}

//Default implementations of the config functions
public static class DefaultConfig
{

  //Configure a connection
  public static IDbConnection GetConnection()
  {
       return new SqlConnection("myconnstr");
  }

  //Configure a command
  public static IDbCommand GetCommand()
  {
      IDbCommand cmd = new SqlCommand();
    
      //Inject connection into command
      //Any sort of injection is possible here, ctor, prop, method etc.
      cmd.Connection = Config.GetConnection();

      return cmd;
  }
}
```

Look at the “Config” class above, it exposes “Func of IDbConnection”, meaning it will return a delegate that in turn returns a DbConnection once invoked.  
This allows me to assign new implementations to that static field if I want to, and thus make all consumers of that delegate get objects according to my new implementation.

My code can then consume the factory like this:

```
IDbCommand cmd = Config.GetCommand();
```

That looks quite OK, doesn’t it?

And in order to change the implementation for some resolve method:

```
Config.GetCommand = () => new MySpecialCommand();
```

Or if you like the old delegate syntax:

```
Config.GetCommand = delegate
                    {
                        return new MySpecialCommand();
                    };
```

I use this all the time now, I simply change the config implementation for my unit tests and use the default implementation when running the real applications.

//Roger
