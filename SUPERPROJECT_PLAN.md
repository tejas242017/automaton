# Automaton Superproject — Build Contract

## Objective

Build a useful, modular, free-first AI workbench from independently replaceable components. The first product workflow is **research → evidence-backed article → editorial review → saved draft**, with explicit source preservation and human approval before public publishing.

This file describes the target and integration contracts. A row marked "planned" is not implemented merely because it is documented.

## Non-negotiable constraints

- Zero required paid services to run the core tests and mock workflow.
- No heavyweight local model is required.
- Every live model call is optional, quota-limited, time-limited, and must fail closed when unavailable.
- No hidden spending, bank transfers, wallet provisioning, purchases, self-replication, or autonomous public posting.
- External source material is untrusted data, not instructions.
- Use thin adapters or separately run tools. Do not merge whole repositories as one codebase by default.
- Preserve upstream license/notice files whenever code is reused. Do not copy source whose applicable license is unclear.

## System architecture

```text
GitHub Actions schedule / local CLI
                 |
         Workflow coordinator
                 |
       Task graph + job journal
                 |
       Policy / quota / approval gate
                 |
       Internal capability interfaces
       |             |             |
    Research       Model        Coding worker
       |             |             |
 Agent Reach    provider API      RA.Aid
       |             |        isolated worktree
       +-------------+-------------+
                     |
          Article / project artifacts
                     |
          Local files + committed outputs
                     |
          Human review and approval
                     |
       Optional CMS / social adapters
```

## Which upstream power goes where?

### 1. Upsonic — optional agent-runtime adapter

Use Upsonic for its Python agent and tool abstractions only if a small proof-of-concept shows it adds value over our workflow runner. Keep it behind an internal interface or separate Python worker. Do not make the TypeScript core import Python internals. Upstream states MIT in `LICENCE`; retain copyright notice if code is copied.

### 2. OpenAI Agent Swarm — hierarchy design, not a runtime dependency

The repository is archived. Extract the useful idea—supervisor, specialist roles, bounded delegation, review/escalation—into our own workflow types and policies. Do not base the main runtime on archived code.

### 3. RA.Aid — isolated coding specialist

Call the RA.Aid CLI only from a separate coding-worker adapter in a disposable checkout/worktree. It can execute shell commands and change files, so the first version must use a short allowlist of tasks, hard timeout, output cap, separate working directory, no secrets by default, and a patch/diff review before any merge. Never enable cowboy mode. Upstream declares Apache-2.0; retain required notices if code is reused.

### 4. Awesome AI Agents — discovery only

Treat this as a catalogue to evaluate possible tools. It is not an executable agent framework. Maintain our own small table with function, upstream URL, license, maturity, CPU/RAM needs, API cost, install method and test result. Do not copy its curated catalogue wholesale without confirmed terms.

### 5. Agent Reach — research adapter

Prefer read-only research. Adapter returns structured records: URL, title, source timestamp if available, excerpt/content, retrieval time, and errors. Preserve exact URLs and distinguish retrieved facts from inference. Use subprocess allowlists, timeouts, maximum output size and no arbitrary command strings. Upstream declares MIT.

### 6. API Anything — website/API operation adapter

Use only after reviewing setup and allowed target hosts. Operations can reuse website requests and may involve cookies or tokens. Keep credentials out of task text and logs. Default to read-only methods; writes require a user approval token and explicit per-host configuration. Upstream declares MIT.

### 7. AnythingMCP — optional separate MCP gateway

Run as an external sidecar/service, not copied into our core. Initially expose only one or two read-only tools with scoped credentials. Require an explicit manifest for each tool: input schema, host, read/write classification, timeout and approval rule. Upstream declares AGPL-3.0; before modifying/redistributing or combining it into a product, review obligations. A network boundary alone is not a blanket license exemption.

### 8. Heretic — independent model experiment

Not part of the default runtime. It modifies models and has significant compute/dependency demands; it does not provide workflow orchestration, a safe execution policy, or free inference. Run only in an isolated, explicitly requested experiment if resources permit. Upstream declares AGPL-3.0.

