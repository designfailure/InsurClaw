import { randomUUID } from 'crypto';
import { getDatabase } from '../memory/database.js';
import type { InsurClawConfig } from '../config/index.js';

export const GATED_ACTIONS = [
  'submit_claim',
  'bind_policy',
  'send_external_email',
  'accept_settlement',
  'share_data_external',
] as const;

export type GatedAction = (typeof GATED_ACTIONS)[number];

export interface ApprovalRequest {
  id: string;
  userId: string;
  actionType: GatedAction;
  actionDetail: string;
  channel: string;
  channelRef: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, unknown>;
}

export interface AdminTriggerRule {
  claimValueThreshold?: number;
  fraudFlag?: boolean;
  escalationRequired?: boolean;
}

export class ApprovalGateManager {
  private db = getDatabase();
  private config: InsurClawConfig;

  constructor(config: InsurClawConfig) {
    this.config = config;
  }

  isGatedAction(action: string): action is GatedAction {
    return GATED_ACTIONS.includes(action as GatedAction);
  }

  createApprovalRequest(params: {
    userId: string;
    actionType: GatedAction;
    actionDetail: string;
    channel?: string;
    channelRef?: string;
    metadata?: Record<string, unknown>;
  }): ApprovalRequest {
    const id = randomUUID();
    this.db.prepare(`
      INSERT INTO pending_approvals (id, user_id, action_type, action_detail, channel, channel_ref, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      id,
      params.userId,
      params.actionType,
      params.actionDetail,
      params.channel ?? 'slack',
      params.channelRef ?? ''
    );

    return {
      id,
      userId: params.userId,
      actionType: params.actionType,
      actionDetail: params.actionDetail,
      channel: params.channel ?? 'slack',
      channelRef: params.channelRef ?? '',
      status: 'pending',
      metadata: params.metadata,
    };
  }

  getPendingApproval(approvalId: string): ApprovalRequest | null {
    const row = this.db.prepare(
      'SELECT * FROM pending_approvals WHERE id = ? AND status = ?'
    ).get(approvalId, 'pending') as {
      id: string;
      user_id: string;
      action_type: string;
      action_detail: string;
      channel: string;
      channel_ref: string;
      status: string;
    } | undefined;

    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      actionType: row.action_type as GatedAction,
      actionDetail: row.action_detail,
      channel: row.channel,
      channelRef: row.channel_ref,
      status: row.status as ApprovalRequest['status'],
    };
  }

  resolveApproval(approvalId: string, approved: boolean, resolvedBy: string): void {
    this.db.prepare(`
      UPDATE pending_approvals
      SET status = ?, resolved_at = CURRENT_TIMESTAMP, resolved_by = ?
      WHERE id = ?
    `).run(approved ? 'approved' : 'rejected', resolvedBy, approvalId);
  }

  shouldTriggerAdmin(params: {
    actionType: GatedAction;
    claimValue?: number;
    fraudFlag?: boolean;
    escalationRequired?: boolean;
  }): boolean {
    const admin = this.config.admin;
    if (!admin?.whatsapp_ids?.length) return false;

    const rules = admin.trigger_rules;
    if (!rules) return false;

    if (params.fraudFlag && rules.fraud_flag) return true;
    if (params.escalationRequired && rules.escalation_required) return true;
    if (
      params.claimValue != null &&
      rules.claim_value_threshold != null &&
      params.claimValue >= rules.claim_value_threshold
    ) {
      return true;
    }

    return false;
  }

  createAdminTrigger(params: {
    triggerType: string;
    payload: Record<string, unknown>;
    whatsappRecipient?: string;
  }): string {
    const id = randomUUID();
    const payloadStr = JSON.stringify(params.payload);
    this.db.prepare(`
      INSERT INTO admin_triggers (id, trigger_type, payload, whatsapp_recipient, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(id, params.triggerType, payloadStr, params.whatsappRecipient ?? null);
    return id;
  }

  getAdminTriggers(status: 'pending' | 'resolved' = 'pending'): Array<{
    id: string;
    triggerType: string;
    payload: string;
    whatsappRecipient: string | null;
    createdAt: string;
  }> {
    return this.db.prepare(`
      SELECT id, trigger_type as triggerType, payload, whatsapp_recipient as whatsappRecipient, created_at as createdAt
      FROM admin_triggers
      WHERE status = ?
      ORDER BY created_at DESC
    `).all(status) as Array<{
      id: string;
      triggerType: string;
      payload: string;
      whatsappRecipient: string | null;
      createdAt: string;
    }>;
  }

  getAdminWhatsAppIds(): string[] {
    return this.config.admin?.whatsapp_ids ?? [];
  }
}
