# Documentation API Terms

## Keep API names aligned with the local section

When editing documentation for a named API, method, command, or concept, verify that every nearby sentence uses the same term as the heading and example in that section. If replacing an old term, search the edited file for the stale phrase before finishing.

Prefer backticks around method and API names in prose when the surrounding file already uses that style.

Why: Issue #40 found that `docs/ProtoActor/pid.md` had a `### Send` section whose final sentence still said `Tell is also the most performant way...`. The fix was a one-word documentation correction, but the stale term made the guidance internally inconsistent and easy to miss without a targeted exact-phrase search.

Incident: #40, 2026-04-28.
