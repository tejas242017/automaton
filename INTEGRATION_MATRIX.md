# Upstream Capability & Integration Matrix

This matrix is a first-pass design review based on upstream READMEs checked on 2026-10-24. Before bundling implementation code, inspect each repo's LICENSE file, release activity, dependencies, security advisories, and transitive licenses.

| Project | Role in the superproject | How to use | Initial risk / caveat |
|---|---|---|---|
| [Upsonic](https://github.com/Upsonic/Upsonic) | Agent runtime and tool abstractions | Optional Python adapter/service; do not assume it fits the existing TypeScript runtime without a boundary | Cross-language service adds deployment and maintenance cost |
| [RA.Aid](https://github.com/ai-christianson/RA.Aid) | Research → planning → implementation for coding | Separate coding worker with sandboxed checkout/worktree | Can execute commands and edit code; avoid cowboy mode/unrestricted shell |
| [OpenAI Agent Swarm](https://github.com/daveshap/OpenAI_Agent_Swarm) | Hierarchical orchestration concepts | Extract role hierarchy and delegated-scope concepts, implement natively | Repository is archived; upstream README describes an experimental project |
| [Awesome AI Agents](https://github.com/e2b-dev/awesome-ai-agents) | Discovery catalogue | Maintain curated list with status/license/resource columns | It is a catalogue, not an installable runtime; don't import the whole list as dependencies |
| [Heretic](https://github.com/p-e-w/heretic) | Optional model-research tool | Independent, opt-in environment outside the app runtime | Model transformation has high compute/dependency demands and does not replace application security controls |
| [Newspack Platform](https://github.com/OpenProducer/newspack-platform) | Publishing/CMS and publisher monetization | Integrate across documented API/plugin boundary; run as separate WordPress platform | Large separate platform; don't vendor its entire tree into this project |
| [API Anything](https://github.com/goodnight000/api-anything) | Reusable site-operation learning and invocation | Optional CLI/MCP adapter; verify operation and hosts before publishing | Browser-derived request templates can involve cookies/tokens; protect credentials and review terms/permissions |
| [AnythingMCP](https://github.com/HelpCode-ai/anythingmcp) | MCP gateway for API and database connectors | Deploy as separately managed MCP endpoint or sidecar | Credentials and mutating connectors require scoped access; check current license before distribution |

## Recommended dependency order

1. Build internal interfaces and deterministic tests first.
2. Add one adapter at a time, pin versions and licenses.
3. Keep CMS and MCP gateway outside the core process.
4. Do not combine codebases until tests demonstrate a specific gain over the adapter approach.
5. For each adapter, document setup, permissions, costs, failure modes, and removal procedure.

## Source checks

- Upsonic README: https://raw.githubusercontent.com/Upsonic/Upsonic/master/README.md
- RA.Aid README: https://raw.githubusercontent.com/ai-christianson/RA.Aid/master/README.md
- Swarm README: https://raw.githubusercontent.com/daveshap/OpenAI_Agent_Swarm/main/README.md
- Awesome list README: https://raw.githubusercontent.com/e2b-dev/awesome-ai-agents/main/README.md
- Heretic README: https://raw.githubusercontent.com/p-e-w/heretic/master/README.md
- Newspack README: https://raw.githubusercontent.com/OpenProducer/newspack-platform/master/README.md
- API Anything README: https://raw.githubusercontent.com/goodnight000/api-anything/main/README.md
- AnythingMCP README: https://raw.githubusercontent.com/HelpCode-ai/anythingmcp/main/README.md


## License and redistribution gate (checked 2026-10-24)

The initial design deliberately uses adapters and references rather than copying upstream source trees.

- **Upsonic:** upstream `LICENCE` declares MIT. Preserve the notice if source is ever copied.
- **RA.Aid:** upstream `LICENSE` declares Apache-2.0. Preserve notices and include required attribution/NOTICE handling if applicable.
- **OpenAI_Agent_Swarm:** upstream `LICENSE` declares MIT, but the repository is archived; a license grant does not make the code actively maintained.
- **API Anything:** upstream `LICENSE` declares MIT.
- **Heretic:** upstream `LICENSE` declares AGPL-3.0. Keep it as an independent opt-in tool/service; do not copy its source into this project without reviewing the copyleft and distribution obligations.
- **AnythingMCP:** upstream `LICENSE` declares AGPL-3.0. Prefer connecting to it as a separately deployed service; obtain legal review before redistributing a combined/modified work.
- **awesome-ai-agents:** a root `LICENSE` was not found at the checked `main` path. Treat the catalogue as a discovery source; do not copy its curated text wholesale unless its applicable terms are confirmed.
- **Newspack Platform:** a root `LICENSE` was not found at the checked `master` path. Do not redistribute its code until the applicable license is confirmed from upstream maintainers or source-level notices.

These checks are a practical first pass, not legal advice. Licenses can change; re-check the exact commit/tag before vendoring, copying, or distributing upstream code.
