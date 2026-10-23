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

If you have installed Agent Reach separately, you can request a read-only page retrieval:

```powershell
npm run demo -- --agent-reach https://example.org/ "Explain the main points"
```

Replace the example URL with a public HTTPS page. Agent Reach must already be installed and configured; Automaton does not install it, bypass logins, or provide API keys. Retrieved text is saved as source material, not treated as verified facts. This command has not yet been tested against a live Agent Reach installation in CI.

## How the upstream powers fit

- Agent Reach: optional read-only CLI adapter is now implemented; it has automated stub tests, but live installation/platform compatibility is not yet verified.
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
