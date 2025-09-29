---
sidebar_position: 5
sidebar_label: Integrations
---

# Integration recipes

Extend Asynkron.OcppServer by connecting downstream services for billing, energy, and customer engagement.

## Common adapters

- **Billing** – Stream transaction events to Stripe, Chargebee, or SAP via webhooks or message queues.
- **Energy markets** – Publish real-time load data to DERMS and demand-response APIs using MQTT bridges.
- **Customer apps** – Expose REST and GraphQL endpoints for mobile apps to schedule sessions and view history.

## Implementation tips

- Use Proto.Actor props to define custom middleware for message transformation.
- Wrap external calls with circuit breakers to protect the session loop.
- Keep transport-specific logic isolated so you can swap providers without touching charger actors.

See the samples for integration blueprints and Terraform modules targeting AWS, Azure, and GCP.
