# Built-in messages

## Supervision messages
- [`Failure`](failure.md) – sent to supervisors when child actors crash.
- [`ResumeMailbox`](resume-mailbox.md) – resumes message delivery for a paused actor.
- [`SuspendMailbox`](suspend-mailbox.md) – pauses message delivery so an actor can recover.
- [`Watch`](watch.md) – registers interest in another actor's lifecycle.
- [`Unwatch`](unwatch.md) – removes lifecycle monitoring for a watched actor.

## Lifecycle messages
- [`PoisonPill`](poison-pill.md)
- [`Restart`](restart.md)
- [`Restarting`](restarting.md)
- [`Started`](started.md)
- [`Stop`](stop.md)
- [`Stopping`](stopping.md)
- [`Stopped`](stopped.md)
- [`Terminated`](terminated.md)

## Special message interfaces
- [`IMessageBatch`](message-batch.md)
- [`IAutoRespond`](auto-respond.md)

## Utility messages
- [`Touch`](touch.md)
- [`Touched`](touched.md)
- [`Continuation`](continuation.md)
- [`ProcessDiagnosticsRequest`](process-diagnostics-request.md)
- [`ReceiveTimeout`](receive-timeout.md)
