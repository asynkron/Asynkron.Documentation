---
title: Faktorial product strategy
description: Working CPO/CTO memory for testing how Faktorial can become a profitable product.
---

# Faktorial product strategy

## Purpose

This document is the working CPO/CTO memory for Faktorial monetization. It turns
the current public product position into falsifiable commercial hypotheses,
defines the evidence needed to evaluate them, and gives future strategy runs one
place to record decisions. It is not approved pricing, a customer commitment,
or a report of current financial performance.

## Source ledger

### Confirmed repository facts

- [The public Faktorial product page](../Products/faktorial.md) describes a
  GitHub-native delivery loop covering investigation, build, verification,
  deployment, and learning. It also describes configurable quality gates and
  approval points.
- The same page says Faktorial is publicly presented as a pilot or managed
  service and describes team-operated and Faktorial Managed modes with senior
  engineering supervision.
- [The commercial products overview](../Products/index.md) lists Faktorial as
  an Asynkron commercial product focused on GitHub issue backlogs.
- [ADR 0004](../adrs/0004-document-private-products-from-public-sources.md)
  requires conservative, public-source-backed product statements and forbids
  inferring pricing, launch state, capabilities, or architecture.

### Missing at this revision

The requested `roadmap.md` and `dreaming.md` files were not present when this
strategy was created on 2026-07-19, so no content or decisions are attributed
to them. This checkout also contains no usable customer pipeline, revenue,
pricing, delivery-cost, retention, expansion, or competitor dataset. Those
items remain unknown until measured or supplied by an authorized owner.

## Product thesis

**Strategy hypothesis:** Faktorial should sell an evidence-backed, supervised
outcome—taking a bounded GitHub issue to a verified, review-ready change—rather
than sell access to another coding assistant. Its hypothesized differentiation
is the combination of repository-native work state, explicit delivery stages,
controlled quality gates, senior supervision, and a learning loop. The
repository confirms that these mechanisms are part of the product position; it
does not yet prove that buyers value them enough to pay, that delivery is
repeatable, or that the service is profitable.

The first commercial question is therefore not “How many seats can we sell?”
It is “Can we repeatedly produce accepted deliveries at a cost below the value
an engineering leader assigns to removing backlog and coordination load?”

## ICP and buyers

**Initial ICP hypothesis:** software organizations with a meaningful GitHub
backlog, working CI, maintainers able to review changes, and enough review or
coordination cost to value a managed delivery lane. A suitable first customer
should have bounded issues that can be completed without privileged production
access or unresolved product decisions.

- **Economic buyer hypothesis:** VP Engineering, CTO, or engineering director
  accountable for throughput, quality, and staffing cost.
- **Daily stakeholders:** repository maintainers and technical leads who refine
  issues, review evidence, and accept or reject deliveries.
- **Poor-fit signals:** no reliable CI, mostly ambiguous discovery work,
  unavailable maintainers, mandatory access that cannot be safely delegated,
  or a backlog too coupled to split into reviewable outcomes.

No repository evidence currently establishes market size, buying frequency, or
willingness to pay for this ICP. Interviews and paid offers must establish them.

## Differentiation

The following are positioning hypotheses to test, not verified competitor
claims:

1. **Outcome over suggestion.** Buyers may value a verified change with an
   evidence trail more than generated code that their team must shepherd.
2. **Control over unattended autonomy.** Explicit stages, gates, and approval
   points may make automation adoptable in repositories where uncontrolled
   agents are unacceptable.
3. **Service wedge before software scale.** Senior supervision may make early
   delivery dependable while exposing the workflows that later deserve product
   automation.
4. **Compounding repository fit.** Captured decisions and delivery lessons may
   reduce repeated coordination, but this benefit has not yet been measured.

Competitive research is deliberately deferred until a named comparison set,
dated public sources, and buyer interview evidence are available. This document
does not assert parity or superiority over any named product.

## Monetization options

All four options are hypotheses. “Adopt” means gather enough evidence to invest
in the model; “reject” means stop or redesign it rather than treat activity as
validation.

| Model | Buyer | Charging unit | Value metric | Principal delivery cost or risk | Adoption trigger | Rejection trigger |
| --- | --- | --- | --- | --- | --- | --- |
| Fixed-fee managed pilot | Engineering leader | One time-boxed pilot | Accepted deliveries and reduced time-to-verified-change | Senior supervision and uncertain issue complexity | At least two paid pilots meet the pilot success thresholds and customers request continuation | Prospects will not pay, or delivery misses quality/economic thresholds after two completed pilots |
| Recurring managed delivery lane | Engineering leader or budget owner | Monthly reserved delivery capacity | Predictable accepted deliveries per month | Capacity planning, support load, and uneven backlog readiness | At least two pilots convert and two monthly cohorts show stable contribution per accepted delivery | Conversion is weak or supervision hours make recurring gross margin structurally unattractive |
| Team-operated subscription | Engineering platform or developer-productivity lead | Team/repository subscription, with usage guardrails if needed | Maintainer time saved and verified throughput | Onboarding, product support, compute variance, and customer-operated reliability | Repeated pilots show common workflows, low-touch onboarding, and demand for direct operation | Each repository needs bespoke operation or ongoing senior intervention |
| Enterprise/self-hosted annual agreement | Security-conscious engineering organization | Annual platform agreement plus onboarding/support | Governed adoption across repositories | Deployment variants, security review, support commitments, and long sales cycles | Qualified buyers require deployment/control features and accept pricing that covers support complexity | Requirements fragment the product or expected contract value does not cover sales and support cost |

