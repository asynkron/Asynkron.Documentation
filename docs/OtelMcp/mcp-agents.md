---
sidebar_position: 3
sidebar_label: MCP Agents
title: MCP Agents
---

# MCP Agents

Use the Machine Control Protocol interface to let AI assistants and automation frameworks interrogate your telemetry.

## Agent Lifecycle

1. Define agent personas and allowed tool invocations.
2. Provide scoped credentials so each agent can only query approved tenants.
3. Configure prompt templates that translate natural-language questions into OTLP queries.
4. Capture feedback and reward signals to refine the agents over time.

## Recommended Patterns

- **Triage bot** – Watches new incidents and proposes root-cause hypotheses.
- **Capacity planner** – Periodically inspects historical metrics to recommend scaling adjustments.
- **Release guardian** – Cross-checks new deploys against performance budgets and toggles feature flags when anomalies appear.

Review the SDK samples for code that wires MCP agents into Slack, Teams, and PagerDuty workflows.
