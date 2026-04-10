import assert from 'node:assert/strict';
import {
  normalizeClusterStatus,
  normalizeGuests,
  normalizeStorage
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

console.log('normalizers.test.mjs passed');
