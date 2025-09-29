---
sidebar_position: 4
sidebar_label: Scaling
---

# Scaling guidance

Design your Asynkron.OcppServer deployment for high availability and horizontal scale.

## Control plane

- Run at least three gateway replicas across zones.
- Enable session stickiness based on charger identity to keep message ordering.
- Configure persistence caches with Redis or DynamoDB global tables.

## Data plane

- Partition chargers by geography or operator using routing keys.
- Use asynchronous persistence for metering data to keep session loops responsive.
- Emit metrics for connected sessions, pending commands, and round-trip latency.

Regularly load-test upgrades with the simulator suite to validate that tail latencies stay within your SLA.
