# Glossary

## ADR
Architecture Decision Record. A durable document capturing an important technical decision and its rationale.

## Approval envelope
The request details that an operator approves for execution, ideally bound to the exact action later executed.

## ClawMox
The planned Lab7 project that gives OpenClaw a safe control plane for Proxmox and adjacent infrastructure automation.

## Correlation ID
A shared identifier that ties together one user request, approval event, service execution, logs, and artifacts.

## Infra runner
The dedicated service that executes bounded infrastructure jobs in short-lived Docker containers.

## MCP
Model Context Protocol. In this project, used loosely to describe a typed service boundary or tool-serving layer that OpenClaw can call.

## Proxmox MCP
The service responsible for exposing safe, typed Proxmox operations backed by the Proxmox API.

## Separated privileges
A Proxmox API token mode where the token requires explicit ACLs and its effective permissions are constrained rather than inheriting all user rights.

## UPID
The Proxmox task identifier returned for asynchronous operations.
