# ClawMox A-to-Z Setup and User Guide

This guide is the plain-English, end-to-end walkthrough for setting up and understanding **ClawMox** as it exists right now.

It is written for:
- Mikey
- Lab7 operators
- future developers
- anyone who needs to stand up the project, understand the moving parts, and test it safely

## 1. What ClawMox is

ClawMox is a safe-control-plane project for:
- reading Proxmox infrastructure state
- eventually performing controlled Proxmox actions
- preparing and running infrastructure jobs through a separate runner
- enforcing approvals and reducing the blast radius of automation

The core design idea is:
- **API first for Proxmox actions**
- **runner mediated for infra automation tasks**
- **approval aware for risky operations**
- **audit friendly by default**

ClawMox is **not** intended to be a raw shell bot with unrestricted root access.

## 2. Current project status

ClawMox is currently a **working foundation / early implementation**, not a finished production platform yet.

What exists now:
- shared contracts and schemas
- a Proxmox MCP-style service foundation
- read-only Proxmox inventory and task/status coverage
- controlled write-path scaffolding for selected guest operations
- an infra runner foundation with job persistence and artifact logging
- environment examples and office-test setup docs

What is still incomplete:
- full production-ready runner execution profiles
- fully hardened real-world Proxmox write operations
- mature persistent service/API surface for external consumers
- broader automated test coverage

So the right mindset is:
- **safe lab validation first**
- **progressive hardening before production trust**

## 3. Repository layout

At a high level:

```text
ClawMox/
├── .env.example
├── README.md
├── docker-compose.yml
├── docs/
├── scripts/
├── services/
│   ├── shared/
│   ├── proxmox-mcp/
│   └── infra-runner/
└── tests/
```

### Important directories

#### `services/shared/`
Contains shared schemas, contract definitions, risk classification logic, correlation IDs, and approval helpers.

#### `services/proxmox-mcp/`
Contains the Proxmox-facing service logic.
This is where live reads and future controlled Proxmox actions live.

#### `services/infra-runner/`
Contains the job runner logic.
This is responsible for preparing and executing infra jobs in containerized flows.

#### `scripts/`
Contains practical bring-up documents:
- `office-test-checklist.md`
- `demo-flow.md`
- `build-plan.md`

#### `docs/`
Contains the original architecture, product, security, operations, and ADR documentation for the project.

## 4. Requirements before you start

Minimum expected requirements:
- Linux host or equivalent dev environment
- Node.js / npm available
- Docker installed and usable by the current user
- access to a Proxmox API endpoint
- a Proxmox API token with intentionally limited scope

Recommended:
- a lab or staging Proxmox environment first
- a dedicated secrets directory
- a backup/snapshot habit before enabling risky actions

## 5. First-time setup

### Step 1: clone the repo

```bash
git clone https://github.com/Lab7Defensive/ClawMox.git
cd ClawMox
```

### Step 2: install dependencies

```bash
npm install
```

### Step 3: create your environment file

Copy the example:

```bash
cp .env.example .env
```

Then edit `.env`.

## 6. Understanding the environment file

The repo includes a committed `.env.example` file.

Main variables:

### Proxmox connection

```env
PROXMOX_API_URL=https://proxmox.example.com:8006/api2/json
PROXMOX_API_TOKEN_ID=automation@pve!clawmox
PROXMOX_API_TOKEN_SECRET=replace-with-real-token-secret
```

What these do:
- `PROXMOX_API_URL` points to your Proxmox API
- `PROXMOX_API_TOKEN_ID` is the token identity
- `PROXMOX_API_TOKEN_SECRET` is the actual secret

Use a **limited scope** token, not an all-powerful catch-all token.

### Environment selector

```env
CLAWMOX_ENV=lab
```

Valid idea set:
- `lab`
- `staging`
- `production`

This affects how the system thinks about risk and environment intent.

### Runner configuration

```env
RUNNER_ALLOWED_REPOS=git@github.com:Lab7Defensive/terraform-infra.git
RUNNER_ALLOWED_IMAGES=ghcr.io/lab7defensive/clawmox-terraform:latest,ghcr.io/lab7defensive/clawmox-ansible:latest
RUNNER_TERRAFORM_IMAGE=ghcr.io/lab7defensive/clawmox-terraform:latest
RUNNER_ANSIBLE_IMAGE=ghcr.io/lab7defensive/clawmox-ansible:latest
RUNNER_ARTIFACTS_DIR=./artifacts
RUNNER_SECRETS_DIR=./secrets
```

What these do:
- restrict what repos the runner should accept
- define what images the runner should use
- define where artifacts are stored
- define where mounted secret files live

## 7. Secrets handling

ClawMox now expects a secrets directory pattern for the runner.

Create it like this:

```bash
mkdir -p ./secrets
chmod 700 ./secrets
```

Examples of things that may belong there:
- SSH keys
- Terraform credentials
- cloud credentials
- Ansible vault password material
- repo access material if needed

Do **not** commit anything in that directory.

## 8. Validate the project before running anything

Run all local checks:

```bash
npm run typecheck
npm run build
npm test
```

These should pass before you trust your setup.

## 9. What the two main services do

### Proxmox MCP service

This service is the Proxmox-facing side.

Right now it supports a useful read-only foundation, including:
- cluster status
- guest inventory
- storage inventory
- task inventory
- backup inventory
- guest detail/config shaping
- snapshot listing
- task status lookup

It also has early controlled write paths for actions like:
- guest start
- guest stop
- snapshot creation

