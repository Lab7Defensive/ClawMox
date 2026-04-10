import {
  classifyRisk,
  clusterStatusRequestSchema,
  createCorrelationId,
  requiresApproval,
  serviceResponseSchema
} from '../../shared/src/index.js';
import { ProxmoxApiClient } from './client.js';
import { loadProxmoxConfig } from './config.js';
import { normalizeClusterStatus, normalizeGuests, normalizeNodeInventory, normalizeStorage } from './normalizers.js';

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

    const response = {
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
    };

    return serviceResponseSchema.parse(response);
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

  async ping(): Promise<string> {
    return 'proxmox-mcp-ready';
  }
}
