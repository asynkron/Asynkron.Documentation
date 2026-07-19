---
title: Faktorial
sidebar_label: Overview
---

# Faktorial

![Faktorial dashboard screenshot](/img/products/faktorial-home.png)

Faktorial is Asynkron's autonomous engineering delivery product. It runs the delivery loop directly inside a GitHub repository — investigating an issue, building the change, proving it with tests and CI, preparing the pull request, and recording what it learned for next time. Teams can run it themselves, or have Asynkron operate it as a managed service.

:::tip Project links
- Official site: [faktorial.ai](https://faktorial.ai)
- Contact: [Run a pilot](https://faktorial.ai/#run-a-pilot) or email [info@asynkron.se](mailto:info@asynkron.se)
:::

No public source repository is linked from Faktorial's product site, so none is linked here either.

## What it automates

Faktorial's public site frames the product around a simple idea: a backlog is already a work order, and Faktorial makes it executable. It covers:

- **Bug fixes and debugging** — agents read the issue, code, tests, CI output, and logs, then propose or deliver a PR once they've found the root cause.
- **Feature development** — UI, backend, integration, and migration work moves from acceptance criteria to a branch, commit, and pull request.
- **Test coverage and quality gaps** — recurring gaps get turned into scoped, reviewable PRs rather than being carried indefinitely.
- **Self-learning** — friction encountered during delivery (retries, flaky CI, ambiguous scope) is converted into agent rules, ADRs, or new follow-up issues instead of being lost after merge.

## The delivery pipeline

Every issue Faktorial picks up moves through the same five stages, each isolated in its own branch and worktree:

1. **Investigate** — maps acceptance criteria, dependencies, and risk before any code is written.
2. **Build** — writes the test first, then the change.
3. **Verify** — enforces CI and test-tracking gates to stop scope creep.
4. **Deploy** — merges once configured rules allow it, targeting `main` or a development branch.
5. **Learn** — writes back ADRs and agent rules so the next run benefits from what this one discovered.

## Autonomy is a control, not a default

Teams choose exactly how much authority Faktorial has: which labels or issue sizes it may act on, which branch it targets, which quality gates apply, and whether it stops at a review-ready pull request or is allowed to merge automatically. The public site describes this as a dial that starts conservative — for example, PR-only with mandatory human approval — and can be opened up as trust in the pipeline builds.

## How it fits together

Faktorial positions itself as the control plane between a team's existing GitHub workflow and the coding agents that do the work:

- **GitHub** stays the system of record — issues, comments, pull requests, and workflow runs are the source of truth.
- **Faktorial** holds the rules, compliance specs, monitoring, and process, and dispatches the right agent for the job.
- **Agent runtimes** — Claude Code, Codex, and GitHub Copilot are named as the runtimes Faktorial can dispatch work to, all operating under the same rules and evidence requirements.

For observability, the site describes GitHub, CI, and local logs as the core signal sources, with Faktorial's own runtime state (workers, worktrees, issue logs, evidence) layered in, and optional integrations into OpenObserve, Datadog, and Grafana for teams that already live in metrics dashboards.

## Where it's a good fit

The public site is explicit that Faktorial is aimed at high-volume engineering work, not open-ended product discovery:

**Good fit**
- Structured GitHub issues with clear acceptance criteria
- Teams that need more delivery throughput without adding headcount
- Regulated or audit-heavy repositories that need a traceable evidence trail
- Recurring bugs, refactors, migrations, and test-coverage work

**Keep a human in the loop**
- Ambiguous product discovery without a clear outcome yet
- Architecture decisions without an accountable owner
- High-risk production changes without an established review path

## Service models

Faktorial is offered in two modes, both running the same pipeline and quality gates:

- **Your team + Faktorial** — your engineers keep priorities, architecture calls, and merge decisions; Faktorial handles scoped implementation work and opens PRs with tests and evidence attached.
- **Faktorial Managed** — Asynkron operates the delivery loop, with senior engineers supervising the agents and handling escalations, while you approve scope and merge decisions.

## Piloting Faktorial

The site recommends starting a pilot against a bounded set of real issues from your own repository rather than a staged demo, and measuring the outcomes engineering leaders care about: how many PRs were accepted or returned for rework, cycle time from pickup to review-ready PR, the evidence (tests, CI, traces) backing each delivery, and how often the system correctly escalated to a human instead of guessing.

## Background

Faktorial is built by the same Asynkron team behind [Proto.Actor](/ProtoActor/), and the public site attributes its delivery model to that distributed-systems background across finance, industrial automation, and real-time communications.
