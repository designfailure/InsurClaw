/**
 * Run vendored skills/here_now/scripts/publish.sh after approval.
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import { getDefaultRepoRoot } from '../claw/paths.js';

export interface PublishResult {
  ok: boolean;
  siteUrl?: string;
  stderr?: string;
}

export function parseHereNowPublishPayload(
  actionDetail: string
): { herePublish: true; artifactPath: string; summary?: string } | null {
  try {
    const o = JSON.parse(actionDetail) as Record<string, unknown>;
    if (o.herePublish === true && typeof o.artifactPath === 'string') {
      return {
        herePublish: true,
        artifactPath: o.artifactPath,
        summary: typeof o.summary === 'string' ? o.summary : undefined,
      };
    }
  } catch {
    /* not JSON */
  }
  return null;
}

export function publishArtifactToHereNow(artifactPath: string): PublishResult {
  const script = join(getDefaultRepoRoot(), 'skills/here_now/scripts/publish.sh');
  if (!existsSync(script)) {
    return { ok: false, stderr: `publish.sh not found at ${script}` };
  }
  if (!existsSync(artifactPath)) {
    return { ok: false, stderr: `artifact not found: ${artifactPath}` };
  }

  const r = spawnSync('bash', [script, artifactPath], {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });

  const stdout = (r.stdout ?? '').trim();
  const firstLine = stdout.split('\n')[0] ?? '';
  const urlMatch = firstLine.match(/^https:\/\/[^\s]+/);

  if (r.status !== 0) {
    return {
      ok: false,
      stderr: r.stderr || stdout || `exit ${r.status}`,
    };
  }

  return {
    ok: true,
    siteUrl: urlMatch ? urlMatch[0] : firstLine || undefined,
  };
}
