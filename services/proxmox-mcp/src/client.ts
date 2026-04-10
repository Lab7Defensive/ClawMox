import type {
  ProxmoxClusterStatusEntry,
  ProxmoxEnvelope,
  ProxmoxGuestSummary,
  ProxmoxNodeStatus,
  ProxmoxStorageSummary
} from './types.js';
import type { ProxmoxConfig } from './config.js';

export class ProxmoxApiClient {
  constructor(private readonly config: ProxmoxConfig) {}

  private get authHeader(): string {
    return `PVEAPIToken=${this.config.tokenId}=${this.config.tokenSecret}`;
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      headers: {
        Authorization: this.authHeader
      }
    });

    if (!response.ok) {
      throw new Error(`Proxmox API request failed: ${response.status} ${response.statusText} for ${path}`);
    }

    const payload = (await response.json()) as ProxmoxEnvelope<T>;
    return payload.data;
  }

  async getClusterStatus(): Promise<ProxmoxClusterStatusEntry[]> {
    return this.request<ProxmoxClusterStatusEntry[]>('/cluster/status');
  }

  async listNodes(): Promise<Array<{ node: string; status?: string; cpu?: number; maxmem?: number; mem?: number }>> {
    return this.request('/nodes');
  }

  async getNodeStatus(node: string): Promise<ProxmoxNodeStatus> {
    return this.request<ProxmoxNodeStatus>(`/nodes/${node}/status`);
  }

  async listQemu(node: string): Promise<ProxmoxGuestSummary[]> {
    return this.request<ProxmoxGuestSummary[]>(`/nodes/${node}/qemu`);
  }

  async listLxc(node: string): Promise<ProxmoxGuestSummary[]> {
    return this.request<ProxmoxGuestSummary[]>(`/nodes/${node}/lxc`);
  }

  async listStorage(node: string): Promise<ProxmoxStorageSummary[]> {
    return this.request<ProxmoxStorageSummary[]>(`/nodes/${node}/storage`);
  }
}
