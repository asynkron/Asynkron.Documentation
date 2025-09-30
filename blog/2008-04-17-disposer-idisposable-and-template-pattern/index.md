---
slug: disposer-idisposable-and-template-pattern
title: "Disposer – IDisposable and Template pattern"
authors: [rogerjohansson]
tags: ["gdi", "idisposable", "template-method-pattern", "wrapper"]
---
I do a fair amount of GDI+ programming, and thus using a lot of IDisposable objects.  
But I also use template or factory methods alot in my apps, and that doesnt work well with disposable objects

<!-- truncate -->

Imagine something like this:

```csharp
public abstract class MyRendererBase
{
      public void Render(Graphics g)
      {
            //use templated objects
            Brush bgBrush = GetBackgroundBrush();
            Brush fgBrush = GetForegroundBrush();

            g.FillRectangle(bgBrush ....);
            g.FillRectangle(fgBrush ....);
      }
      //templated methods
      public abstract Brush GetBackgroundBrush();
      public abstract Brush GetForegroundBrush();
}
```

What could go wrong here?  
Well, lets say that you implement the class like this:

```csharp
public class SomeRenderer : MyRendererBase
{
      public override Brush GetBackgroundBrush()
      {
            return SystemBrushes.Control; //return existing
      }
      public override Brush GetForegroundBrush()
      {
            return new SolidBrush(Colors.Blue); //return new
      }
}
```

In this case, the GetForegroundBrush method creates a new custom brush for each call and that brush should be disposed once we are finished with it.  
While the GetBackgroundBrush method returns an existing brush that should NOT be disposed, it could be a system brush or just a brush that you defined in a static settings class or something similair.

How should the consumer of the templated methods know if it should or should not dispose the objects in this case?  
Normally when you use disposable objects you create them directly in the consumer code and you can easily decide if you need to dispose or not.  
But if we do so, we would lose the benefits of template/factory methods, that is: beeing able to substitute values/objects in a larger algorithm/flow.

So my solution to this problem is to make  wrapper class that will hold a ref to the disposable object, and you can tell the wrapper if it should dispose the resource or not:

```csharp
public class Disposer<T> : IDisposable where T : IDisposable
{
    public T Value { get; set; }
    public bool ShouldDispose { get; set; }
    public Disposer(T value,bool shouldDispose)
    {
        Value = value;
        ShouldDispose = shouldDispose;
    }
    ~Disposer()
    {
        Dispose(false);
    }
    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            lock (this)
            {
                Value.Dispose();
            }
        }
    }
    public void Dispose()
    {
        if (ShouldDispose)
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
```

Once we have this class, we can alter our sample code to:

```csharp
public abstract class MyRendererBase
{
      public void Render(Graphics g)
      {
           using (var bgBrush = GetBackgroundBrush())
            {
                 g.FillRectangle(bgBrush.Value ....);
            }
           using (var fgBrush = GetForegroundBrush())
            {
                 g.FillRectangle(bgBrush.Value ....);
            }
      }
      //templated methods
      public abstract Disposer<Brush> GetBackgroundBrush();
      public abstract Disposer<Brush> GetForegroundBrush();
}
```

And the implementation to:

```csharp
public class SomeRenderer : MyRendererBase
{
      public override Disposer<Brush> GetBackgroundBrush()
      {
            //return a wrapper that does not dispose the content
            return new Disposer<Brush>(SystemBrushes.Control, false);
      }
      public override Disposer<Brush> GetForegroundBrush()
      {
            //return a wrapper that dispose the content
            return new Disposer<Brush>(new SolidBrush(Colors.Blue),true);
      }
}
```

And that’s it.  
The wrapper objects will always be disposed by the consumer, but the template methods can now tell if the content of the wrapper objects should or should not be disposed together with the wrapper.

Note:  
The above sample is very naive, in this case we could just as well have created our solid blue brush somehwere else and used w/o disposing in the consumer code.  
But there are cases where you actually have to create new objects in the template methods for each call.  
Eg. when using GradientBrushes that need to start their gradients at a specific point. (based on some state somewhere)

Enjoy.  
//Roger
