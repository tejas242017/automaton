# Automaton Superproject (isolated prototype)

This directory is the **new, standalone superproject prototype**. It is deliberately isolated from the original Conway Automaton runtime in the repository root. Do not run the root `src/index.ts --run` path for this prototype.

## Zero-cost first run

Requires Node.js 20+. No npm packages, API keys, cloud service, GPU, or local model are required for the deterministic fixture demo.

```powershell
cd superproject
npm test
npm run demo
```

The demo consumes a checked-in RSS fixture, normalizes/deduplicates links, creates a Markdown draft and source list, and prints the output location. It uses a transparent template, not an AI model. That distinction is intentional so we can prove the data flow before connecting external providers.

## How the upstream powers fit

- Agent Reach: first planned read-only research adapter.
- Upsonic: optional Python agent-runtime sidecar after a prototype proves value.
- OpenAI Agent Swarm: hierarchical supervisor/delegation ideas implemented in the internal workflow.
- RA.Aid: separate, sandboxed coding worker; not installed or invoked by this prototype.
- Awesome AI Agents: discovery catalogue only.
- API Anything / AnythingMCP: optional tools with explicit host, credential and write controls.
- Edge0: optional local inference experiment; not required.
- Heretic: isolated research tool, not part of the runtime.
- Newspack: possible future CMS, license/hosting needs must be resolved first.

Nothing in this prototype claims those adapters are already connected. Read `../SUPERPROJECT_PLAN.md` and `../INTEGRATION_MATRIX.md`.

## Output

The pipeline writes files under `superproject/output/`. Keep that directory local unless you explicitly choose to commit generated content. The workflow does not publish posts or make network requests.
