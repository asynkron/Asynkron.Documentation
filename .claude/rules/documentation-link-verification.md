# Documentation Link Verification

## Verify reported Docusaurus links across source, build, and live output

When a documentation issue reports a broken, stale, or mis-scoped Docusaurus link, verify the smallest relevant path through all applicable layers before editing:

- Check the source Markdown or Docusaurus config/sidebar entry that owns the link.
- Run the local production build when generated routing or rewritten hrefs could be involved.
- Inspect the generated HTML for the specific reported href.
- If the report is about the deployed site, check the live URL too, including trailing-slash redirects when relevant.

If source, generated output, and live output already point to the expected target, do not make speculative source edits. Summarize the evidence and treat the report as stale or superseded.

Why: Issue #42 reported that the Proto.Actor bootcamp Unit 1 Lesson 2 "Go ahead!" link pointed to a root-level Lesson 3 URL. The delivery investigation found that source used `../lesson-3`, `npm run build` emitted the correct unit-scoped URL, and the live page also linked to the unit-scoped Lesson 3 page. No implementation change was needed; the useful lesson was the verification path that separated a stale report from a real source defect.

Incident: #42, 2026-04-28.

## Treat doc section removal as site-wide reference cleanup

When removing a Docusaurus product, section, route family, or static asset family, search beyond the deleted docs tree before calling the work complete. Check the smallest relevant set of source surfaces that can advertise or link to the removed content:

- `docs/` pages and category metadata.
- `sidebars.ts`.
- `docusaurus.config.ts`, especially navbar and footer links.
- `src/pages/` React pages, especially homepage product cards or product maps.
- `static/` asset references and any image filenames being deleted.

Search for both human-facing product names and concrete route or asset identifiers, for example `/docs/<section>`, product logo filenames, and product-specific screenshot folders. Historical blog prose can remain when it is not linking to removed routes or assets.

Before finishing, verify that no non-ignored source path still references removed docs routes or deleted assets, then run the Docusaurus build when dependencies are installed.

Why: Issue #47 initially removed the Jsome, LiveView, and TraceLens docs trees, docs overview entries, sidebar categories, and unused assets, but stale homepage cards, homepage image references, and Docusaurus footer links still pointed at deleted routes/assets. A second build pass was required to clean `src/pages/index.tsx` and `docusaurus.config.ts` before PR #53 could merge.

Incident: #47 / PR #53, 2026-04-28.