## Recommendation

Start with a paid managed pilot, convert successful customers to a recurring
managed delivery lane, and delay team-operated and enterprise packaging until
repeatability and support economics are observed. The managed wedge is intended
to buy learning while charging for a bounded outcome; it must not become an
open-ended consulting engagement.

### Paid-pilot offer hypothesis

- **Time box:** six weeks, including setup and final review.
- **Scope:** one agreed repository and one bounded issue class; no production
  deployment, emergency response, or unresolved product discovery unless added
  through a separately approved agreement.
- **Included capacity hypothesis:** up to 8 accepted deliveries or 120 hours of
  combined automated and supervised delivery effort, whichever comes first.
- **Pricing-range hypothesis:** EUR 15,000–30,000 excluding tax. This is a
  willingness-to-pay experiment, not approved or published pricing. A business
  owner must approve every external quote.
- **Customer prerequisites:** working CI, authorized repository access, a named
  buyer, a named maintainer, prioritized/refined issues, review responses within
  two business days, and agreement on security and data-handling boundaries.
- **Test-threshold success criteria:** at least 6 accepted deliveries; at least
  80% accepted without a new build cycle after first review; median
  time-to-verified-change at least 25% below an agreed customer baseline; fewer
  than 3 senior supervision hours per accepted delivery by the final two weeks;
  no unresolved severity-one security or compliance event; and buyer-confirmed
  intent to discuss a recurring lane.
- **Conversion decision:** offer a three-month recurring lane only if acceptance,
  quality, supervision, and contribution thresholds are met and the customer
  confirms continuing backlog demand. Reprice when value is demonstrated but
  contribution is below threshold. Stop or narrow the offer when quality,
  access, issue readiness, or economics remain below threshold.

The thresholds above are proposed experiment boundaries, not present
performance. Legal, security, tax, and commercial terms require authorized
human review outside this strategy document.

## Unit economics

Measure economics per customer, pilot, month, and accepted delivery. Do not use
pipeline value or signed contract value as recognized revenue.

- `Recognized revenue` = revenue attributable to deliveries completed in the
  measurement period under the applicable accounting policy.
- `Direct model/CI/infrastructure cost` = model usage + CI usage + hosting,
  storage, and other directly attributable infrastructure.
- `Senior supervision cost` = supervision hours × loaded hourly rate.
- `Direct support cost` = support hours × loaded hourly rate + attributable
  support tooling.
- `Gross profit` = recognized revenue − direct model/CI/infrastructure cost −
  senior supervision cost − direct support cost.
- `Gross margin` = gross profit ÷ recognized revenue. Report “not meaningful”
  when recognized revenue is zero rather than dividing by zero.
- `Contribution per accepted delivery` = gross profit ÷ accepted deliveries.
  Report it separately from attempted or rejected work.
- `Customer acquisition cost (CAC)` = attributable sales and marketing labor +
  travel + tooling + other acquisition spend ÷ new paying customers.
- `CAC payback months` = CAC ÷ average monthly gross profit from the customer.

**Test thresholds:** seek non-negative pilot gross profit, at least 50% recurring
managed-lane gross margin, positive contribution per accepted delivery, and CAC
payback within 12 months. These are decision hypotheses, not observed results or
approved corporate targets. Reprice, reduce included capacity, or stop the model
if delivered value cannot support the required labor and compute cost.

## Measurement plan

The following is the minimum dataset. Every current value is unavailable in
this checkout; the table proposes ownership and collection, not an assertion
that those systems already exist.

