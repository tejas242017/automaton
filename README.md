# Automaton Superproject

**A free-first, modular AI workbench** built around a small workflow core and replaceable adapters for research, coding, APIs, model providers and publishing.

This repository is being shaped into a unified project, not a blind copy-and-paste of unrelated codebases. Upstream capabilities remain separate tools until an adapter is implemented and tested.

## Status — read before use

| Capability | Status |
|---|---|
| Typed workflow graph, approval state, audit events | Starter code exists; verify with local CI |
| Default-deny tool policy | Starter code exists; verify with local CI |
| No-key mock demo | Starter code exists; verify with local CI |
| OpenAI-compatible text-only provider | Code exists; live endpoint call not verified |
| Agent Reach research adapter | Planned; not integrated |
| Upsonic agent runtime adapter | Planned; not integrated |
| RA.Aid isolated coding worker | Planned; not integrated |
| API Anything / AnythingMCP | Planned; not integrated |
| Publisher / CMS / LinkedIn integration | Not integrated |
| Edge0 local inference | Experimental; not validated on this machine |
| Revenue automation | Not implemented or guaranteed |

**Verification warning:** as of the latest repository check, GitHub Actions reported zero workflow runs. Do not treat the current tests or end-to-end runtime as passing until Actions or a clean local checkout confirms it.

## What we are combining

- **Upsonic** — optional Python agent worker after a proof of concept.
- **OpenAI Agent Swarm** — hierarchical supervisor/delegation ideas; archived, so not our runtime dependency.
- **RA.Aid** — specialized coding worker in an isolated checkout, returning a reviewed diff.
- **Awesome AI Agents** — project discovery catalogue only, not executable software.
- **Agent Reach** — first planned research adapter with source URL preservation.
- **API Anything** — optional website-operation adapter with host and credential controls.
- **AnythingMCP** — optional external MCP gateway; AGPL-3.0, so review obligations before modifying/redistributing.
- **Heretic** — isolated model-research experiment, not needed in the normal app; AGPL-3.0.
- **Edge0** — optional local inference experiment; performance and Windows toolchain/model requirements must be measured first.
- **Newspack Platform** — separate possible CMS; do not redistribute until its applicable license is confirmed.

Details: [Build contract](SUPERPROJECT_PLAN.md) · [Integration matrix](INTEGRATION_MATRIX.md) · [Quickstart](docs/SUPERPROJECT_QUICKSTART.md).

## First product target

A no-credentials fixture workflow that:
1. reads RSS fixtures/public source records;
2. normalizes and deduplicates URLs;
3. generates an article draft from fixture text or a configured model;
4. produces a source/claim checklist;
5. saves Markdown, JSON source list and run logs;
6. pauses for human approval before publication.

Only after this works will we connect real research tools and then one publication target. No paid fallback should be enabled automatically.

## Run current starter (after verification)

Requirements: Node.js 20+ and pnpm 10.

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm test
pnpm exec tsx scripts/superproject-demo.ts --mock Draft a research brief
```

If a command fails, resolve it before adding integrations. The mock demo is simulated and does not prove external tools work.

## Safety and costs

- No bank transfers, wallet creation, purchases, paid provisioning, self-replication or unrestricted shell access in the superproject core.
- Live model APIs may have quotas and costs. Free tiers are variable; the core must queue/skip when unavailable and never silently switch to paid usage.
- GitHub Actions scheduling is best-effort and runners are temporary; outputs require deliberate persistence.
- Do not give credentials to coding agents by default.
- Tool writes and public publishing require explicit approval.
- Maintain upstream copyright/license notices for any reused code; source catalogue entries are not permission to copy catalogue content.

## Upstream links

[Upsonic](https://github.com/Upsonic/Upsonic) · [OpenAI Agent Swarm](https://github.com/daveshap/OpenAI_Agent_Swarm) · [RA.Aid](https://github.com/ai-christianson/RA.Aid) · [Awesome AI Agents](https://github.com/e2b-dev/awesome-ai-agents) · [Heretic](https://github.com/p-e-w/heretic) · [Newspack Platform](https://github.com/OpenProducer/newspack-platform) · [API Anything](https://github.com/goodnight000/api-anything) · [AnythingMCP](https://github.com/HelpCode-ai/anythingmcp) · [Edge0](https://github.com/Edge0-AI/Edge0) · [Agent Reach](https://github.com/Panniantong/Agent-Reach).
