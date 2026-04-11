# ClawMox Office Test Checklist

Use this when you are back at the office and ready to test ClawMox against the real environment.

## 1. Clone and install
```bash
git clone https://github.com/Lab7Defensive/ClawMox.git
cd ClawMox
npm install
```

## 2. Prepare environment
Copy the example file:
```bash
cp .env.example .env
```

Fill in at minimum:
- `PROXMOX_API_URL`
- `PROXMOX_API_TOKEN_ID`
- `PROXMOX_API_TOKEN_SECRET`
- `CLAWMOX_ENV`
- `RUNNER_ALLOWED_REPOS`
- `RUNNER_TERRAFORM_IMAGE`
- `RUNNER_ANSIBLE_IMAGE`
- `RUNNER_ARTIFACTS_DIR`
- `RUNNER_SECRETS_DIR`

## 3. Prepare secrets directory
Create the secrets mount path used by the runner:
```bash
mkdir -p ./secrets
chmod 700 ./secrets
```

Place any required credentials there as files, for example:
- SSH keys
- Terraform backend creds
- cloud provider credentials
- Ansible vault material

Do not commit these files.

## 4. Validate build
```bash
npm run typecheck
npm run build
npm test
```

## 5. Dry-run services
```bash
npm run dev:proxmox-mcp
npm run dev:infra-runner
```

## 6. Docker prerequisites
Make sure Docker is installed and usable by the current user:
```bash
docker version
```

## 7. First real tests
Recommended order:
1. Proxmox read-only cluster status
2. guest inventory
3. storage inventory
4. task inventory
5. backup inventory
6. runner job submission
7. runner execution against safe placeholder profile

## 8. Before enabling live writes
Confirm:
- approval path is understood
- token scope is limited
- target environment is correct
- backup/snapshot strategy is clear
- test only in lab or non-production first
