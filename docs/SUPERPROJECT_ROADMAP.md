# Superproject Roadmap

## Milestone 0 — Make the existing project safe to extend
- [ ] Record baseline install/build/test commands.
- [ ] Add CI using the repository's actual package manager and scripts.
- [ ] Add secret scanning and dependency audit.
- [ ] Document threat model and workspace boundaries.

## Milestone 1 — Typed task engine
- [ ] Task model: id, goal, status, created_at, deadline, budget, workspace, output.
- [ ] DAG model: dependencies, retries, timeout and cancellation.
- [ ] Provider interface with deterministic mock provider.
- [ ] SQLite persistence or the repo's existing persistence layer.
- [ ] Audit events and structured logging.

## Milestone 2 — Permission system
- [ ] Tool manifest schema: JSON input schema, side-effect class, permissions, domains, timeouts, cost estimate.
- [ ] Policy evaluator: deny by default for unknown tools.
- [ ] Approval queue for shell, file writes, public posts, GitHub writes, deployments, and payments.
- [ ] Secret redaction and bounded tool output.

## Milestone 3 — Multi-agent orchestration
- [ ] Planner proposes task DAG.
- [ ] Executive orchestrator delegates least-privilege subtasks.
- [ ] Specialist agents: researcher, implementer, critic, editor, analyst.
- [ ] Independent validation and bounded retries.
- [ ] Trace view showing agent, tool, input summary, output summary, costs, approval state.

## Milestone 4 — Integrations
- [ ] Upsonic adapter (optional).
- [ ] RA.Aid worker (isolated workspace).
- [ ] MCP client.
- [ ] AnythingMCP endpoint.
- [ ] API Anything tool adapter.
- [ ] GitHub repository/PR adapter with minimum required permissions.
- [ ] Newspack/CMS adapter.

## Milestone 5 — First real workflow
- [ ] Research topic and gather permitted sources.
- [ ] Draft article and citations.
- [ ] Independent fact-check and editorial review.
- [ ] Generate a visual brief or use licensed assets.
- [ ] Require human approval before CMS/social publication.
- [ ] Track outcomes and costs.

## Release gate

A milestone is not done merely because its README or interfaces exist. Mark it complete only after implementation, tests, security checks, and clean-install verification have passed. Never label a planned integration as working.
