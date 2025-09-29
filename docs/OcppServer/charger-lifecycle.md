---
sidebar_position: 3
sidebar_label: Charger Lifecycle
---

# Charger lifecycle management

Understand how Asynkron.OcppServer models the lifecycle of each charging point from onboarding to retirement.

## Phases

1. **Registration** – Handle BootNotification, assign identity, and provision certificates.
2. **Authorization** – Coordinate authorization modes (whitelist, remote, RFID) and maintain roaming state.
3. **Operations** – Monitor heartbeats, meter values, firmware status, and remote start/stop commands.
4. **Maintenance** – Schedule OCPP diagnostics, push firmware updates, and decommission chargers cleanly.

## Actor model mapping

Each charger maps to a dedicated actor with child actors for transactions, firmware, and diagnostics. Supervisors isolate faults so a failing charger cannot affect the fleet.

Use the sample policies to configure SLA windows, retry limits, and alert routing per region.
