# Documentation Product Sources

## Ground private and commercial product docs in explicit sources

When adding or updating documentation for private, commercial, or non-open-source Asynkron products, use only explicit issue facts and the current public product pages as source material. Do not imply an open-source repository, package, pricing model, integration capability, launch status, or architecture unless the issue or public site states it.

For each product page, prefer this evidence pattern:

- Official public product link.
- Current public status or discovery path.
- Screenshot or visual asset captured from the public product page with a stable filename under `static/img/products/`.
- Clear note when no public source repository is linked from the docs page.

If the public site is sparse, keep the docs sparse too. A launching-soon/contact page should produce a narrow product page, not an invented feature list.

When product pages are added, update the relevant discovery surfaces together: docs overview, sidebar, footer, and homepage product listing when applicable.

Why: Issue #57 / PR #60 added documentation for Faktorial, BokaBra, and Inmem / Matcha even though they were private/commercial products without public source repositories. The accepted pattern was to document them from their public product sites, commit current screenshots, avoid repo links, and keep BokaBra intentionally brief because its public page exposed only launch/contact information.

Incident: #57 / PR #60, 2026-04-28.
