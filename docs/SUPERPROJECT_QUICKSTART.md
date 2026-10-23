# Superproject Core — Quick Start

The first increment adds a provider-neutral workflow foundation and policy gate to the existing TypeScript project. It is intentionally not an automatic merge of upstream repositories. External frameworks and publishing platforms remain adapters.

## Requirements

- Node.js 20 or newer
- pnpm 10 (repository package manager)
- No local model, API key, cloud account, or paid service required for the demo

## Install and verify

From a clean checkout:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
```

## Run the deterministic demo

```bash
pnpm exec tsx -e "import { runSuperprojectDemo } from './src/superproject/demo.ts'; console.log(JSON.stringify(await runSuperprojectDemo('Draft a research brief'), null, 2))"
```

The first run completes research and planning, then pauses before implementation because the task requires approval. To test the full simulated path, call:

```bash
pnpm exec tsx -e "import { runSuperprojectDemo } from './src/superproject/demo.ts'; console.log(JSON.stringify(await runSuperprojectDemo('Draft a research brief', true), null, 2))"
```

This demo uses a deterministic mock executor. It does not call a live model, publish content, access GitHub, execute a shell command, or spend money.

## What's implemented in this increment

- A typed task/role model for a small bounded workflow.
- Topological dependency validation, cycle/unknown-dependency checks, and a configurable task limit.
- A policy gate that denies unknown/disabled tools by default, applies exact-host network allowlists, and requires explicit approval for mutating/external/financial/execution tools.
- Audit events for workflow steps and approval pauses.
- Tests for the above behavior.

## Not implemented yet

The Upsonic, RA.Aid, MCP, API Anything, AnythingMCP and Newspack integrations are still planned adapters. A working integration requires connector code, configuration, least-privilege credentials where relevant, and integration tests. No claim is made that those upstream systems have been merged or that this core is production-ready.
