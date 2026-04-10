# Runbook: Incident Response

## Purpose

Provide a minimal incident workflow when ClawMox, the MCP, the runner, or an executed change causes or contributes to operational problems.

## Triggers

- failed production change
- unauthorized-looking action
- token or secret leakage suspicion
- runner compromise suspicion
- unexpected Proxmox mutation or outage

## Initial response

1. Stop further risky automation.
2. Identify correlation IDs, affected jobs, and timestamps.
3. Determine whether issue is control-plane, runner, or target-side.
4. Preserve logs and artifacts.

## If credential compromise is suspected

1. Revoke affected API tokens or SSH credentials.
2. Rotate secrets.
3. Review recent actions using audit history.
4. Re-enable access only after cause is understood.

## If bad change was applied

1. Identify exact action and target.
2. Determine rollback or forward-fix path.
3. Check for snapshots, backups, or prior plan artifacts.
4. Execute remediation with explicit approval.

## Post-incident

- write summary
- identify control gaps
- create ADR or follow-up hardening tasks if needed
