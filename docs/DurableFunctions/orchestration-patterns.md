---
sidebar_position: 3
sidebar_label: Orchestration patterns
---

# Orchestration patterns

The examples directory in the public repository maps every major concept to a runnable sample. Use the snippets below as a starting point and adapt them to your domain.

## Visualising orchestrator lifecycles

Durable orchestrators run deterministically: they emit decisions, persist them to storage, and replay from history whenever the runtime needs to resume work. The sequence diagrams below show how that coordination plays out in practice.

```mermaid
sequenceDiagram
    actor Caller as Client / Trigger
    participant Runtime as Durable Runtime
    participant Orchestrator
    participant Storage
    participant Activity as Activity Worker

    Caller->>Runtime: Start "CreateGreeting"
    Runtime->>Storage: Append StartInstance
    Runtime->>Orchestrator: Execute deterministic function
    Orchestrator->>Runtime: Schedule "FormatGreeting"
    Runtime->>Storage: Append ScheduleActivity
    Runtime->>Activity: Invoke worker
    Activity-->>Runtime: Complete with result
    Runtime->>Storage: Append ActivityCompleted
    Runtime->>Orchestrator: Replay history and deliver result
    Orchestrator-->>Runtime: Return GreetingResult
    Runtime->>Storage: Mark instance Complete
    Runtime-->>Caller: Signal completion
```

Waiting for external input follows the same deterministic workflow. The orchestrator records that it is waiting, and the runtime resumes execution only after the event arrives.

```mermaid
sequenceDiagram
    participant Orchestrator
    participant Runtime as Durable Runtime
    participant Storage
    participant Activity as Activity Worker
    participant External as External System

    Orchestrator->>Runtime: Schedule "SendApprovalEmail" activity
    Runtime->>Storage: Append ScheduleActivity
    Runtime->>Activity: Dispatch work item
    Activity->>External: Send approval email
    External-->>Activity: Acknowledge send
    Activity-->>Runtime: Activity completed
    Runtime->>Storage: Append ActivityCompleted
    Orchestrator->>Runtime: Wait for ApprovalDecision
    Runtime->>Storage: Append WaitForExternalEvent
    External-->>Runtime: Raise ApprovalDecision
    Runtime->>Storage: Append ExternalEventReceived
    Runtime->>Orchestrator: Replay and deliver payload
    Orchestrator-->>Runtime: Continue workflow
```

These diagrams mirror the call sites you will see in the code listings below, helping you map orchestration APIs to the underlying control flow.

## Parallel work (fan-out/fan-in)

`SqliteExample` launches three activities in parallel and waits for all of them before emitting a combined result.

```csharp title="SqliteExample.cs"
runtime.RegisterJsonOrchestrator("ParallelProcessingOrchestrator", async (context, _) =>
{
    Console.WriteLine("Starting parallel activities...");

    // Activities execute in parallel and the orchestrator resumes once all complete.
    var task1 = context.CallAsync<string>("ProcessData", "data1");
    var task2 = context.CallAsync<string>("ProcessData", "data2");
    var task3 = context.CallAsync<string>("TransformData", "data3");

    var results = await Task.WhenAll(task1, task2, task3);
    return $"Combined: {string.Join(", ", results)}";
});
```

```mermaid
sequenceDiagram
    participant Caller
    participant Runtime as Durable Runtime
    participant Orchestrator as ParallelProcessingOrchestrator
    participant A1 as ProcessData("data1")
    participant A2 as ProcessData("data2")
    participant A3 as TransformData("data3")

    Caller->>Runtime: Start instance
    Runtime->>Orchestrator: Replay history and resume
    Orchestrator->>Runtime: Schedule all three activities
    Runtime->>A1: Dispatch work item
    Runtime->>A2: Dispatch work item
    Runtime->>A3: Dispatch work item
    par Activity fan-out
        A1-->>Runtime: Return result1
        Runtime->>Orchestrator: Deliver result1 on replay
    and
        A2-->>Runtime: Return result2
        Runtime->>Orchestrator: Deliver result2 on replay
    and
        A3-->>Runtime: Return result3
        Runtime->>Orchestrator: Deliver result3 on replay
    end
    Orchestrator-->>Runtime: Emit combined payload
    Runtime-->>Caller: Mark orchestration complete
```

Because orchestrators are replayed deterministically, avoid non-deterministic APIs (like `DateTime.UtcNow`) in the body. Log progress with `context.CreateReplaySafeLogger()` if you need structured logging.

## Human-in-the-loop workflows

`ExternalEventsExample` suspends execution until an external approval arrives.

```csharp title="ExternalEventsExample.cs"
runtime.RegisterOrchestrator<ApprovalRequest, string>("HumanApprovalOrchestrator", async (context, request) =>
{
    await context.CallAsync("SendApprovalEmail", request); // Notify the approver

    Console.WriteLine("Waiting for human approval...");
    var approvalResponse = await context.WaitForEvent<ApprovalResponse>("ApprovalDecision");

    if (approvalResponse.Approved)
    {
        await context.CallAsync("ProcessApprovedRequest", request);
        return $"Approved by {approvalResponse.ApproverName}";
    }

    await context.CallAsync("ProcessRejectedRequest", request);
    return $"Rejected by {approvalResponse.ApproverName}";
});
```

