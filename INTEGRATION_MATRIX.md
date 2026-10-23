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
| [Agent Reach](https://github.com/Panniantong/Agent-Reach) | Research CLI for multiple public and login-gated web platforms | Read-only ResearchProvider returning source URLs and bounded excerpts | Separate pinned CLI, not copied into the core | Planned. MIT. Login-gated features may need accounts/configuration; platform availability varies. |

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
