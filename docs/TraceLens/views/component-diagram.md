---
sidebar_position: 6
---

# Component diagram view

The **Component Diagram** tab summarizes the architecture of the trace with PlantUML-rendered components. It shows how services and actors relate to one another without the per-message noise that sequence diagrams provide.

![TraceLens component diagram tab](/img/tracelens/component-diagram.png)

## Key details

- **Service boxes** show the actors or microservices that participated in the trace.
- **Connector arrows** reveal dependencies, making upstream and downstream relationships obvious.
- **Theme selector** lets you pick the PlantUML skin that best fits your documentation style.
- **Show Tags** overlays important metadata (such as request identifiers) directly on the nodes.

Use the component diagram when you need a high-level architecture snapshot for documentation or onboarding discussions.