```mermaid
sequenceDiagram
    participant Client
    participant Runtime as Durable Runtime
    participant Orchestrator as HumanApprovalOrchestrator
    participant Email as SendApprovalEmail Activity
    participant External as Approver / External System

    Client->>Runtime: Start approval orchestration
    Runtime->>Orchestrator: Resume deterministic function
    Orchestrator->>Runtime: CallAsync "SendApprovalEmail"
    Runtime->>Email: Execute email send
    Email-->>Runtime: Acknowledge dispatch
    Runtime-->>Orchestrator: Deliver activity completion
    Orchestrator->>Runtime: WaitForEvent "ApprovalDecision"
    Runtime->>External: Expose wait state via management API
    External-->>Runtime: Raise ApprovalDecision payload
    Runtime->>Orchestrator: Replay history and supply decision
    Orchestrator->>Runtime: CallAsync processing activity (approved or rejected)
    Runtime->>External: (via activity) Perform side effects
    Runtime-->>Orchestrator: Deliver outcome
    Orchestrator-->>Runtime: Return approval summary
    Runtime-->>Client: Surface final status
```

Raise events with `runtime.RaiseEventAsync(instanceId, "ApprovalDecision", payload)` or via the HTTP management API once the person (or system) has responded.

## Durable timers

`TimerOrchestrationExample` demonstrates the canonical timer pattern.

```csharp title="TimerOrchestrationExample.cs"
[FunctionName("ShortSleepOrchestrator")]
public async Task<string> ShortSleepOrchestrator([OrchestrationTrigger] IOrchestrationContext context)
{
    var dueTime = context.CurrentUtcDateTime.AddSeconds(30); // no DateTime.UtcNow in orchestrators
    await context.CreateTimer(dueTime);

    return "Woke up after 30 seconds!";
}
```

```mermaid
sequenceDiagram
    participant Client
    participant Runtime as Durable Runtime
    participant Orchestrator as ShortSleepOrchestrator
    participant Storage

    Client->>Runtime: Trigger ShortSleepOrchestrator
    Runtime->>Orchestrator: Resume and evaluate next step
    Orchestrator->>Runtime: Request CreateTimer(dueTime)
    Runtime->>Storage: Persist timer metadata
    Runtime-->>Orchestrator: Suspend until due
    Storage-->>Runtime: Signal timer due
    Runtime->>Orchestrator: Replay history to deliver timer fire
    Orchestrator-->>Runtime: Return completion message
    Runtime-->>Client: Report orchestration complete
```

Timers are persisted alongside orchestration state. If the process crashes, the runtime simply reschedules execution at the correct moment.

## Sub-orchestrations

Keep complex workflows maintainable by delegating to child orchestrators. `SubOrchestratorExample` coordinates payment and shipping flows and then combines both results.

```csharp title="SubOrchestratorExample.cs"
var payment = await context.CallSubOrchestratorAsync<PaymentReceipt>("ProcessPayment", orderId);
var shipping = await context.CallSubOrchestratorAsync<ShippingLabel>("ArrangeShipping", payment);

return new OrderResult(payment, shipping);
```

```mermaid
sequenceDiagram
    participant Parent as OrderOrchestrator
    participant Runtime as Durable Runtime
    participant Payment as ProcessPayment Orchestrator
    participant Shipping as ArrangeShipping Orchestrator

    Parent->>Runtime: CallSubOrchestrator ProcessPayment(orderId)
    Runtime->>Payment: Start child orchestration
    Payment-->>Runtime: Emit PaymentReceipt
    Runtime-->>Parent: Deliver PaymentReceipt on replay
    Parent->>Runtime: CallSubOrchestrator ArrangeShipping(payment)
    Runtime->>Shipping: Start child orchestration
    Shipping-->>Runtime: Emit ShippingLabel
    Runtime-->>Parent: Deliver ShippingLabel on replay
    Parent-->>Runtime: Return OrderResult(payment, shipping)
```

Sub-orchestrators inherit all the reliability guarantees of the parent workflow while keeping the surface area of each orchestrator small.

## Strongly-typed APIs

The `SimpleTypedOrchestratorDemo` proves that you do not have to work with raw `object` parameters. Typed contexts unlock IntelliSense, validation, and refactoring support.

```csharp title="SimpleTypedOrchestratorDemo.cs"
runtime.RegisterOrchestrator<GreetingRequest, GreetingResult>("CreateGreeting",
    async (context, request) =>
    {
        var logger = context.GetLogger(); // Replay-safe logger specific to this instance
        logger.LogInformation("Creating greeting for {Name}", request.Name);

        var message = await context.CallAsync<string>("FormatGreeting", request.Name);

        return new GreetingResult
        {
            Message = message,
            Language = request.Language,
            CreatedAt = context.CurrentUtcDateTime // prefer the deterministic orchestration clock
        };
    });
```

```mermaid
sequenceDiagram
    participant Client
    participant Runtime as Durable Runtime
    participant Orchestrator as CreateGreeting
    participant Activity as FormatGreeting Activity

    Client->>Runtime: Trigger CreateGreeting with GreetingRequest
    Runtime->>Orchestrator: Replay typed context state
    Orchestrator->>Runtime: CallAsync "FormatGreeting" (request.Name)
    Runtime->>Activity: Execute formatter activity
    Activity-->>Runtime: Return greeting message
    Runtime-->>Orchestrator: Supply deterministic result
    Orchestrator-->>Runtime: Return GreetingResult (message, language, timestamp)
    Runtime-->>Client: Provide typed completion payload
```

Pair this with `runtime.TriggerAsyncObject("instance", "CreateGreeting", new GreetingRequest { ... })` and you get compile-time guarantees across orchestrator boundaries.
