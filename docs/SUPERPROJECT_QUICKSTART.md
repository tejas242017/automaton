# Automaton Superproject — Quick Start

## What this repo currently is

This is the start of a modular superproject, not a bundle of all upstream repositories. The existing core has typed tasks/dependencies, approval status, a default-deny policy, a deterministic mock demo and a text-only OpenAI-compatible provider adapter. External integrations are not connected yet.

## Free test path

Requirements: Node.js 20+, pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
pnpm exec tsx scripts/superproject-demo.ts --mock Draft a research brief
```

The mock demo requires no API key and should not make model calls. If any command fails, fix that before adding integrations. CI results should be checked in the Actions tab before calling this verified.

## Optional live text provider

Live provider access is **not guaranteed to be free**. Configure only an endpoint/model whose current pricing and quota you have checked.

PowerShell:
```powershell
$env:SUPERPROJECT_API_KEY = "YOUR_KEY"
$env:SUPERPROJECT_MODEL = "YOUR_MODEL"
# Only for a compatible non-default endpoint:
$env:SUPERPROJECT_BASE_URL = "https://YOUR_COMPATIBLE_ENDPOINT/"
pnpm exec tsx scripts/superproject-demo.ts Draft a research brief
```

Never hardcode the key or commit it. The live adapter is text-only: it cannot browse, execute shell commands, publish content, or access GitHub by itself.

## Integrations

Read `SUPERPROJECT_PLAN.md` and `INTEGRATION_MATRIX.md` before enabling upstream tools. Planned does not mean integrated. Agent Reach should be the first research adapter. Coding tools require an isolated checkout, no secrets, timeouts and human review of diffs. AnythingMCP and Heretic are AGPL-3.0 projects; do not vendor their source without reviewing obligations. Newspack's applicable root license could not be confirmed in the current check, so do not redistribute its code.

## First end-to-end target

Input topic/RSS fixture → deduplicated sources → article draft → fact/source checklist → saved Markdown and JSON run log → approval state. The first run must be possible without credentials from fixture data. A live model path comes later, subject to free quota. Public publishing is out of scope until explicit approval and CMS tests exist.

## Free-first operating principles

- No paid fallback by default.
- No API key or quota: queue/skip model tasks and explain why.
- Store outputs intentionally; GitHub Actions runners are temporary.
- Cron is best-effort, not exact-minute scheduling.
- Never claim a real source was checked when running a fixture/mock path.
