import { randomUUID } from 'crypto';
import { getDatabase } from './database.js';

export interface User {
  id: string;
  slack_user_id: string | null;
  jurisdiction: string;
  timezone: string;
  tier: string;
  gdpr_consent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  user_id: string;
  carrier: string | null;
  type: string | null;
  policy_number: string | null;
  start_date: string | null;
  end_date: string | null;
  premium_annual: number | null;
  coverage_summary: string | null;
  created_at: string;
}

export interface Claim {
  id: string;
  user_id: string;
  policy_id: string | null;
  event_type: string | null;
  event_date: string | null;
  status: string;
  estimated_value_min: number | null;
  estimated_value_max: number | null;
  settled_value: number | null;
  evidence_paths: string | null;
  created_at: string;
}

export interface RiskProfile {
  user_id: string;
  properties: string | null;
  travel_frequency: string | null;
  registered_routes: string | null;
  risk_scores: string | null;
  last_updated: string;
}

export class MemoryManager {
  private db = getDatabase();

  getUserBySlackId(slackUserId: string): User | null {
    const row = this.db.prepare(
      'SELECT * FROM users WHERE slack_user_id = ?'
    ).get(slackUserId) as User | undefined;
    return row ?? null;
  }

  getOrCreateUser(slackUserId: string): User {
    let user = this.getUserBySlackId(slackUserId);
    if (!user) {
      const id = randomUUID();
      this.db.prepare(`
        INSERT INTO users (id, slack_user_id, jurisdiction, timezone)
        VALUES (?, ?, 'EU', 'Europe/Paris')
      `).run(id, slackUserId);
      user = this.getUserBySlackId(slackUserId)!;
    }
    return user;
  }

  getPolicies(userId: string): Policy[] {
    return this.db.prepare(
      'SELECT * FROM policies WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as Policy[];
  }

  getClaims(userId: string, status?: string): Claim[] {
    if (status) {
      return this.db.prepare(
        'SELECT * FROM claims WHERE user_id = ? AND status = ? ORDER BY created_at DESC'
      ).all(userId, status) as Claim[];
    }
    return this.db.prepare(
      'SELECT * FROM claims WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as Claim[];
  }

  getRiskProfile(userId: string): RiskProfile | null {
    const row = this.db.prepare(
      'SELECT * FROM risk_profiles WHERE user_id = ?'
    ).get(userId) as RiskProfile | undefined;
    return row ?? null;
  }

  hasGdprConsent(userId: string): boolean {
    const row = this.db.prepare(
      'SELECT gdpr_consent_at FROM users WHERE id = ?'
    ).get(userId) as { gdpr_consent_at: string | null } | undefined;
    return !!row?.gdpr_consent_at;
  }

  setGdprConsent(userId: string): void {
    this.db.prepare(
      'UPDATE users SET gdpr_consent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(userId);
  }

  logAudit(entry: {
    userId?: string;
    agentId?: string;
    actionType: string;
    actionDetail?: string;
    outcome?: string;
    approvedBy?: string;
    gdprBasis?: string;
  }): void {
    this.db.prepare(`
      INSERT INTO audit_log (id, user_id, agent_id, action_type, action_detail, outcome, approved_by, gdpr_basis)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      randomUUID(),
      entry.userId ?? null,
      entry.agentId ?? null,
      entry.actionType,
      entry.actionDetail ?? null,
      entry.outcome ?? null,
      entry.approvedBy ?? null,
      entry.gdprBasis ?? null
    );
  }
}
