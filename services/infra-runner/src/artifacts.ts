import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export class ArtifactStore {
  constructor(private readonly baseDir: string) {}

  async writeJobArtifact(jobId: string, name: string, content: string): Promise<string> {
    const dir = join(this.baseDir, jobId);
    await mkdir(dir, { recursive: true });
    const filePath = join(dir, name);
    await writeFile(filePath, content, 'utf8');
    return filePath;
  }
}
