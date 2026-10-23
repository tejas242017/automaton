# Superproject Core — Quick Start

This increment adds a provider-neutral task workflow, a conservative tool policy gate, and an optional OpenAI Chat Completions-compatible text provider. It does not vendor the upstream codebases into one executable. External agent runtimes, coding workers, MCP gateways, API adapters and the Newspack CMS remain separate integration milestones.

## Requirements

- Node.js 20 or newer
- pnpm 10 (repository package manager)
- No local language model required
- A provider API key only for live model calls; model/API usage may incur charges

## Install and verify

From a clean checkout:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
```

## Run the no-key mock demo

```bash
pnpm exec tsx scripts/superproject-demo.ts --mock Draft a research brief
```

The mock runner completes the research and planning stages, then pauses before implementation. To test the complete simulated path:

```bash
pnpm exec tsx scripts/superproject-demo.ts --mock --approve-implementation Draft a research brief
```

This mode makes no model calls and does not access the network, execute code, publish content, or spend money.

## Configure a live text provider

Set the environment variables in the same terminal where you will run the command. Do not put API keys in source files or commit them to Git.

**PowerShell (Windows):**

```powershell
$env:SUPERPROJECT_API_KEY = "YOUR_PROVIDER_API_KEY"
$env:SUPERPROJECT_MODEL = "YOUR_MODEL_NAME"
# Optional: set this only for an OpenAI-compatible endpoint.
$env:SUPERPROJECT_BASE_URL = "https://YOUR_PROVIDER_OPENAI_COMPATIBLE_ENDPOINT/"
pnpm exec tsx scripts/superproject-demo.ts Draft a research brief
```

**Bash:**

```bash
export SUPERPROJECT_API_KEY="YOUR_PROVIDER_API_KEY"
export SUPERPROJECT_MODEL="YOUR_MODEL_NAME"
# Optional:
export SUPERPROJECT_BASE_URL="https://YOUR_PROVIDER_OPENAI_COMPATIBLE_ENDPOINT/"
pnpm exec tsx scripts/superproject-demo.ts Draft a research brief
```

The provider defaults to the OpenAI SDK endpoint when `SUPERPROJECT_BASE_URL` is omitted. The selected endpoint must implement the OpenAI Chat Completions-compatible API. This adapter is text-only, does not expose model tool calls, uses a bounded timeout, and disables automatic SDK retries.

By default the live workflow performs two text completions (research and planning), then returns `needs_approval`. To also generate the implementation proposal, explicitly pass `--approve-implementation`:

```powershell
pnpm exec tsx scripts/superproject-demo.ts --approve-implementation Draft a research brief
```

This approval only permits the model to generate the implementation text; it does **not** run generated code or approve any real-world action.

## What's implemented

- Typed role/task model and dependency graph.
- Unknown/disabled tools denied by default.
- Exact-host allowlists for tool URL arguments.
- Approval requirement for mutating, external, financial and execution tools.
- Cycle/unknown dependency/task-limit checks.
- Audit events for task starts, completions, failures, blocked tasks and approval waits.
- OpenAI-compatible text provider interface and role-specific prompts.
- Deterministic mock execution and unit tests.

## Not implemented yet

Upsonic, RA.Aid, MCP, API Anything, AnythingMCP, GitHub, and Newspack are not yet connected as live adapters. This code does not execute shells, directly modify files, publish posts, browse the web, make payments, create wallets, or self-replicate. Add each integration in an isolated adapter with least-privilege credentials and integration tests before enabling it.
