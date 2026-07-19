---
title: Failure
---

# `Failure`

The `Failure` system message is emitted by the runtime when a child actor crashes and its supervisor needs to decide how to recover. The message contains:

- the failing child's [`PID`](../pid.md),
- the [`RestartStatistics`](https://pkg.go.dev/github.com/asynkron/protoactor-go/actor#RestartStatistics) gathered for the actor, and
- the exception or error that triggered the failure.

Supervisors do not receive `Failure` through their regular mailbox. Instead, the runtime delivers it through the supervision channel so the parent can apply its [supervision strategy](../supervision.md).

Typical supervisory logic reacts to `Failure` by selecting one of the built-in directives:

- `ResumeDirective` to continue processing without restarting,
- `RestartDirective` or `RestartChildrenDirective` to restart the child,
- `StopDirective` to stop the child permanently, or
- `EscalateDirective` to propagate the error further up the hierarchy.

### Example: logging crashes in .NET

```csharp
public override SupervisorDirective HandleFailure(
    ISupervisor supervisor,
    PID child,
    RestartStatistics rs,
    Exception reason)
{
    _logger.LogError(reason, "{Actor} failed after {RestartCount} restarts", child, rs.FailureCount);
    return SupervisorDirective.Restart;
}
```

See the full supervisor samples in the [Proto.Actor .NET examples](https://github.com/asynkron/protoactor-dotnet/tree/dev/examples).

### Example: inspecting failures in Go

```go
func (s *loggingStrategy) HandleFailure(supervisor actor.Supervisor, child *actor.PID, rs *actor.RestartStatistics, reason interface{}) {
    log.Printf("actor %s failed %d time(s): %v", child, rs.FailureCount(), reason)
    supervisor.RestartChildren(child)
}
```

You can explore more Go supervisors in the [Proto.Actor Go examples](https://github.com/asynkron/protoactor-go/tree/dev/examples).
