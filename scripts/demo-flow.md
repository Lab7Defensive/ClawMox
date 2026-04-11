# ClawMox Demo Flow

A safe first-pass flow for office testing.

## Read-only validation
1. Verify environment variables are loaded from `.env`
2. Confirm Proxmox cluster status works
3. Confirm guest inventory works
4. Confirm storage inventory works
5. Confirm task list and individual task status work
6. Confirm backup inventory works

## Runner validation
1. Submit a safe placeholder Terraform job
2. Check persisted job state in `artifacts/runner-jobs.json`
3. Execute the queued job
4. Review `request.json` and `execution.log` under `artifacts/<jobId>/`

## Controlled write validation
Only do this in lab/non-prod first.

1. Use a limited-scope Proxmox token
2. Validate approval scope binding matches the intended action
3. Test one guest start/stop action on a non-critical machine
4. Test one snapshot creation against a safe target
5. Poll task status until completion
