# Udaan Automation Roadmap

## Phase 0 — Safety and cost check (now)

- Do not install production secrets or customer data.
- Check the exact upstream/fork commit, required Node/pnpm versions, configured inference provider and current provider price.
- Confirm whether Automaton's Conway identity, hosted sandbox or credit top-up is required for the chosen mode.
- If a paid balance or USDC is required, stop until the owner explicitly approves a capped test budget.
- Review the skills before installing; use synthetic cases only.

**Exit gate:** owner understands the run cost and can stop the agent, and no customer data or live accounts are connected.

## Phase 1 — Sandbox test

- Install the Udaan skills into a disposable local/WSL or Linux Automaton profile.
- Keep all Udaan skills `auto-activate: false`; invoke them intentionally for each test.
- Test 20 synthetic requests: GST/Udyam questions, website enquiries, Meta marketing requests, missing information, urgent requests and requests that require a CA/CS/lawyer.
- Check all outputs are drafts, price/fee assumptions are not invented, sensitive data is not requested, and no external action is performed.
- Record quality, operator correction time and inference cost.

**Exit gate:** all prohibited-action tests pass and human reviewer accepts the output.

## Phase 2 — Customer-service MVP (separate application)

Build a lightweight Udaan case tracker with:
- case ID and customer contact preference
- service category, consent state and assigned human owner
- quotation line items and third-party charges
- checklist item/status and secure evidence reference (not the document itself)
- due dates, task status and audit history
- role-based access and retention/deletion controls

Do not store customer identity documents in Git, Automaton skills, prompts, or raw audit logs. The case tracker and secure document vault are not implemented by this documentation change.

**Exit gate:** authentication, authorization, backup/restore, deletion, data minimization and audit behaviour have been tested.

## Phase 3 — Limited internal integration

- Give the agent only sanitized case fields and approved template/rate-card data.
- Add typed tools for reading an assigned case and saving a draft checklist/response.
- Make write tools draft-only; use a separate approval service to authorize consequential actions.
- Verify authorization on the server, not by relying on the model prompt.
- Add rate limits, spend caps, duplicate protection, action idempotency, immutable audit events and a kill switch.
- Require a human to approve all customer communications, filings, purchases, marketing publication or ad spend.

**Exit gate:** automated tests prove unauthenticated users cannot access cases; agent cannot execute unapproved actions; prompt injection does not bypass server-side authorization.

## Phase 4 — Service delivery and revenue validation

- Launch affordable documentation coordination with prices and external charges itemized.
- Sell optional website, catalogue and Meta marketing services separately.
- Measure service delivery time, customer satisfaction, corrections/rework, gross margin and repeat purchases.
- Use human review for professional/regulatory work.

**Exit gate:** predictable delivery quality and positive contribution margin on services offered.

## Phase 5 — Future funding programme (not in this MVP)

Funding/investment functions require independent Indian regulatory advice and a compliant structure. Do not accept, pool, transfer or advertise public investments through this agent until approved. No promise of guaranteed returns, credit protection, or full capital recovery.

## Success metrics

- Correct triage rate (human-scored)
- Checklist accuracy and omission rate
- Percentage of outputs accepted with minor/no edits
- Average staff minutes per completed service
- Cost per reviewed draft
- Customer complaints and rework rate
- Number of unauthorized external actions (target: zero)
- Cost and status of each case, including third-party charges