But those should still be treated as **careful lab-first features**, not a blanket production action plane.

### Infra runner service

This is the separate automation runner.

Its job is to:
- accept infrastructure job requests
- classify and track them
- enforce allowlist and approval logic
- write artifacts
- persist job records
- execute placeholder Docker job profiles

This split is important because it avoids turning the Proxmox control plane into a raw all-purpose execution engine.

## 10. How to start the services

### Proxmox MCP

```bash
npm run dev:proxmox-mcp
```

Current expected behavior:
- starts the service entrypoint
- prints a ready message if config and code are healthy

### Infra runner

```bash
npm run dev:infra-runner
```

Current expected behavior:
- starts the runner entrypoint
- prints a ready message if config and code are healthy

## 11. What “working” means right now

At the current stage, these services are still more like:
- validated service modules and entrypoints
- logic foundations
- testable internal service behavior

not yet a polished public API product with a finished external UI or CLI surface.

So “working” right now means:
- the code builds
- the services initialize
- the configs load
- the internal service methods are ready for deeper integration/testing

## 12. Office test sequence

When you are back in the office, use this order:

1. prepare `.env`
2. prepare `./secrets`
3. run:
   - `npm install`
   - `npm run typecheck`
   - `npm run build`
   - `npm test`
4. confirm Docker works:
   - `docker version`
5. start Proxmox MCP
6. start infra runner
7. test read-only Proxmox flows first
8. test runner submission and artifact generation
9. test controlled writes only in lab/non-prod

Also read:
- `scripts/office-test-checklist.md`
- `scripts/demo-flow.md`

## 13. Runner artifacts and job persistence

The runner now writes persistent job state and artifacts.

What to expect:
- request artifacts
- execution logs
- persisted runner job state

Look under:
- `RUNNER_ARTIFACTS_DIR`

By default that means:
- `./artifacts`

This is useful for:
- auditability
- troubleshooting
- proving what job was prepared/executed

## 14. Approval behavior

ClawMox includes approval-aware logic.

Important idea:
- approval should match the exact job/action scope

This helps prevent someone from approving one action and accidentally authorizing a broader one.

Current implementation already includes scope hashing/binding utilities for that model.

## 15. What is safe to test first

Safest first tests:
- Proxmox cluster status reads
- guest inventory reads
- storage reads
- task list and task status reads
- backup inventory reads
- runner job submission with placeholder execution

Less safe tests:
- guest start/stop
- snapshot creation

Only do those after:
- confirming token scope
- confirming environment is lab/non-prod
- confirming approval path
- confirming rollback plan

## 16. Common gotchas

### `.env.example` confusion
The repo now tracks `.env.example` correctly.
Earlier it was accidentally ignored by `.gitignore`, but that is fixed.

### Local file vs GitHub mismatch
If something exists locally but not on GitHub, confirm it is not being ignored by `.gitignore`.

### Docker availability
The runner depends on Docker for its placeholder execution path.
If Docker is unavailable, execution tests will fail.

### Token scope
Do not use an unnecessarily broad Proxmox token for early testing.

### Assumptions about completeness
ClawMox is not “fully done” yet. It is a strong foundation, but still an evolving project.

## 17. Recommended operator rules

- start in `lab`
- use limited tokens
- use dedicated secrets storage
- keep artifacts for review
- snapshot before risky changes
- validate with read-only flows first
- avoid production write testing until you trust the controls

## 18. Recommended developer workflow

When making changes:

```bash
npm run typecheck
npm run build
npm test
```

Then review:
- changed env requirements
- artifact behavior
- approval logic
- any new read/write surface added

## 19. Important files to know

### Root
- `README.md`
- `.env.example`
- `docker-compose.yml`
- `package.json`

### Scripts
- `scripts/office-test-checklist.md`
- `scripts/demo-flow.md`
- `scripts/build-plan.md`

### Proxmox service
- `services/proxmox-mcp/src/client.ts`
- `services/proxmox-mcp/src/service.ts`
- `services/proxmox-mcp/src/normalizers.ts`

### Runner service
- `services/infra-runner/src/service.ts`
- `services/infra-runner/src/docker.ts`
- `services/infra-runner/src/store.ts`
- `services/infra-runner/src/artifacts.ts`

### Shared contracts
- `services/shared/src/index.ts`
- `services/shared/src/schemas/core.ts`
- `services/shared/src/utils/approval.ts`

## 20. Best next improvements

If you want ClawMox to move from strong foundation to more production-ready, the next best improvements are:

1. fuller public API/service surface
2. real production-safe Terraform and Ansible execution profiles
3. richer persistence and job history
4. broader tests, especially service-level tests
5. hardened real Proxmox write enforcement and rollback guardrails
6. stronger operator-facing documentation and maybe a simple UI/CLI

## 21. Final summary

If you want the shortest possible understanding:

- ClawMox is a safe Proxmox automation control plane in progress
- it separates Proxmox reads/writes from infra execution
- it is designed to be approval aware and audit friendly
- it is ready for controlled office/lab validation now
- it should still be treated as a lab-first foundation, not an unrestricted production autopilot

## 22. Quick start cheat sheet

```bash
git clone https://github.com/Lab7Defensive/ClawMox.git
cd ClawMox
cp .env.example .env
mkdir -p ./secrets
chmod 700 ./secrets
npm install
npm run typecheck
npm run build
npm test
npm run dev:proxmox-mcp
npm run dev:infra-runner
```

Then follow:
- `scripts/office-test-checklist.md`
- `scripts/demo-flow.md`
