import { InfraRunnerService } from './service.js';

async function main(): Promise<void> {
  const service = new InfraRunnerService();
  const status = await service.ping();
  console.log(`[clawmox/infra-runner] ${status}`);
}

main().catch((error) => {
  console.error('[clawmox/infra-runner] fatal', error);
  process.exitCode = 1;
});
