import { ProxmoxMcpService } from './service.js';

async function main(): Promise<void> {
  const service = new ProxmoxMcpService();
  const status = await service.ping();
  console.log(`[clawmox/proxmox-mcp] ${status}`);
}

main().catch((error) => {
  console.error('[clawmox/proxmox-mcp] fatal', error);
  process.exitCode = 1;
});
