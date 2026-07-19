# Asynkron Autonomous Delivery Roadmap

_Last reviewed: 2026-07-19_

This internal roadmap describes the evidence available today and the direction
toward a code factory that can operate a product with minimal human
intervention. It is working material, not a published product commitment:
[`README.md`](../README.md) and `docusaurus.config.ts` establish
`docs/products` as the only documentation source published by this repository.

## Source Ledger

| Source | Observation | What it can establish | Freshness limit |
| --- | --- | --- | --- |
| This repository, `origin/main` at `9272c49`, inspected 2026-07-19 | [`README.md`](../README.md), [`package.json`](../package.json), [`Makefile`](../Makefile), [`.faktorial/main-verify.json`](../.faktorial/main-verify.json), [`scripts/quality-evidence.mjs`](../scripts/quality-evidence.mjs), and [`docs/journal/2026-07-19.md`](journal/2026-07-19.md) | Publication scope, dependency versions, the repository-owned quality-evidence path, and greenfield module-boundary contracts | Repository facts only; they do not prove a production deployment or customer outcome |
| Live local Faktorial APIs, generated 2026-07-19T11:52:13Z | `/api/metrics`, `/api/metrics/pipeline`, and `/api/metrics/quality` | A point-in-time aggregate view of visible work, stage dwell, and recorded quality outcomes | Changes continuously; unavailable or disabled signals must remain unknown rather than become zero |
| [`docs/product/readme.md`](product/readme.md), inspected 2026-07-19 | Managed-pilot thesis, proposed commercial experiments, KPI definitions, and known evidence gaps | Hypotheses and a measurement vocabulary | It does not establish revenue, customer demand, delivery cost, or acceptance rates |
| [`docs/dreaming.md`](dreaming.md), inspected 2026-07-19 | Greenfield qualities and candidate platform modules | Long-term target direction | Explicitly aspirational; it is not evidence of deployed services or runtime behavior |
| Asynkron.JsEngine `origin/main` at `ecb77cc72deb858039e31369ea94f70bc76cdcaa`, inspected 2026-07-19 | Recent July commits and its `docs/roadmap.md` | An example of proof-linked delivery and explicit current/short/long-term tracking | Its roadmap header still says 2026-06-13, so individual status claims require newer source or proof confirmation |
| Requested local `../booking` application checkout, inspected 2026-07-19 | No application checkout was available at the requested location. `/Users/rogerjohansson/git/asynkron/IaC/Booking/README.md` separately documents build, health-check, deployment, and rollback procedures | The operational bundle has a documented procedure and expects a separate Booking source checkout | It cannot establish current Booking code, features, database state, usage, code health, or production health |

The source ledger is deliberately conservative. Repository configuration proves
what is checked in; a live API sample proves only the sampled runtime state; a
strategy or dream document proves only the stated hypothesis. Future roadmap
updates should refresh the relevant source before changing a status claim.

## Current State

### Documentation delivery

The current repository is a Docusaurus site whose public content is confined to
`docs/products`. The Docusaurus packages are aligned at 3.9.2. `make quality`
delegates to the repository's Node-based evidence adapter, which runs TypeScript
validation, a production Docusaurus build, and focused adapter-contract tests
before emitting Faktorial's required evidence envelope. Internal strategy,
architecture, journal, ADR, and roadmap files are outside the published content
root.

### Faktorial delivery loop

At 2026-07-19T11:52:13Z, the local runtime reported six visible nonterminal
tasks: four active and two waiting. The 30-day pipeline view also reported 14
terminal tasks, three claimed tasks, and a maximum current stage dwell of about
1.87 hours. The quality view reported one task in review, two tasks with errors,
zero recorded review rejections, and zero ping-pong tasks.

These figures are operational observations, not product-performance claims.
The overview reported a verification success rate of 1 while external CI
signals were disabled, so it would be misleading to translate that sample into
a general success rate. Accepted delivery, elapsed time to verified change,
first-pass quality, supervision effort, compute cost, customer conversion, and
recurring-evidence completeness are not yet captured here as a durable,
privacy-safe time series.

### Adjacent product evidence

Asynkron.JsEngine demonstrates a useful delivery pattern: recent mainline work
uses bounded proof manifests, ADRs, measured performance packets, and explicit
decline boundaries to distinguish implemented routes from aspirations. Its
roadmap structure is useful, but its stale update header shows why task status
and source freshness need mechanical reconciliation rather than trust in prose.

The requested Booking application source was unavailable. The separate IaC
bundle documents a production target, image build, health verification, and
rollback workflow, but deployment instructions are not evidence about the
application's current implementation or runtime condition. Those facts remain
unknown until the source checkout and authorized operational evidence are
available.

## What Works Well

