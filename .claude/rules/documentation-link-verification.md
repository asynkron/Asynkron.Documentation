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
