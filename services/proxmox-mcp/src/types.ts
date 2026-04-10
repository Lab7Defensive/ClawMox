export interface ProxmoxEnvelope<T = unknown> {
  data: T;
}

export interface ProxmoxClusterStatusEntry {
  type: string;
  name?: string;
  node?: string;
  id?: string;
  status?: string;
  level?: string;
  local?: number;
  quorate?: number;
}

export interface ProxmoxNodeStatus {
  cpu?: number;
  memory?: {
    total?: number;
    used?: number;
  };
  rootfs?: {
    total?: number;
    used?: number;
  };
  uptime?: number;
}

export interface ProxmoxGuestSummary {
  vmid: number;
  name?: string;
  status?: string;
  node?: string;
  type?: string;
  cpus?: number;
  maxmem?: number;
  maxdisk?: number;
  tags?: string;
}

export interface ProxmoxStorageSummary {
  storage: string;
  type?: string;
  used?: number;
  total?: number;
  avail?: number;
  shared?: number;
  content?: string;
}
