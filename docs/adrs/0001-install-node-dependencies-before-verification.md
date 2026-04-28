# ADR 0001: Install Node Dependencies Before Verification

Date: 2026-04-28

## Status

Accepted

## Context

Issue #43 reported that `npm run typecheck` failed because `tsc` was not found. Investigation on `origin/main` at `6f5f0a6379e8d8cc5aa5fa35b4b5bffac8f74ca7` showed that the repository already declared `typescript` in `devDependencies`, and `package-lock.json` included the TypeScript package and binary metadata.

The failure reproduced only when the worktree had no installed dependencies: `node_modules/.bin` did not exist and `npm run typecheck` exited with `sh: tsc: command not found`. After `npm ci`, the same `npm run typecheck` command passed without source changes.

Issue #48 repeated the same failure mode on latest `origin/main` at `00a13ed`: `npm run typecheck` initially failed with `tsc: command not found`, `npm ls typescript --depth=0` showed no installed package tree, and `npm run typecheck` passed after `npm ci`.

## Decision

For this Docusaurus documentation repository, Node-based verification commands must run after installing the locked dependency set. With the current `package-lock.json`, the canonical clean install command is `npm ci`.

Agents and automation should treat missing local npm binaries such as `tsc`, `docusaurus`, or other `node_modules/.bin` commands as an environment/setup failure until the command has been retried after `npm ci`.

## Consequences

- Typecheck and build failures are less likely to be misclassified as source defects when the worktree simply has no dependencies installed.
- Delivery agents should avoid code or package metadata changes when a clean dependency install makes the reported failure disappear.
- Orchestrator quality gates for Node scripts need an install step or an equivalent dependency cache restore before running npm scripts.
- `npm ci` may surface audit output, but vulnerability triage is a separate concern unless the requested work is security remediation.