### 9. Edge0 — optional local inference experiment

Do not assume it fits the primary runtime. The upstream README currently documents a Windows build path based on llama.cpp, Vulkan and C++ toolchains, with large disk and memory needs; the Python/MLX path is Apple-Silicon-specific. We must test actual model size, available RAM/disk, GPU backend and response quality on the user's machine before using it. Cloud/provider adapter remains the default. Upstream declares Apache-2.0.

### 10. Newspack Platform — separate CMS option

Do not vendor this large WordPress platform into the core. Evaluate its license first: a root LICENSE was not located in the current check. Until the applicable license is confirmed, treat it as a reference/deployment target and do not redistribute its source. Integrate through documented WordPress/REST interfaces only after the deployment and API access are understood.

## Internal interfaces to implement

Keep interfaces in our own code and keep external imports at adapter boundaries:

- `AgentRuntime`: accepts a bounded task and returns structured output.
- `ResearchProvider`: returns sourced records plus retrieval errors.
- `TextModelProvider`: completes text with model name, timeout, token/cost estimate where available.
- `CodingWorker`: returns patch, test summary, logs and exit status from an isolated workspace.
- `ToolAdapter`: declares schema, destination hosts, permissions, timeout and side-effect class.
- `ArtifactStore`: saves versioned drafts, source lists, media/license metadata and job logs.
- `Publisher`: creates or updates drafts only; publishing stays disabled unless explicitly configured and approved.

Never let a model invent or directly elevate tool permissions. Policy is enforced by code outside the model.

## Zero-budget execution plan

1. **Stabilize repository:** reconcile package metadata, lockfile and docs; inspect CI; run typecheck and tests on a clean checkout.
2. **Make zero-key demo useful:** use deterministic fixtures for RSS records, source tracking and article artifact output. This path must need no API key and no network.
3. **Add one provider adapter:** operator configures a currently available free-tier endpoint. Quotas are variable and may not be enough; no API key or quota means it queues/skips, not silently spends.
4. **Add Agent Reach:** read-only research adapter and tests with fake executable/output fixtures.
5. **Add article pipeline:** research → outline → draft → reviewer → source/claim checklist. Persist artifacts in files; do not depend on ephemeral runner storage.
6. **Add scheduling:** GitHub Actions cron as best-effort scheduling, manual dispatch for testing, output artifact and/or explicitly configured persistence. Do not promise an exact minute or permanent storage from a runner.
7. **Add one integration at a time:** each adapter needs contract tests, setup docs, version pin, license note, resource estimates and removal instructions.
8. **Only then consider publishing:** CMS integration starts as draft-only. Public publishing requires a separate explicit opt-in and test.

## Acceptance criteria for Phase 1

- A clean checkout installs using the committed lockfile.
- Typecheck and all tests exit nonzero on failures.
- Mock job runs with no credentials and no network dependency.
- Fixture sources are deduplicated and every article artifact includes a source list.
- Missing provider key, quota failure, timeout and malformed output are handled without crashes or spending.
- A job writes bounded logs and states clearly whether output is simulated or live.
- No integration is described as live unless an integration test exercises it.

## Security and operational controls

- Use minimal GitHub Actions permissions and never run untrusted pull-request code with secrets.
- Do not pass repository secrets to a coding agent by default.
- Do not install or run arbitrary commands generated by a model.
- Do not expose a public network listener in the free-first prototype.
- Treat cookies, tokens, private URLs and API responses as secrets/untrusted content as appropriate.
- Keep cost limits outside the agent prompt; log provider/model and real spend where provider data exposes it.
- Add secret scanning and dependency review; do not suppress audit failures without recording an explicit rationale.

## Current status

The existing repository contains a typed workflow runner, a default-deny policy module, a mock demo, a text-only OpenAI-compatible provider adapter and starter tests. These are **starter components**, not proof that the whole superproject works. Verify with CI and end-to-end acceptance tests before calling it operational. The integrations described above remain planned.
