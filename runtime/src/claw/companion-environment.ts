/**
 * Claw-like companion environment — session workspace layout per WORKFLOW.md
 * Maps logical session IDs to isolated on-disk trees for policies, claims, compliance.
 */

import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { getDefaultRepoRoot } from './paths.js';

export interface CompanionSessionMetadata {
  host: string;
  os: string;
  repo_root: string;
  session_id: string;
  user_id: string;
  user_tier: string;
  jurisdiction: string;
  timezone: string;
  storm_season: boolean;
  current_timestamp: string;
  gdpr_consent_status: 'unknown' | 'granted' | 'denied';
  active_approval_gates: string[];
}

const SESSION_SUBDIRS = [
  'active_policies',
  'claim_history',
  'skills_cache',
  'agent_outputs',
  'compliance_state',
] as const;

export function sanitizeSessionId(sessionId: string): string {
  const s = sessionId.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 200);
  return s.length > 0 ? s : 'default_session';
}

export class CompanionEnvironment {
  readonly sessionsRoot: string;
  readonly logsRoot: string;

  constructor(options?: { repoRoot?: string; sessionsRelative?: string; logsRelative?: string }) {
    const repo = options?.repoRoot ?? getDefaultRepoRoot();
    this.sessionsRoot = join(repo, options?.sessionsRelative ?? 'workspace/sessions');
    this.logsRoot = join(repo, options?.logsRelative ?? 'workspace/logs');
  }

  sessionDir(sessionId: string): string {
    return join(this.sessionsRoot, sanitizeSessionId(sessionId));
  }

  compliancePath(sessionId: string, name: string): string {
    return join(this.sessionDir(sessionId), 'compliance_state', name);
  }

  agentOutputPath(sessionId: string, agentId: string, timestamp: number): string {
    const safe = agentId.replace(/[^a-zA-Z0-9._-]+/g, '_');
    return join(this.sessionDir(sessionId), 'agent_outputs', `${safe}_${timestamp}.json`);
  }

  ensureSessionWorkspace(sessionId: string): string {
    const base = this.sessionDir(sessionId);
    for (const sub of SESSION_SUBDIRS) {
      mkdirSync(join(base, sub), { recursive: true });
    }
    return base;
  }

  writeSessionMetadata(sessionId: string, meta: CompanionSessionMetadata): void {
    const dir = join(this.sessionDir(sessionId), 'compliance_state');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'session_metadata.json'), JSON.stringify(meta, null, 2), 'utf-8');
  }

  writeGdprConsentStub(sessionId: string, granted: boolean): void {
    const dir = join(this.sessionDir(sessionId), 'compliance_state');
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'gdpr_consent.json'),
      JSON.stringify({ granted, updated_at: new Date().toISOString() }, null, 2),
      'utf-8'
    );
  }

  readSessionMetadata(sessionId: string): CompanionSessionMetadata | null {
    const p = join(this.sessionDir(sessionId), 'compliance_state', 'session_metadata.json');
    if (!existsSync(p)) return null;
    try {
      return JSON.parse(readFileSync(p, 'utf-8')) as CompanionSessionMetadata;
    } catch {
      return null;
    }
  }
}
