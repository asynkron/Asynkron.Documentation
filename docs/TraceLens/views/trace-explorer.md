---
sidebar_position: 1
---

# Trace Explorer

The Trace Explorer is the entry point for finding telemetry. It combines span and tag filters with quick time-range presets so you can zero in on the trace that matters.

![TraceLens trace filter panel](/img/tracelens/trace-search.png)

## Filtering traces

- Scope queries by **service name** and **span name** to isolate the endpoints that matter.
- Apply **tag key/value filters** when you want to focus on requests with specific attributes such as scenario identifiers or tenant IDs.
- Use the **time range limiter** to keep searches small and responsive. Presets such as “last 5 minutes” help when triaging live traffic, while longer windows are useful for regression hunts.
- The explorer shows the underlying query it executed so you can reproduce the search when sharing troubleshooting steps.

## Reviewing results

When TraceLens finds matches it displays them in a sortable list. Each entry highlights the trace ID, scenario name, start time, and total duration so you can quickly pick the trace that is worth drilling into.

![TraceLens trace result list](/img/tracelens/trace-results.png)

Open a row to load the full trace experience with span data, timelines, logs, diagrams, and export tools.
