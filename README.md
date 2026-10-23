# Automaton Superproject

**A free-first, modular AI workbench** built around a small workflow core and replaceable adapters for research, coding, APIs, model providers and publishing.

## Current structure

- `superproject/` — isolated zero-dependency prototype for RSS fixture → deduplicated source records → Markdown draft → source JSON → run report. It does not make network requests, call a model, or publish.
- Root `src/`, `packages/` and existing runtime files — inherited Conway Automaton code retained in repository history. **Do not run its wallet/funding/self-replication runtime as part of the free-first superproject.** The new prototype is isolated under `superproject/`.

## First working milestone

Open [superproject/README.md](superproject/README.md) and run:

```powershell
cd superproject
npm test
npm run demo
```

Requirements: Node.js 20+. No API keys, npm packages, GPU, server, paid service or local model required.

This first version is intentionally deterministic. It proves that the pipeline preserves source URLs, deduplicates tracking variants, writes an article scaffold and records that nothing was published. It is not yet AI-written and uses a checked-in fixture rather than live research.

## Upstream powers we plan to connect

- [Upsonic](https://github.com/Upsonic/Upsonic) — optional Python agent worker after a proof of concept.
- [OpenAI Agent Swarm](https://github.com/daveshap/OpenAI_Agent_Swarm) — hierarchical supervisor and scoped delegation design ideas; repository is archived.
- [RA.Aid](https://github.com/ai-christianson/RA.Aid) — isolated coding worker that returns a patch and test logs.
- [Awesome AI Agents](https://github.com/e2b-dev/awesome-ai-agents) — discovery catalogue only.
- [Agent Reach](https://github.com/Panniantong/Agent-Reach) — first planned read-only research adapter.
- [API Anything](https://github.com/goodnight000/api-anything) — optional web-operation adapter with host and credential controls.
- [AnythingMCP](https://github.com/HelpCode-ai/anythingmcp) — optional separate MCP gateway; AGPL-3.0.
- [Heretic](https://github.com/p-e-w/heretic) — isolated model-research tool; AGPL-3.0.
- [Edge0](https://github.com/Edge0-AI/Edge0) — optional local inference experiment, not required.
- [Newspack Platform](https://github.com/OpenProducer/newspack-platform) — possible CMS deployment; applicable source license must be confirmed before redistribution.

The tools above are **not integrated yet**. Use the [Build Contract](SUPERPROJECT_PLAN.md), [Integration Matrix](INTEGRATION_MATRIX.md), and [Quickstart](docs/SUPERPROJECT_QUICKSTART.md) to track the target and status.

## Costs and approvals

- No paid fallback by default; unavailable API/quota means skip or queue, never silently spend.
- Live AI quotas and terms must be checked before use.
- Public publishing, file mutation outside the prototype output folder, and external write actions require explicit approval.
- GitHub Actions schedules are best-effort; runner storage is temporary.
- No claims of autonomous revenue or guaranteed output quality.

