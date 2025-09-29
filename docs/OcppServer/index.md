---
sidebar_position: 1
sidebar_label: Overview
title: Asynkron.OcppServer
---

# Asynkron.OcppServer

Asynkron.OcppServer provides an OCPP 1.6 Central System engineered for massive scale so you can connect hundreds of thousands of EV chargers simultaneously. Built on Proto.Actor primitives, it delivers elastic routing, per-device isolation, and battle-tested observability hooks.

## Core highlights

- **Massive concurrency** – Stable under fleets with 100k+ charger sessions thanks to actor-based session handling and quorum-aware clustering.
- **Flexible transport** – Supports WebSocket, secure WebSocket, and MQTT bridges with automatic certificate rotation.
- **Charging intelligence** – Integrates with pricing, billing, and energy management services through programmable message pipelines.
- **Operations ready** – Ship logs, traces, and metrics through OpenTelemetry exporters for deep visibility.

## Documentation map

1. [Getting Started](getting-started.md) – Deploy a reference stack and connect a simulator.
2. [Charger Lifecycle](charger-lifecycle.md) – Manage registration, authorization, and firmware updates.
3. [Scaling](scaling.md) – Partition sessions, replicate service pods, and tune persistence.
4. [Integrations](integrations.md) – Bridge to billing systems, DERMS platforms, and demand-response APIs.

Check the samples folder for Terraform modules and Helm charts tailored for leading cloud providers.
