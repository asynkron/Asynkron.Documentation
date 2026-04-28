# Node Verification

## Install dependencies before npm-script verification

Run the repository's locked dependency install before treating npm-script failures as source defects. In this repo, `package-lock.json` is present, so use `npm ci` before commands such as `npm run typecheck` or `npm run build` when dependencies have not already been installed or restored.

If a script fails because a local binary is missing, for example `tsc: command not found`, first check whether `node_modules/.bin` exists and retry after `npm ci`.

Why: Issues #43 and #48 both reported `npm run typecheck` failing with `tsc: command not found`, but the source already declared `typescript` in `devDependencies`. In both incidents, the failure was caused by running verification in a worktree without installed npm dependencies; after `npm ci`, `npm run typecheck` passed with no code changes.

Incidents: #43 and #48, 2026-04-28.
