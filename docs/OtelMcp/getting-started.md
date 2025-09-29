---
sidebar_position: 2
sidebar_label: Getting Started
---

# Getting started with Asynkron.OtelMcp

Set up a sandbox collector, connect sample workloads, and validate that telemetry flows into the search UI and MCP interface.

## Prerequisites

- Docker or Kubernetes cluster capable of running the collector containers
- Access to the services you want to instrument with OpenTelemetry SDKs
- API credentials for any downstream storage backends you plan to use

## Quick install

1. Clone the deployment samples from the repository.
2. Bring up the stack with `docker compose up` or apply the Helm chart.
3. Use `otelcol --config` to verify the collector is listening on the expected ports.
4. Send a test trace with the OTLP demo app and confirm it appears in the console.

When everything looks good, proceed to configuring authentication, scaling, and retention to match your production requirements.
