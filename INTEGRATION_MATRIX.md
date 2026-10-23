# Upstream Capability & Integration Matrix

Checked against public repository metadata and upstream README/license files on 2026-10-24. This is a technical first-pass, not legal advice. Re-check exact revision, model licenses and transitive dependencies before bundling source.

| Upstream | Actual role | Use in Automaton | Include source in our repo? | Status / main issue |
|---|---|---|---|---|
| [Upsonic](https://github.com/Upsonic/Upsonic) | Python agent framework with autonomous and traditional agent abstractions, tools and MCP | Optional Python worker behind an internal adapter after a prototype | Not initially; install/pin as separate dependency/worker | Planned. MIT license in upstream `LICENCE`; cross-language operations must be tested. |
| [OpenAI Agent Swarm](https://github.com/daveshap/OpenAI_Agent_Swarm) | Experimental hierarchical agent-swarm design | Translate supervisor/delegation concepts into our own typed workflow | No; repository is archived | Reference only. MIT license. Not the production runtime. |
| [RA.Aid](https://github.com/ai-christianson/RA.Aid) | Coding agent with research → planning → implementation; shell and file changes | Isolated coding worker returning patch, tests and logs | No; invoke as a pinned external tool | Planned. Apache-2.0. Shell execution is a real risk; no cowboy mode. |
| [Awesome AI Agents](https://github.com/e2b-dev/awesome-ai-agents) | Catalogue of agent products and projects | Maintain curated discovery records, not runtime calls | Do not copy the list | Catalogue only. Root license wasn't confirmed in this check. |
| [Heretic](https://github.com/p-e-w/heretic) | Model transformation/abliteration research tool | Optional, independent R&D experiment | No | Excluded from default runtime. AGPL-3.0. Compute-heavy and not a safety/security layer. |
| [Newspack Platform](https://github.com/OpenProducer/newspack-platform) | WordPress publishing platform with publisher-focused features | Possible future CMS deployment via documented APIs | Not until applicable license is confirmed | Blocked on license check; root LICENSE was not found at the checked path. Large separate platform. |
| [API Anything](https://github.com/goodnight000/api-anything) | Learns site operations and invokes saved operations through CLI/MCP/TypeScript | Optional connector for explicitly permitted sites | Install as pinned independent tool | Planned. MIT. Protect cookies/tokens; enforce host allowlist and read/write policy. |
| [AnythingMCP](https://github.com/HelpCode-ai/anythingmcp) | Self-hosted MCP gateway for REST/OpenAPI, SOAP, GraphQL, OData and SQL integrations | Optional external MCP endpoint/sidecar with a narrow allowlist | Do not vendor initially | Planned. AGPL-3.0. Review compliance before any modified/combined distribution. |
| [Edge0](https://github.com/Edge0-AI/Edge0) | Local sparse-MoE inference system with a Windows build path as well as platform-specific engines | Optional local text model behind TextModelProvider after performance tests | Separate experimental install | Not validated on this PC. Windows build needs C++/Vulkan toolchain, disk, memory and model assets; no guarantee with 4 GB VRAM/limited free RAM. Apache-2.0. |
| [Agent Reach](https://github.com/Panniantong/Agent-Reach) | Research CLI for multiple public and login-gated web platforms | Read-only adapter in `superproject/src/agent-reach.mjs` invokes only `agent-reach read <URL>` without a shell; workflow saves retrieved text and source URL | Separate installed CLI, not copied into the core | Adapter and stub tests exist. Live CLI/install/platform not yet verified. MIT. Login-gated features may need accounts/configuration; platform availability varies. |

## Order of implementation

1. Stabilize the existing TypeScript repo and CI.
2. Add no-network, no-key test fixtures for RSS → article artifact → source list.
3. Connect one model provider only after verifying the current free quota and terms.
4. Add Agent Reach as the first real external tool.
5. Integrate API Anything or AnythingMCP only when a specific workflow needs them.
6. Add RA.Aid only for coding tasks, in an isolated worktree with no secrets and reviewed diffs.
7. Evaluate Upsonic by prototype; don't run Upsonic and our workflow engine as competing schedulers.
8. Select one publishing target. Newspack remains blocked by license uncertainty; Ghost is a separate CMS alternative, not a source dependency.
9. Test Edge0 last; it is optional and not needed to finish the first product.
10. Keep Heretic outside the normal application.

## Adapter acceptance contract

Every adapter must include:
- dependency/version pin and upstream URL;
- license + attribution review;
- explicit inputs/outputs and schemas;
- host and tool allowlists;
- read-only vs write capability declaration;
- timeout, output cap and graceful failure;
- tests with success, malformed output, missing dependency, timeout and denied permission;
- measured CPU/RAM/disk and provider/API costs where relevant;
- uninstall/removal notes.

## Free-first limitations

- GitHub Actions schedule is best-effort and runners are ephemeral. Save meaningful outputs intentionally.
- Free AI provider quotas and terms may change; do not assume unlimited access or use a fallback that spends automatically.
- Public RSS and website access vary; obey source site terms and robots/rate limits.
- A free demo can pass tests without proving live integrations; only label an adapter "working" after running an actual integration test.


## Implementation update — 2026-10-24

The isolated `superproject/` prototype now has a zero-dependency RSS-fixture-to-draft pipeline and an optional Agent Reach CLI adapter. GitHub Actions run `superproject/test/` with stubbed Agent Reach calls; the CI test does not require Agent Reach to be installed or make real requests.

Current measured check: the initial standalone fixture pipeline passed 5 Node tests in GitHub Actions. The expanded Agent Reach adapter tests were committed after that run and are pending a new Actions result. Do not call the expanded integration verified until that run finishes successfully.

Next integrations, in order: (1) a provider-neutral article writer interface with an explicit per-run quota limit, (2) an Upsonic proof-of-concept as a separate optional worker, (3) RA.Aid in a disposable workspace with reviewed diffs, (4) API Anything or AnythingMCP only for a concrete use case. No additional frameworks should be installed just to increase the count of agents.


## Update — free-first AI article draft path

The standalone `superproject/` now includes `src/gemini.mjs`, an optional Gemini API adapter that uses Google's documented OpenAI-compatible endpoint. It is opt-in (`--ai`), has a fixed endpoint, a maximum of 2 model calls per process, a 22,000-character input cap, 1,800-token output cap, one bounded timeout and no retries or paid-provider fallback. Automated tests inject a fake `fetch`; CI does not call Google or need an API key.

The pipeline can combine `--agent-reach <HTTPS URL>` with `--ai` to create an AI-assisted Markdown draft from the recorded source text and URLs. Publishing remains off. Only the adapter protocol and output path are verified by tests; no live Gemini key or live Agent Reach CLI has been tested in CI.

Google currently documents a free tier for some Gemini models and publishes model-specific limits at https://ai.google.dev/gemini-api/docs/pricing. Quotas and terms can change. A code-level request cap is not a billing guarantee: the project/key's tier is configured outside this app. For a hard zero-cost constraint, do not enable paid billing, don't use a billed project key, and don't add paid fallback providers. Be aware Google states that free-tier content may be used to improve its products.

Current CI baseline before the Gemini additions: 12 tests passed. New Gemini and AI-draft tests have been added after that baseline and require a new Actions run before those additions are considered verified.
