# Lifecycle system messages

Proto.Actor emits a predictable sequence of lifecycle messages so actors can initialise, recover, and shut down cleanly. The sections below summarise each notification and link to deeper guides where available.

## PoisonPill
`PoisonPill` is a user-level message that queues a graceful shutdown once all pending user work has been processed. See [the dedicated guide](poison-pill.md) for a walk-through.

## Restart
`Restart` is dispatched right before an actor instance is replaced during supervision. It gives middleware a chance to clear per-instance state that would otherwise leak across restarts.

## Restarting
`Restarting` indicates the actor has begun its restart cycle but has not yet processed new user messages. This is a good place to rehydrate transient state before work resumes.

## Started
`Started` fires once after an actor is created so initialisation logic can run. Typical uses include seeding behaviour stacks or requesting resources.

## Stop
`Stop` is the user-facing command that asks the system to terminate an actor. It can be sent explicitly or triggered by helpers such as `RootContext.StopAsync`.

## Stopping
`Stopping` is emitted after a stop has been requested but before the mailbox drains. Use it to flush metrics or cancel background work while user messages are no longer accepted.

## Stopped
`Stopped` confirms that the actor has completed shutdown. Children have been stopped, resources released, and watchers will soon see `Terminated`.

## Terminated
`Terminated` is delivered to watchers when the observed actor stops for any reason (normal exit, failure, or kill). Watchers often use it to restart dependencies or escalate failures.
