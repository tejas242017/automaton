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

Replace the example URL with a public HTTPS page. Agent Reach must already be installed and configured; Automaton does not install it, bypass logins, or provide API keys. Retrieved text is saved as source material, not treated as verified facts. The adapter is covered by mocked tests; a live Agent Reach installation has not yet been exercised.

### Optional AI-written article

The pipeline now supports an explicitly requested Gemini API call. The normal demo still needs no key and makes no network requests.

```powershell
$env:GEMINI_API_KEY = "YOUR_FREE_TIER_API_KEY"
$env:GEMINI_MODEL = "gemini-3.1-flash-lite"
npm run demo -- --ai "Explain the main findings from the selected sources"
```

For an Agent Reach page and AI draft together:

```powershell
npm run demo -- --agent-reach https://example.org/ --ai "Explain the main points"
```

Get a key at [Google AI Studio](https://aistudio.google.com/). The current [Gemini API pricing page](https://ai.google.dev/gemini-api/docs/pricing) lists a free tier for certain models including `gemini-3.1-flash-lite`, but quotas can change and the free tier may use submitted content to improve Google products. Use only content you are comfortable sending to that service.

**Zero-cost caveat:** code can cap requests and refuse fallbacks, but it cannot guarantee that your Google project is configured for free-tier billing. Keep billing disabled / use a free-tier project; do not enable paid billing if ₹0 is a hard requirement. On quota or HTTP errors, the workflow stops without retrying or switching to another provider.

## How the upstream powers fit

- Agent Reach: optional read-only CLI adapter is implemented and covered with stub tests; live installation/platform compatibility is not yet verified.
- Gemini: optional text provider and AI-draft path implemented with fixed endpoint, per-run call cap and no fallback; API behavior is tested with mocked HTTP responses, not with a live API key.
- Upsonic: optional Python agent-runtime sidecar after a prototype proves value.
- OpenAI Agent Swarm: hierarchical supervisor/delegation ideas implemented in the internal workflow.
- RA.Aid: separate, sandboxed coding worker; not installed or invoked by this prototype.
- Awesome AI Agents: discovery catalogue only.
- API Anything / AnythingMCP: optional tools with explicit host, credential and write controls.
- Edge0: optional local inference experiment; not required.
- Heretic: isolated research tool, not part of the runtime.
- Newspack: possible future CMS, license/hosting needs must be resolved first.
- Turnitout-Humanizer: evaluated as a document-quality reference only. Its checked root license is proprietary, so no source/rules/assets are copied. If needed later, implement our own DOCX/LaTeX-preserving edits and citation checks; no detector-evasion or plagiarism-concealment workflow.

Nothing in this prototype claims those adapters are already connected. Read `../SUPERPROJECT_PLAN.md` and `../INTEGRATION_MATRIX.md`.

### Document quality (future optional module)

Turnitout's published README describes document-format preservation and citation tools, but also advertises detector evasion. The repository's checked [LICENSE](https://github.com/AhmadHassan-BTed/Turnitout-Humanizer/blob/main/LICENSE) is proprietary, so we cannot copy its implementation without permission. We may independently implement transparent readability improvements, whitespace/Unicode cleanup, DOCX/LaTeX structural preservation and citation-format validation. We will not try to disguise plagiarism, bypass academic integrity checks, or strip provenance metadata to misrepresent authorship.

## Output

The pipeline writes files under `superproject/output/`. Keep that directory local unless you explicitly choose to commit generated content. The workflow does not publish posts or make network requests.
