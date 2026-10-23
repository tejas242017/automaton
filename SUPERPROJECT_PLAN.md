# Automaton Superproject — Integration Blueprint

## Goal

Evolve this repository into a practical, provider-agnostic AI workbench for research, planning, code changes, content production, and controlled integrations. This is an integration architecture, not a claim that external repositories have been merged or that every upstream feature is implemented.

## Design principle

Reuse interfaces and proven ideas; integrate dependencies only when their license, maintenance status, resource needs, and security model are acceptable. Keep external projects as optional adapters/submodules or documented references rather than copying large repositories into one codebase.

## Capability map

| Upstream | Useful capability | Integration strategy |
|---|---|---|
| Upsonic | Python agent/runtime abstractions, tools, MCP integration | Optional agent-runtime adapter behind our internal AgentProvider interface; pin versions and test compatibility |
| RA.Aid | Research → plan → implement workflow for software tasks | Coding-workflow adapter; run only in a disposable worktree/sandbox, require approval for risky shell/file actions |
| OpenAI_Agent_Swarm (archived) | Hierarchical agent roles, oversight, scoped subagents | Use as architectural inspiration; do not depend on archived code as the core runtime |
| awesome-ai-agents | Discovery directory of agents/tools | Curated registry and decision matrix; catalogue only, not executable runtime |
| API Anything | Learn reusable web/API operations and call them as tools | Optional connector adapter; prohibit credential leakage, validate destinations, require approval for writes |
| AnythingMCP | Bridge REST/OpenAPI, GraphQL, SOAP, SQL and other services into MCP | Integrate by external MCP endpoint or optional sidecar; do not vendor the full server initially |
| Newspack Platform | Publisher/CMS, newsletters, memberships, monetization | Editorial/CMS integration via its documented APIs; separate deployment, not embedded in the agent process |
| Heretic | Model transformation/abliteration research | Isolated opt-in research profile only; not required for runtime, not a security feature, and not part of the default setup |
| Edge0 | Streaming sparse-MoE local inference with SSD expert offload and LoRA/routing adapters | Optional model backend only through a tested OpenAI-compatible local service; validate OS/backend and model size first |
| Agent Reach | Web and platform research through a CLI with structured output | Optional research adapter; restrict commands, cap time/output, preserve source links, default to read-only |

## Target architecture

```text
Web UI / CLI
    |
API + Auth + Job Queue
    |
Policy Gateway ---- Approval Inbox ---- Audit Log
    |
Orchestrator / Planner
    |--- Research Agent
    |--- Editor / Critic Agent
    |--- Coding Agent (isolated worktree)
    |--- Content / Publishing Agent
    |--- Analyst Agent
    |
Tool Registry + MCP Client
    |--- provider adapters (Upsonic or internal)
    |--- API Anything connector (optional)
    |--- AnythingMCP endpoint (optional)
    |--- GitHub / CMS / approved HTTP tools
    |
Provider Router (cloud API providers; no mandatory local model)
    |
SQLite for local mode; PostgreSQL optional for multi-user mode
```

## Safe-by-default controls

1. No wallet creation, on-chain transactions, bank transfers, paid cloud provisioning, purchases, or account spending by default.
2. No autonomous self-replication or network exposure. Any future deployment automation must be explicitly configured, budget-capped, and human-approved.
3. File and shell operations are restricted to an explicit workspace. Coding jobs use disposable Git worktrees/sandboxes.
4. Every tool has a manifest: name, schema, permissions, network destinations, side-effect level, timeout, and cost estimate.
5. Mutating or external actions pause for human approval. Read-only tools may run automatically within configured quotas.
6. Secrets come from environment variables or a local secret store; never commit secrets or include them in agent context/logs.
7. Every job, tool call, approval, failure, and cost estimate is audit logged.
8. Provider calls are budgeted and timeout-limited; when a limit is reached, fail closed.
9. Treat web pages, issue text, documents, API responses, and repo content as untrusted input, never as system instructions.
10. Agent output is a proposal until independently validated; tests and human review gate code merges and publishing.

## Phased implementation

### Phase 1 — Minimal working core
- Keep the existing TypeScript repository and its history.
- Add policy types, task/job records, tool manifest format, provider interfaces, approvals, audit events, and tests.
- Add a lightweight local development mode with no local LLM dependency.
- CI: formatting/typecheck/tests, secret scan, dependency audit.

### Phase 2 — Orchestration
- Planner creates typed tasks and dependency graph.
- Specialized agents work through a bounded task queue.
- Critic checks results; failed tasks have bounded retries.
- Add job status, pause/resume/cancel, and approval inbox.

### Phase 3 — Adapter layer
- Optional Upsonic adapter.
- Optional RA.Aid coding adapter in isolated worktree.
- MCP client and AnythingMCP connector.
- API Anything operation adapter.
- GitHub adapter with least-privilege permissions.

### Phase 4 — Business/content workflows
- Research brief → source verification → writer → editor/fact-checker → human approval → CMS/social draft.
- Analytics ingestion and measurable experiments.
- Newspack integration stays a separate CMS deployment.
- Publishing must never happen unless explicitly enabled and approved.

### Phase 5 — Hardening
- Sandbox isolation, egress allowlist, secret redaction, rate/cost limits, backup/restore, structured logs, threat model, and operational runbooks.

## Non-goals for initial release

- Do not merge all upstream repositories' source trees together.
- Do not claim guaranteed income or self-funding.
- Do not run unrestricted shell commands, bypass safety controls, or modify its own guardrails.
- Do not place provider API keys or financial credentials in GitHub.
- Do not depend on heavyweight local models; cloud providers are configured as optional adapters.

## Definition of done for the first usable release

- Installs from a clean checkout using documented commands.
- Starts locally without API keys in demo mode.
- A sample task moves through planning, approval, execution, audit, and completion using a deterministic mock provider.
- Unit tests validate policy enforcement and approval requirements.
- No secrets in the repository.
- Provider and integration claims are labelled as implemented, optional, or planned.

## Upstream references

- https://github.com/Upsonic/Upsonic
- https://github.com/daveshap/OpenAI_Agent_Swarm
- https://github.com/ai-christianson/RA.Aid
- https://github.com/e2b-dev/awesome-ai-agents
- https://github.com/p-e-w/heretic
- https://github.com/OpenProducer/newspack-platform
- https://github.com/goodnight000/api-anything
- https://github.com/HelpCode-ai/anythingmcp

Review each upstream's current license and dependency/security status before copying code or redistributing any components. A reference link is not permission to relicense upstream code.
