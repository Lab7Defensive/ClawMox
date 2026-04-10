# ADR 0003: No arbitrary shell from chat

## Status
Accepted

## Context
A chat-driven agent is highly useful but prompt-shaped inputs should not map directly to arbitrary shell execution against infrastructure.

## Decision
Do not expose unrestricted shell execution from chat. Support only structured tools and approved jobs with bounded inputs.

## Consequences
### Positive
- lower infrastructure risk
- stronger auditability
- clearer policy enforcement
- easier reasoning about approvals

### Negative
- less flexibility for ad hoc emergency debugging
- more upfront work to define tool contracts

## Alternatives considered
- allow arbitrary shell with approval prompts, rejected for excessive blast radius
- hidden shell only for the agent, rejected because it weakens the intended safety model
