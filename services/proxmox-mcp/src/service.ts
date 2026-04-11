import {
  classifyRisk,
  clusterStatusRequestSchema,
  createCorrelationId,
  requiresApproval,
  serviceResponseSchema
} from '../../shared/src/index.js';
import { ProxmoxApiClient } from './client.js';
import { loadProxmoxConfig } from './config.js';
import {
  normalizeBackups,
  normalizeClusterStatus,
  normalizeGuestConfig,
  normalizeGuests,
  normalizeNodeInventory,
  normalizeSnapshots,
  normalizeStorage,
  normalizeTasks
} from './normalizers.js';

export class ProxmoxMcpService {
  private readonly config = loadProxmoxConfig();
  private readonly client = new ProxmoxApiClient(this.config);

  async getClusterStatus(input: Record<string, unknown> = {}) {
    const parsed = clusterStatusRequestSchema.parse({
      correlationId: createCorrelationId('cluster'),
      ...input
    });

    const [clusterStatus, nodes] = await Promise.all([
      this.client.getClusterStatus(),
      this.client.listNodes()
    ]);

    const statusByNode = Object.fromEntries(
      await Promise.all(
        nodes.map(async (node) => [node.node, await this.client.getNodeStatus(node.node)] as const)
      )
    );

    const risk = classifyRisk('get_cluster_status');
    const approvalRequired = requiresApproval(risk, parsed.environment);

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: 'Retrieved live read-only Proxmox cluster status.',
      correlationId: parsed.correlationId,
      approvalState: approvalRequired ? 'required' : 'not_required',
      details: {
        cluster: normalizeClusterStatus(clusterStatus, nodes),
        nodes: normalizeNodeInventory(nodes, statusByNode),
        environment: parsed.environment,
        live: true
      }
    });
  }

  async listGuests(environment: 'lab' | 'staging' | 'production' = this.config.environment) {
    const nodes = await this.client.listNodes();
    const guestResults = await Promise.all(
      nodes.map(async (node) => {
        const [vms, lxcs] = await Promise.all([
          this.client.listQemu(node.node),
          this.client.listLxc(node.node)
        ]);
        return {
          node: node.node,
          vms: normalizeGuests('vm', vms),
          lxcs: normalizeGuests('lxc', lxcs)
        };
      })
    );

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: 'Retrieved live read-only guest inventory.',
      correlationId: createCorrelationId('guests'),
      approvalState: 'not_required',
      details: {
        environment,
        live: true,
        nodes: guestResults
      }
    });
  }

  async getGuestDetail(node: string, guestType: 'vm' | 'lxc', guestId: number) {
    const config = guestType === 'vm'
      ? await this.client.getQemuConfig(node, guestId)
      : await this.client.getLxcConfig(node, guestId);

    const snapshots = guestType === 'vm'
      ? await this.client.listQemuSnapshots(node, guestId)
      : await this.client.listLxcSnapshots(node, guestId);

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: `Retrieved live read-only ${guestType.toUpperCase()} detail for ${guestId}.`,
      correlationId: createCorrelationId('guest-detail'),
      approvalState: 'not_required',
      details: {
        node,
        guestType,
        guestId,
        live: true,
        config: normalizeGuestConfig(config),
        snapshots: normalizeSnapshots(snapshots)
      }
    });
  }



  async listGuestSnapshots(node: string, guestType: 'vm' | 'lxc', guestId: number) {
    const snapshots = guestType === 'vm'
      ? await this.client.listQemuSnapshots(node, guestId)
      : await this.client.listLxcSnapshots(node, guestId);

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: `Retrieved live read-only snapshot list for ${guestType.toUpperCase()} ${guestId}.`,
      correlationId: createCorrelationId('snapshots'),
      approvalState: 'not_required',
      details: {
        node,
        guestType,
        guestId,
        live: true,
        snapshots: normalizeSnapshots(snapshots)
      }
    });
  }

  async listStorage(environment: 'lab' | 'staging' | 'production' = this.config.environment) {
    const nodes = await this.client.listNodes();
    const storageResults = await Promise.all(
      nodes.map(async (node) => ({
        node: node.node,
        storage: normalizeStorage(await this.client.listStorage(node.node))
      }))
    );

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: 'Retrieved live read-only storage inventory.',
      correlationId: createCorrelationId('storage'),
      approvalState: 'not_required',
      details: {
        environment,
        live: true,
        nodes: storageResults
      }
    });
  }

  async listTasks(environment: 'lab' | 'staging' | 'production' = this.config.environment, limit = 25) {
    const nodes = await this.client.listNodes();
    const taskResults = await Promise.all(
      nodes.map(async (node) => ({
        node: node.node,
        tasks: normalizeTasks(await this.client.listTasks(node.node, limit))
      }))
    );

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: 'Retrieved live read-only Proxmox task inventory.',
      correlationId: createCorrelationId('tasks'),
      approvalState: 'not_required',
      details: {
        environment,
        live: true,
        nodes: taskResults
      }
    });
  }

  async listBackups(environment: 'lab' | 'staging' | 'production' = this.config.environment) {
    const nodes = await this.client.listNodes();
    const backupResults = await Promise.all(
      nodes.map(async (node) => {
        const storages = await this.client.listStorage(node.node);
        const backupCapable = storages.filter((storage) => (storage.content ?? '').includes('backup'));
        const content = await Promise.all(
          backupCapable.map(async (storage) => ({
            storage: storage.storage,
            backups: normalizeBackups(await this.client.listBackupContent(node.node, storage.storage))
          }))
        );
        return { node: node.node, storages: content };
      })
    );

    return serviceResponseSchema.parse({
      status: 'ok' as const,
      summary: 'Retrieved live read-only backup inventory from backup-capable storages.',
      correlationId: createCorrelationId('backups'),
      approvalState: 'not_required',
      details: {
        environment,
        live: true,
        nodes: backupResults
      }
    });
  }

  async ping(): Promise<string> {
    return 'proxmox-mcp-ready';
  }
}
