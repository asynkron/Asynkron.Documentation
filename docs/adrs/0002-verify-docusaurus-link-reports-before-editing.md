# ADR 0002: Verify Docusaurus Link Reports Before Editing

Date: 2026-04-28

## Status

Accepted

## Context

Issue #42 reported that the Proto.Actor bootcamp Unit 1 Lesson 2 "Go ahead!" link pointed to a root-level `lesson-3` URL instead of the unit-scoped Lesson 3 page.

Investigation on the delivery pass found no current source defect:

- `docs/ProtoActor/bootcamp/unit-1/lesson-2/index.md` linked to `../lesson-3`, which resolves within `unit-1`.
- `npm run build` completed successfully.
- The generated Docusaurus output emitted the unit-scoped URL for Lesson 3.
- The live page also returned the unit-scoped Lesson 3 href after checking the deployed URL.

No implementation diff was needed for the reported link. The main friction was distinguishing a stale or superseded observation from a source, build, or deployment defect.

## Decision

For Docusaurus documentation link reports, agents should verify the reported URL across three layers before editing source:

1. The source Markdown or sidebar/config entry that owns the link.
2. The local production build output after `npm run build`.
3. The live deployed page when the report mentions live-site behavior.

If those layers agree and point to the expected target, classify the issue as stale or superseded and preserve the evidence in the delivery summary instead of making a cosmetic or speculative source change.

## Consequences

- Agents avoid unnecessary documentation churn when source and generated output are already correct.
- Link investigations capture whether the problem is in authoring, Docusaurus generation, deployment freshness, or the original report.
- Live-site checks remain bounded to the reported page and href, so the investigation does not turn into a broad crawl.
