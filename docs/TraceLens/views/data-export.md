---
sidebar_position: 7
---

# Data export view

TraceLens includes a data export panel so you can share trace payloads with the TraceLens team or attach them to bug reports. The panel packages the spans, logs, and related metadata into a single transferable payload.

![TraceLens data export tab showing packaged trace payload](/img/tracelens/export-data.png)

## Export workflow

1. Open the **Data** tab for the trace you want to share.
2. Review the summary text to understand what will be included. Sensitive fields such as log lines, tags, and span data are part of the package, so confirm that you are comfortable sending them.
3. Use the download action to save the encoded payload locally. The payload is a JSON structure that TraceLens support can load to reproduce the trace.

![TraceLens data package contents preview](/img/tracelens/data-package.png)

Remember that the export feature is optional—you stay in control of what leaves your environment.
