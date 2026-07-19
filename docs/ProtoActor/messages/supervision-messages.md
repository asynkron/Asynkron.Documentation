# Supervision system messages

Supervision messages coordinate recovery when actors fail or when their lifecycle must be observed. They are raised automatically by the runtime and normally consumed by supervisors or the infrastructure around an actor.

## Failure
`Failure` contains the exception and metadata describing why a child crashed. Supervisors inspect it to decide whether to restart, stop, or escalate the issue.

## SuspendMailbox
`SuspendMailbox` pauses message delivery for an actor so a supervisor can stabilise state without new work arriving. The mailbox remains queued until `ResumeMailbox` arrives.

## ResumeMailbox
`ResumeMailbox` re-enables delivery after a suspension. Once processed, pending user messages continue to flow through the actor.

## Watch
`Watch` registers interest in another actor's lifecycle. When the observed actor stops, the watcher will receive a `Terminated` notification.

## Unwatch
`Unwatch` removes a previously established watch so termination notifications are no longer delivered.
