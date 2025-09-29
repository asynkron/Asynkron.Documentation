---
sidebar_position: 1
sidebar_label: Overview
title: Asynkron.OtelMcp
---

# Asynkron.OtelMcp

Asynkron.OtelMcp combines an OpenTelemetry collector, time-series pipeline, and search interface with a Machine Control Protocol (MCP) surface so AI agents can reason about your telemetry. Build automated runbooks, anomaly investigations, and health dashboards that stay current as your distributed systems evolve.

:::tip Project links
- Source repository: [asynkron/OtelMCP](https://github.com/asynkron/OtelMCP)
:::

## Key capabilities

- **Unified telemetry ingest** – Ship traces, metrics, and logs from any OpenTelemetry SDK or collector and normalize them with zero-copy processing.
- **AI-native query surface** – Expose observability data through MCP so LLM-powered copilots can ask questions, correlate signals, and propose remediation steps.
- **Scalable storage** – Retain high-cardinality data by streaming into a columnar store optimized for actor workflows and multi-tenant workloads.
- **Programmable workflows** – Trigger automations when collectors detect new patterns, service regressions, or saturation events.

## Documentation map

1. [Getting Started](getting-started.md) – Stand up the collector and import your first telemetry streams.
2. [MCP Agents](mcp-agents.md) – Wire up agent prompts, guardrails, and feedback loops.
3. [Operations](operations.md) – Scale storage tiers, retention policies, and alerting.
4. [Reference](reference.md) – Configuration schema, ports, and supported exporters.

> Looking for concrete examples? Check the samples directory for docker-compose stacks and IaC modules you can drop into your environment.