- **A bounded public surface.** Keeping `docs/products` separate from internal
  strategy and architecture material reduces the chance that hypotheses become
  accidental customer commitments.
- **One reproducible quality entry point.** `make quality` and the evidence
  adapter give Faktorial a repository-owned contract instead of teaching the
  orchestrator Docusaurus-specific behavior.
- **Explicit stage and wait state.** The live pipeline exposes active, waiting,
  claimed, review, and dwell information, making orchestration bottlenecks
  observable at a point in time.
- **Evidence-oriented engineering examples.** Asynkron.JsEngine shows how a
  large autonomous backlog can retain proof boundaries, failed experiments,
  and follow-up ownership without calling partial progress complete.
- **A safely framed product thesis.** The Faktorial strategy defines a managed
  pilot and measurable commercial hypotheses while clearly marking revenue,
  demand, acceptance, cost, and retention as unavailable.

## What Works Less Well

- **Roadmap state has no drift guard.** There is currently no
  `scripts/roadmap-status-drift` command, even though recurring automation must
  validate Done references before it reuses, retires, or derives work from
  them.
- **Operational metrics are transient.** Dashboard endpoints provide useful
  snapshots, but this repository has no reproducible aggregate history for
  throughput, dwell, verification/review outcomes, or recurring evidence.
- **Success semantics are easy to overstate.** Disabled CI signals and small
  denominators can coexist with apparently positive rates. Missing values need
  explicit unknown/unavailable treatment.
- **Cross-repository freshness is uneven.** The JsEngine roadmap header lags its
  recent commits, while the requested Booking application source cannot be
  inspected at all.
- **The target architecture is ahead of runtime proof.** The modules in
  `docs/dreaming.md` provide a coherent direction, but ingestion, governance,
  publishing control, analytics, personalization, and knowledge-core behavior
  must not be described as delivered.

## What Could Be Improved

1. Make task-link reconciliation a prerequisite for interpreting completed
   roadmap work. The check should distinguish open local work, unresolved local
   identities, transport failures, and nonblocking historical external
   provenance without mutating tasks.
2. Persist privacy-safe operational snapshots with observation time, source
   provenance, denominator context, and unavailable semantics. Trends should be
   derived from aggregates, never raw prompts or task bodies.
3. Attach freshness metadata to cross-repository claims and downgrade claims to
   unknown when their authoritative checkout or endpoint cannot be inspected.
4. Connect product experiments to accepted-delivery, time-to-verification,
   first-pass quality, supervision, compute-cost, and conversion evidence before
   making pricing or scale decisions.
5. Promote greenfield modules only through bounded implementation slices with
   explicit human judgment at consequential product, privacy, security,
   commercial, and production-release boundaries.

## Short-Term Goals

1. **Make roadmap completion status mechanically trustworthy.** Implement the
   exact required drift-validation command, reviewer-readable classifications,
   blocking error semantics, bounded tests, and usage guidance in
   [fk36](/issues/fk36). This is the immediate prerequisite for safely adding a
   Done section or deriving later work from completed roadmap text.
2. **Create a privacy-safe delivery evidence baseline.** Add a reproducible
   aggregate snapshot workflow with timestamps, provenance, unavailable
   semantics, and coverage for throughput, waiting/dwell, verification/review
   outcome, and recurring-evidence completeness in [fk37](/issues/fk37). This
   supplies the minimum evidence needed to judge whether autonomy is improving.

These tasks are intentionally separate: the first owns tracking correctness;
the second owns measurement. This roadmap introduces no Done task text, so the
currently absent drift validator is not bypassed during this run.

## Long-Term Goals

- **Self-improving delivery.** Convert verified outcomes, failures, review
  feedback, and bounded operational signals into prioritized repository work
  while retaining provenance and preventing duplicate or stale tasks.
- **Safe product operation.** Extend from code delivery toward release,
  rollback, observability, and incident workflows only when authority,
  verification, recovery, and audit boundaries are explicit.
- **Privacy-aware learning.** Use minimized aggregate signals to improve issue
  selection, documentation, and delivery without retaining secrets, personal
  data, customer content, raw prompts, or unnecessary free text.
- **Evidence-backed autonomy.** Measure accepted outcomes, elapsed time,
  first-pass quality, supervision, and cost so increasing autonomy is justified
  by quality and economics rather than activity volume.
- **Minimal but meaningful human intervention.** Automate routine,
  reversible, well-proven decisions while preserving authorized human judgment
  for product direction, privacy, security, commercial commitments, and
  irreversible production consequences.

The destination is not unattended code generation. It is a traceable factory
that can choose bounded work, implement it, prove it, operate it, learn from
aggregate outcomes, and stop when evidence or authority is insufficient.
