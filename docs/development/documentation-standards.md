# Documentation Standards

## Docs-as-code principles

- docs live in git
- docs change with design and implementation
- durable decisions go in ADRs
- runbooks reflect reality, not aspiration

## Writing rules

- write concise, plain English
- prefer explicit lists over vague prose
- separate current state, target state, and future ideas
- mark assumptions clearly

## Required updates

Update docs when:
- a new service boundary is introduced
- auth or permissions change
- approval behavior changes
- a major tool contract changes
- a new runbook is needed

## Diagram guidance

Prefer text-first diagrams using Mermaid or similar only when they improve clarity. Keep the markdown readable even without rendering.

## Review guidance

Before calling a doc complete, verify:
- terms are consistent
- links resolve
- policies match architecture
- no secrets are present
