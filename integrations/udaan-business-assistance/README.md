# Udaan Business Assistance Integration

This integration blueprint adapts the Automaton runtime for Udaan's affordable business-assistance service. It is documentation and prompt skills, not a production customer-management application.

## Why use Automaton?

The runtime already supports skills written as `SKILL.md`, scheduled heartbeat tasks, a tool-based agent loop, policy rules, spend tracking, and audit/versioning features. These may help with internal drafting and recurring reminders.

Repository reviewed: [tejas242017/automaton](https://github.com/tejas242017/automaton). The repository is an MIT-licensed fork of Conway-Research/automaton. Keep the existing LICENSE and upstream attribution.

## Important cost and control caveat

Automaton is not automatically a zero-cost, local-only automation. Its current runtime integrates with Conway infrastructure, API keys, a wallet/credit balance and paid inference. Its startup path attempts a small USDC credit top-up. Confirm provider requirements and costs before running it; do not connect a business wallet or fund it for the first prototype.

**Recommended first use:** copy the skills in this integration to a sandbox Automaton skills directory and allow it to create internal drafts/checklists only. Use fictional test data.

## Allowed initial automation

- Classify incoming business enquiries into service categories.
- Generate document checklists from approved Udaan templates.
- Draft customer responses, quotations and task lists for human review.
- Draft website copy, social content and Meta campaign plans.
- Produce weekly summaries from sanitized tracker data.
- Remind staff about follow-ups and missing non-sensitive documents, if a human-managed task tracker is connected.

## Human approval required

The agent must not independently:
- Submit government or statutory forms.
- Give legal, tax or investment advice as a qualified professional.
- Access or retain customer OTPs, passwords, bank credentials or private keys.
- Pay invoices, top up credits, transfer money or start ad spend.
- Publish customer messages or marketing campaigns.
- Promise business registration, funding, investor returns or insurance coverage.
- Approve or reject funding, decide fraud, enforce security or take recovery action.
- Collect public investment or execute a funding transaction.

## Integration files

- `docs/OPERATING_MODEL.md`: service workflow and role split.
- `docs/SAFETY_AND_PRIVACY.md`: mandatory controls.
- `skills/udaan-intake/SKILL.md`: intake classification and draft response.
- `skills/udaan-documents/SKILL.md`: documentation assistance.
- `skills/udaan-growth-services/SKILL.md`: website and marketing support.
- `skills/udaan-operations/SKILL.md`: safe internal operations and reporting.

## Installation (manual sandbox only)

1. Review each skill before enabling it.
2. Copy the desired skill directory into the runtime's configured skills directory (default shown in the upstream README/config is under `~/.automaton/skills`).
3. Use a test profile and fictional data.
4. Keep external actions disabled and require an explicit human approval outside the agent.
5. Measure task accuracy, review time and inference cost before expanding.

This integration does not include CRM persistence, secure document storage, authentication, official-portal integrations, payment APIs, Meta API credentials or deployment. Those require separate implementation and security review.
