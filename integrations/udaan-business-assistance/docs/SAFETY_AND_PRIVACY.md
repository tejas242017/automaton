# Safety, Privacy and Financial Controls

These are mandatory design requirements for any Udaan use of Automaton.

## No unrestricted autonomy

Initial agent role is **draft-only**. It may generate internal drafts, checklists, task suggestions and summaries. A named human must authorize consequential actions through a separate, auditable workflow.

Never give the agent unconditional access to email sending, government portals, banking, payment wallets, Meta ad spend, publishing permissions or a funding-decision system.

## Explicitly prohibited actions

- No sending or publishing without a human approval record.
- No government filing, signing, licence application or tax submission by the agent.
- No money movement, purchases, credit top-ups, bank changes or ad-spend changes.
- No public fundraising, investment acceptance, fund transfers, returns calculations represented as guarantees, or lending/funding approvals.
- No unsupervised fraud accusations, account closure, asset seizure or enforcement.
- No processing or storing of OTPs, passwords, private keys, full payment-card details or banking credentials.
- No self-replication or self-modification as part of a Udaan business workflow.
- No bulk unsolicited outreach, deceptive marketing, fake testimonials, unsupported claims, or scraped personal contact lists.

## Customer data minimization

- Use fictional data for tests.
- Do not paste PAN, Aadhaar, GST credentials, bank statements, signatures, identity documents or full customer records into model prompts unless an approved, reviewed data-processing design explicitly permits it.
- Use a secure document-storage system with access controls, retention rules, encryption and deletion procedures; this integration is not that storage system.
- Mask identifiers in logs; store only document status and a secure reference where needed.
- Obtain clear consent before sharing a customer's documents with a CA, CS, lawyer, registration agent or marketing provider.
- Restrict access by role and promptly revoke it when no longer needed.

## Human approval checklist

Before any external or consequential action, a human checks:
1. Correct customer and scope.
2. Current official requirements and source URL.
3. Final content, amounts, fees and recipient.
4. Customer's authorization and consent.
5. Correct third-party provider and conflicts of interest.
6. Evidence of approval and timestamp.
7. A way to stop or reverse the action where possible.

## Fraud prevention and audit

- Separate preparation, approval and execution roles for payments and filings.
- Keep append-only audit entries in an independently controlled system.
- Record source evidence, decision maker and reason for exceptions.
- Treat agent-generated fraud flags as leads for review, never proof.
- Pause disputed disbursements or work only according to clear contract/policy and human review.
- Make honest business failure distinct from suspected misconduct.

## Runtime security

The upstream Automaton has shell/file tools, access to external services, credit/wallet mechanics, scheduled jobs and self-modification capabilities. For Udaan:
- Do not connect a wallet with material funds or customer-owned funds.
- Disable or avoid tools capable of sending funds or purchasing credits.
- Use a least-privilege OS account and isolated sandbox.
- Set model/tool spend caps and alert thresholds.
- Keep secrets in a proper secret manager/environment, never skills or repository files.
- Pin and review versions; run tests and security review before upgrades.
- Do not assume a prompt alone is an enforceable security boundary.

## Legal/compliance boundary

Before launching any funding or investor-return product in India, obtain a written assessment from qualified counsel on the structure, solicitation, investor eligibility, custody of funds, return rights, securities/CIS/Companies Act and applicable RBI questions. Do not present this prototype as legally approved.
