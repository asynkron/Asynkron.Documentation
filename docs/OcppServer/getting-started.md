---
sidebar_position: 2
sidebar_label: Getting Started
title: Getting Started
---

# Getting Started

Follow these steps to launch Asynkron.OcppServer in a development cluster and attach a charger simulator.

## Prerequisites

- Kubernetes 1.24+ or a Docker Compose environment
- TLS certificates for secure WebSocket endpoints
- Access to a database for session persistence (PostgreSQL, Cosmos DB, etc.)

## Bring up the stack

1. Clone the deployment manifests from the repo.
2. Configure endpoint URLs and secrets in `values.yaml` or `.env`.
3. Deploy the control plane with `helm install` or `docker compose up`.
4. Run the included charger simulator to establish the first test connection.

When the simulator reports a successful handshake, review logs and metrics to confirm the system is receiving metering data and status updates.
