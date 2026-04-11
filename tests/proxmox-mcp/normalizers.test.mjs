import assert from 'node:assert/strict';
import {
  normalizeClusterStatus,
  normalizeGuests,
  normalizeStorage,
  normalizeTasks,
  normalizeBackups,
  normalizeGuestConfig,
  normalizeSnapshots
} from '../../dist/proxmox-mcp/src/normalizers.js';

const cluster = normalizeClusterStatus(
  [
    { type: 'cluster', name: 'lab7-cluster' },
    { type: 'quorum', quorate: 1 }
  ],
  [
    { node: 'alpha', status: 'online' },
    { node: 'bravo', status: 'offline' }
  ]
);
assert.equal(cluster.clusterName, 'lab7-cluster');
assert.equal(cluster.quorate, true);
assert.deepEqual(cluster.degradedNodes, ['bravo']);

const guests = normalizeGuests('vm', [{ vmid: 101, name: 'relay-app', status: 'running' }]);
assert.equal(guests[0].name, 'relay-app');
assert.equal(guests[0].type, 'vm');

const storage = normalizeStorage([{ storage: 'local-lvm', used: 10, total: 100, avail: 90 }]);
assert.equal(storage[0].available, 90);

const tasks = normalizeTasks([{ upid: 'UPID:1', status: 'OK', user: 'root@pam' }]);
assert.equal(tasks[0].status, 'OK');

const backups = normalizeBackups([{ content: 'backup', volid: 'backup/vzdump-qemu-101.vma.zst' }]);
assert.equal(backups[0].content, 'backup');

const config = normalizeGuestConfig({ memory: 4096, cores: 4, net0: 'virtio', scsi0: 'local-lvm' });
assert.equal(config.memory, 4096);
assert.deepEqual(config.networkKeys, ['net0']);

const snapshots = normalizeSnapshots([{ name: 'pre-change', description: 'before maintenance' }]);
assert.equal(snapshots[0].name, 'pre-change');

console.log('normalizers.test.mjs passed');
