# ADR 0003: Treat Doc Section Removal as Site-Wide Reference Cleanup

Date: 2026-04-28

## Status

Accepted

## Context

Issue #47 removed obsolete Jsome, LiveView, and TraceLens product listings from the documentation site. The first delivery commit deleted the product documentation trees, removed the docs overview entries, removed sidebar categories, and deleted confirmed-unused static assets.

The follow-up investigation still found references to the removed products in `src/pages/index.tsx` and `docusaurus.config.ts`. Those homepage cards, homepage image references, and footer links pointed at docs routes and assets that had already been removed. A second build-stage commit was needed to remove the stale homepage and footer exposure before PR #53 could be approved and merged.

The friction was not the mechanics of deleting files. It was that a Docusaurus documentation section can be linked from several site surfaces outside `docs/` and `sidebars.ts`, including the React homepage, Docusaurus footer configuration, and static image references.

## Decision

When removing a documentation product, section, route family, or static asset family, treat the work as a site-wide reference cleanup rather than a docs-tree-only edit.

Agents should search for both content names and concrete route or asset identifiers across the repository, including:

- `docs/` content and category metadata.
- `sidebars.ts`.
- `docusaurus.config.ts`.
- `src/pages/` React pages.
- `static/` asset references.
- Any remaining product map, homepage, footer, or navigation metadata.

The final acceptance check should prove that removed docs routes and removed asset filenames are no longer referenced from non-ignored source paths. Historical blog prose can remain when it is not linking to removed docs or assets.

## Consequences

- Documentation removals are less likely to leave broken homepage cards, footer links, or missing images.
- Product deletion acceptance criteria should include homepage and footer exposure, not just docs overview and sidebar navigation.
- Reference searches should use both human-facing product names and path-level identifiers, because names alone can include legitimate historical mentions while route and asset strings identify broken navigation.
- `npm run build` remains the final Docusaurus validation step, but a targeted reference sweep should happen before declaring a removal complete.
