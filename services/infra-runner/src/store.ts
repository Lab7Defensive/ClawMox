import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { RunnerJobRecord } from './types.js';

interface JobStoreShape {
  jobs: RunnerJobRecord[];
}

export class JobStore {
  constructor(private readonly filePath: string) {}

  private async ensureFile(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      await readFile(this.filePath, 'utf8');
    } catch {
      await writeFile(this.filePath, JSON.stringify({ jobs: [] }, null, 2), 'utf8');
    }
  }

  async readAll(): Promise<RunnerJobRecord[]> {
    await this.ensureFile();
    const raw = await readFile(this.filePath, 'utf8');
    const parsed = JSON.parse(raw) as JobStoreShape;
    return parsed.jobs;
  }

  async writeAll(jobs: RunnerJobRecord[]): Promise<void> {
    await this.ensureFile();
    await writeFile(this.filePath, JSON.stringify({ jobs }, null, 2), 'utf8');
  }

  async upsert(job: RunnerJobRecord): Promise<void> {
    const jobs = await this.readAll();
    const next = [...jobs.filter((entry) => entry.id !== job.id), job];
    await this.writeAll(next);
  }

  async get(jobId: string): Promise<RunnerJobRecord | undefined> {
    const jobs = await this.readAll();
    return jobs.find((job) => job.id === jobId);
  }
}

export function defaultJobStorePath(baseDir: string): string {
  return join(baseDir, 'runner-jobs.json');
}
