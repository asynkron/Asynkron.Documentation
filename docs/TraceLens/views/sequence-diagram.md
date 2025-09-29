---
sidebar_position: 5
---

# Sequence diagram view

TraceLens automatically generates UML-style sequence diagrams for every trace. The diagram illustrates how calls flow between services, actors, and external systems in the order they occurred.

![TraceLens sequence diagram tab](/img/tracelens/sequence-diagram.png)

## Reading the diagram

- **Lifelines** across the top represent participating services. Each message arrow shows who called whom and when.
- **Call labels** reuse the span names so you can map diagram interactions back to the spans and logs.
- **Layout controls** let you switch between left-to-right and top-to-bottom arrangements to match your preferred modeling style.
- **Tag overlays** surface useful attributes (such as firmware versions or scenario names) when you need additional context on each interaction.

Sequence diagrams are ideal for explaining distributed flows to teammates or verifying that integration tests exercise the expected call path.
