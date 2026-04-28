# ADR 0004: Document Private Products From Public Sources

Date: 2026-04-28

## Status

Accepted

## Context

Issue #57 asked the documentation site to include Asynkron's newer products Faktorial, BokaBra, and Inmem / Matcha. Unlike the existing open-source documentation sections, these products did not have public source repositories to link from the docs site.

The delivery work in PR #60 added a dedicated commercial products section, one page per product, screenshots captured from each public product site, and discovery links from the home page, docs overview, sidebar, and footer. The implementation intentionally kept BokaBra sparse because the public page was only a launching-soon/contact surface, while Faktorial and Inmem / Matcha had enough public marketing copy to support fuller descriptions.

The non-trivial decision was whether a documentation site that mostly documents open-source projects should list private/commercial products, and how to avoid inventing unsupported claims or implying repository availability for products whose source is not public.

## Decision

This documentation site may include private and commercial Asynkron products when they are part of the product catalog, but those pages must be grounded in public product surfaces or explicit issue-provided facts.

For private/commercial product pages:

- Link to the official public product site instead of a source repository unless a public repository is explicitly provided.
- State when no public source repository is linked from the documentation page.
- Keep copy conservative for sparse public sites and avoid inferring capabilities, launch state, pricing, integration details, or technical architecture that are not publicly visible or provided in the issue.
- Use screenshots or visual assets captured from current public product pages with stable, descriptive filenames under `static/img/products/`.
- Expose the products through the same site discovery surfaces used by other products: docs overview, sidebar, footer, and home page when applicable.

## Consequences

- The docs site can represent Asynkron's full product catalog without pretending private products are open source.
- Future product additions have a repeatable evidence model: public site facts, explicit issue facts, conservative wording, and committed visuals.
- Sparse or pre-launch products can still be documented, but their pages should say little rather than fill gaps with speculation.
- Product catalog edits must keep navigation and discovery surfaces consistent, because Docusaurus product pages are not discoverable from `docs/` alone.