| Metric | Definition | Proposed source | Proposed owner | Cadence |
| --- | --- | --- | --- | --- |
| Leads | Organizations or buyers entering a dated commercial conversation | Lightweight CRM | Commercial lead | Weekly |
| Qualified opportunities | Leads matching ICP, authority, need, timing, and repository readiness | Qualification record | Commercial lead | Weekly |
| Pilots proposed / started / completed | Count and stage dates for priced pilot offers | CRM plus signed agreement register | Commercial lead | Weekly |
| Accepted deliveries | Changes explicitly accepted by the named customer maintainer | GitHub/Faktorial delivery record | Delivery lead | Per delivery |
| Time-to-verified-change | Time from agreed ready issue to canonical verification completion | Faktorial event timestamps | Product/engineering | Per delivery; weekly cohort |
| First-pass quality rate | Accepted deliveries requiring no new build cycle after first review ÷ accepted deliveries | Faktorial stage history and review outcome | Product/engineering | Weekly |
| Human review and supervision hours | Attributable human time by activity and delivery | Time record linked to delivery | Delivery lead | Per delivery |
| Compute cost | Direct model, CI, hosting, storage, and other attributable usage | Provider billing and usage export | Engineering/finance | Weekly estimate; monthly close |
| Pilot-to-recurring conversion | Pilots entering a paid recurring lane ÷ completed pilots | CRM and agreements | Commercial lead | Monthly |
| Retention and expansion | Recurring customers retained, contracted revenue retained, and expanded capacity | Billing/contract register | Commercial lead/finance | Monthly and quarterly |
| Reasons lost or stopped | One primary coded reason plus bounded notes | CRM closeout | Commercial lead | Per decision; monthly review |

Use a stable customer identifier rather than confidential names in product
analysis. Restrict contracts, credentials, personal data, and detailed customer
content to authorized systems; only aggregate, public-safe conclusions belong
in this repository.

## 90-day experiments

### Days 1–30: validate problem, ICP, and price

1. Interview 10–15 engineering leaders and 5–10 maintainers using the same
   problem, current-cost, trust, procurement, and price questions.
2. Ask qualified prospects to choose between bounded pilot offers at different
   prices and capacities; count a signed paid pilot, not verbal enthusiasm, as
   willingness-to-pay evidence.
3. Define issue-readiness and baseline measurement with each pilot prospect
   before accepting work.

**Continue** if at least three qualified prospects request a proposal and at
least one accepts a paid pilot. **Narrow or stop** if the problem is not urgent,
buyers cannot name a budget, or repositories consistently fail the readiness
criteria. Interview counts and thresholds are experiment hypotheses.

### Days 31–60: run paid pilots and measure delivery

1. Run no more than two concurrent pilots so supervision and cost can be
   attributed accurately.
2. Record every delivery outcome, elapsed time, review cycle, supervision hour,
   compute cost, and stop reason.
3. Review security, quality, and economics weekly; do not hide failed or rejected
   deliveries from the denominator.

**Continue** a pilot while it remains within its quality and contribution guardrails.
**Reprice or reduce scope** when accepted value is clear but included capacity
drives negative contribution. **Stop** when the repository cannot safely provide
access, issue readiness does not improve, or a serious unresolved quality or
compliance event occurs.

### Days 61–90: decide the commercial shape

1. Ask completed-pilot buyers for a paid three-month recurring-lane decision.
2. Compare cohort acceptance, supervision hours, compute cost, gross margin,
   conversion, and reasons lost against the declared thresholds.
3. Choose one path for the next quarter:
   - **Deepen managed service** when conversion and recurring economics meet the
     thresholds but workflows still need supervision.
   - **Productize team-operated mode** when workflows repeat, onboarding is
     demonstrably low-touch, and customers ask to operate it themselves.
   - **Explore enterprise packaging** only when qualified demand for deployment
     control is repeated and expected contract value covers added complexity.
   - **Stop or downgrade the offer** when paid demand, safe repeatability, or a
     credible path to positive contribution is absent.

## Risks and data gaps

- Pricing and capacity may be too high, too low, or mismatched; only paid tests
  and measured delivery economics can resolve this.
- A managed service can conceal product friction with senior labor. Track hours
  per accepted delivery and require them to fall before productizing.
- Small or unusually prepared pilots may not generalize. Keep cohort and issue
  characteristics with every result.
- Quality metrics can be gamed by choosing trivial issues or excluding failures.
  Define readiness before work and retain rejected/stopped work in the record.
- Public documentation can create unintended commitments. Keep customer data,
  non-public contracts, credentials, and confidential financial details out of
  this repository, and require owner approval before externalizing hypotheses.
- Market size, competitor position, current revenue, delivery cost, retention,
  expansion, and willingness to pay are all unknown at this revision.

## Decision log and next run

### 2026-07-19 — Establish the managed-pilot learning wedge

- **Decision hypothesis:** test a paid managed pilot before investing in scaled
  subscription or enterprise packaging.
- **Why:** managed delivery matches the current public product position and can
  collect willingness-to-pay, quality, effort, and cost evidence together.
- **Approval state:** working hypothesis; pricing, thresholds, ICP, and packaging
  require business-owner approval before becoming external commitments.
- **Evidence available:** only the repository sources in the source ledger.
- **Evidence needed next:** interview notes in an authorized system, priced
  proposals, paid-pilot decisions, delivery outcomes, supervision hours,
  compute cost, and conversion decisions.

Future recurrence runs should append a dated entry rather than rewrite prior
decisions. Each entry should state what new evidence arrived, which hypothesis
changed, the decision owner, and the next falsifiable experiment. If
`roadmap.md` or `dreaming.md` later appears, add it to the source ledger and
record its influence without retroactively attributing it to this revision.
