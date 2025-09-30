---
slug: rx-framework-building-a-message-bus
title: "RX Framework – Building a message bus"
authors: [rogerjohansson]
tags: []
---
I’ve been toying around with the Reactive Extensions (RX) Framework for .NET 4 the last few days and I think I’ve found a quite nice usecase for it;  
Since RX is all about sequences of events/messages, it does fit very well together with any sort of message bus or event broker.

<!-- truncate -->

Just check this out:

**Our in proc message bus:**

```
public class MiniVan
{
    private Subject<object> messageSubject = new Subject<object>();

    public void Send<T>(T message)
    {
        messageSubject.OnNext(message);
    }

    public IObservable<T> AsObservable<T>()
    {
        return this
            .messageSubject
            .Where(m => m is T)
            .Select(m => (T)m);
    }
}
```

**Subscribing to messages:**

```
bus.AsObservable<MyMessage>()
    .Do(m => Console.WriteLine(m))
    .Subscribe();
```

The nice thing about this is that you get automatic Linq support since it is built into RX.  
So you can add message handlers that filters or transform messages.  
Pretty slick isnt it?

I’m currenty writing an example IRC chat client based on this idea which I will publish in a week or two.

//Roger
