---
sidebar_position: 3
---

# Timeline view

The **Timeline** tab renders a Gantt-style visualization for the spans in a trace. Each row represents a span and each bar shows when it started and how long it ran relative to the root span.

![TraceLens timeline tab with horizontal span bars](/img/tracelens/timeline-tab.png)

## Highlights

- **Zoom controls** let you focus on tight windows or expand to the full trace when you need a broader context.
- **Parallelism inspection** becomes easy because overlapping bars make concurrent work obvious.
- **Span duration labels** help quantify how much time each layer consumes without switching tabs.
- **Filtering options** stay consistent with the spans view, so you can hide noise while examining the timeline.

Use the timeline when you need to spot bottlenecks or confirm that asynchronous pipelines behave as expected.
