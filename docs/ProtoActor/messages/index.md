# Built-in messages

## Supervision messages
- [`Failure`](supervision-messages.md#failure) – sent to supervisors when child actors crash.
- [`SuspendMailbox`](supervision-messages.md#suspendmailbox) & [`ResumeMailbox`](supervision-messages.md#resumemailbox) – control whether a mailbox is paused during recovery.
- [`Watch`](supervision-messages.md#watch) & [`Unwatch`](supervision-messages.md#unwatch) – register or remove lifecycle monitoring for another actor.

## Lifecycle messages
- [`PoisonPill`](lifecycle-messages.md#poisonpill) – graceful stop request processed after queued user messages.
- [`Restart`](lifecycle-messages.md#restart) – emitted by the runtime before actor state is reinitialised (see [supervision](../supervision.md)).
- [`Restarting`](lifecycle-messages.md#restarting) – indicates an actor is in the middle of a restart cycle.
- [`Started`](lifecycle-messages.md#started) – sent when an actor is created so it can run initialisation logic.
- [`Stop`](lifecycle-messages.md#stop), [`Stopping`](lifecycle-messages.md#stopping) & [`Stopped`](lifecycle-messages.md#stopped) – manage the shutdown workflow for actors.
- [`Terminated`](lifecycle-messages.md#terminated) – delivered to watchers when an observed actor has stopped (see [`Watch`](supervision-messages.md#watch) & [`Unwatch`](supervision-messages.md#unwatch)).

## Special message interfaces
- `IMessageBatch` – see [Batching Mailbox](../mailboxes.md#batching-mailbox) for usage guidance.
- `IAutoRespond` – implemented by system pings such as [`Touch`](touch.md) so responses bypass the actor.

## Utility messages
- [`Touch` & `Touched`](touch.md) – built-in ping/pong used to verify actor liveness.
- `Continuation` – schedules callbacks to resume workflows (see [Reentering patterns](../reenter.md)).
- `ProcessDiagnosticsRequest` – internal diagnostic probe emitted by tooling to inspect actor state.
- [`ReceiveTimeout`](../receive-timeout.md) – triggered after a period of inactivity when configured on a context.
