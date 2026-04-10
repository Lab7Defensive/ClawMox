import type {
  ProxmoxClusterStatusEntry,
  ProxmoxGuestSummary,
  ProxmoxNodeStatus,
  ProxmoxStorageSummary
} from './types.js';

export interface ClusterSummary {
  clusterName?: string;
  quorate: boolean;
  nodeCount: number;
  onlineNodes: number;
  degradedNodes: string[];
}

export function normalizeClusterStatus(
  clusterStatus: ProxmoxClusterStatusEntry[],
  nodes: Array<{ node: string; status?: string }>
): ClusterSummary {
  const cluster = clusterStatus.find((entry) => entry.type === 'cluster');
  const quorum = clusterStatus.find((entry) => entry.type === 'quorum');
  const degradedNodes = nodes.filter((node) => node.status !== 'online').map((node) => node.node);

  return {
    clusterName: cluster?.name,
    quorate: quorum?.quorate === 1,
    nodeCount: nodes.length,
    onlineNodes: nodes.filter((node) => node.status === 'online').length,
    degradedNodes
  };
}

export function normalizeNodeInventory(
  nodes: Array<{ node: string; status?: string; cpu?: number; maxmem?: number; mem?: number }>,
  statuses: Record<string, ProxmoxNodeStatus>
) {
  return nodes.map((node) => ({
    node: node.node,
    status: node.status ?? 'unknown',
    cpuLoad: node.cpu ?? statuses[node.node]?.cpu ?? null,
    memoryUsed: node.mem ?? statuses[node.node]?.memory?.used ?? null,
    memoryTotal: node.maxmem ?? statuses[node.node]?.memory?.total ?? null,
    uptime: statuses[node.node]?.uptime ?? null
  }));
}

export function normalizeGuests(type: 'vm' | 'lxc', guests: ProxmoxGuestSummary[]) {
  return guests.map((guest) => ({
    id: guest.vmid,
    type,
    name: guest.name ?? `${type}-${guest.vmid}`,
    status: guest.status ?? 'unknown',
    node: guest.node ?? null,
    cpus: guest.cpus ?? null,
    memory: guest.maxmem ?? null,
    disk: guest.maxdisk ?? null,
    tags: guest.tags ?? ''
  }));
}

export function normalizeStorage(storage: ProxmoxStorageSummary[]) {
  return storage.map((entry) => ({
    storage: entry.storage,
    type: entry.type ?? 'unknown',
    used: entry.used ?? 0,
    total: entry.total ?? 0,
    available: entry.avail ?? 0,
    content: entry.content ?? ''
  }));
}
