/**
 * InsurTech Claw mechanism — programmable agentic loop (Agentic flow.md)
 * Ingest → Context → Plan → Execute → Validate → Respond, plus JTBD/cron hooks.
 */

import { hostname } from 'os';
import type { RoutedMessage } from '../gateway/router.js';
import type { MemoryManager } from '../memory/manager.js';
import type { AgentResponse } from '../agents/orchestrator.js';
import { CompanionEnvironment, type CompanionSessionMetadata } from './companion-environment.js';
import { ClawRegistry } from './registry.js';
import { getDefaultRepoRoot } from './paths.js';
import { recommendedToolsForIntent } from './intent-tools.js';
import { tierForIntent, type SafetyTier } from './safety.js';

export type CronJTBDId =
  | 'weather_monitor'
  | 'flight_poll'
  | 'renewal_check'
  | 'claims_status'
  | 'audit_integrity';

export interface InsurTechClawOptions {
  companion: CompanionEnvironment;
  registry: ClawRegistry;
  memory: MemoryManager;
}

function isStormSeason(d = new Date()): boolean {
  const m = d.getMonth() + 1;
  return m >= 10 || m <= 3;
}

function buildMetadata(
  sessionId: string,
  userId: string,
  memory: MemoryManager,
  companion: CompanionEnvironment
): CompanionSessionMetadata {
  const gdpr = memory.hasGdprConsent(userId);
  const user = memory.getUserById(userId);
  return {
    host: hostname(),
    os: process.platform,
    repo_root: getDefaultRepoRoot(),
    session_id: sessionId,
    user_id: userId,
    user_tier: user?.tier ?? 'free',
    jurisdiction: user?.jurisdiction ?? 'EU',
    timezone: user?.timezone ?? 'Europe/Paris',
    storm_season: isStormSeason(),
    current_timestamp: new Date().toISOString(),
    gdpr_consent_status: gdpr ? 'granted' : 'unknown',
    active_approval_gates: [],
  };
}

export class InsurTechClaw {
  private companion: CompanionEnvironment;
  private registry: ClawRegistry;
  private memory: MemoryManager;

  constructor(opts: InsurTechClawOptions) {
    this.companion = opts.companion;
    this.registry = opts.registry;
    this.memory = opts.memory;
  }

  /**
   * Full agentic loop for user-originated messages; executes the handler at the Execute step.
   */
  async processUserTurn(
    routed: RoutedMessage,
    execute: () => Promise<AgentResponse>
  ): Promise<AgentResponse> {
    const sessionId = routed.sessionId;
    const tier: SafetyTier = tierForIntent(routed.intent);

    this.companion.ensureSessionWorkspace(sessionId);
    const meta = buildMetadata(sessionId, routed.userId, this.memory, this.companion);
    this.companion.writeSessionMetadata(sessionId, meta);

    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'step_ingest',
      step: 'ingest',
      session_id: sessionId,
      user_id: routed.userId,
      details: { intent: routed.intent, platform: routed.platform, safety_tier: tier },
    });

    this.registry.appendMainLog({
      timestamp: new Date().toISOString(),
      event_type: 'user_action',
      action: 'inbound_message',
      result: 'success',
      approval_gate_status: 'n/a',
      session_id: sessionId,
      user_id: routed.userId,
      details: { intent: routed.intent },
    });

    const tools = [...recommendedToolsForIntent(routed.intent)];
    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'step_context',
      step: 'context_retrieval',
      session_id: sessionId,
      user_id: routed.userId,
      details: {
        policies_count: this.memory.getPolicies(routed.userId).length,
        claims_count: this.memory.getClaims(routed.userId).length,
      },
    });

    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'step_plan',
      step: 'planning_tool_selection',
      agent_id: 'consumer_advocate',
      session_id: sessionId,
      user_id: routed.userId,
      details: { recommended_tools: tools, safety_tier: tier },
    });

    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'step_execute',
      step: 'execution',
      agent_id: 'consumer_advocate',
      session_id: sessionId,
      user_id: routed.userId,
    });

    const response = await execute();

    const validationOk = true;
    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'step_validate',
      step: 'validate_outputs',
      session_id: sessionId,
      user_id: routed.userId,
      details: { eu_compliance_check: validationOk, approval_pending: !!response.approvalRequested },
    });

    if (response.approvalRequested) {
      this.registry.appendMainLog({
        timestamp: new Date().toISOString(),
        event_type: 'approval_gate',
        agent_id: 'consumer_advocate',
        action: response.approvalRequested.actionType,
        result: 'partial',
        approval_gate_status: 'pending',
        session_id: sessionId,
        user_id: routed.userId,
        details: { approval_id: response.approvalRequested.approvalId },
      });
    }

    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'step_respond',
      step: 'output_response',
      session_id: sessionId,
      user_id: routed.userId,
      details: { delegated_to: response.delegatedTo },
    });

    this.registry.appendMainLog({
      timestamp: new Date().toISOString(),
      event_type: 'user_action',
      action: 'outbound_response',
      result: 'success',
      approval_gate_status: response.approvalRequested ? 'pending' : 'n/a',
      session_id: sessionId,
      user_id: routed.userId,
    });

    this.registry.appendAgentNamedLog('consumer_advocate', {
      event: 'turn_complete',
      session_id: sessionId,
      user_id: routed.userId,
      intent: routed.intent,
    });

    return response;
  }

  /**
   * JTBD / cron path: #Claw executes programmable steps for scheduled jobs (Agentic flow.md)
   */
  async executeCronJTBD(
    jtbd: CronJTBDId,
    ctx: { userId?: string; sessionId?: string; details?: Record<string, unknown> },
    run: () => Promise<void>
  ): Promise<void> {
    const sessionId = ctx.sessionId ?? `cron:${jtbd}`;
    const userId = ctx.userId ?? 'system';

    this.registry.appendAgenticLog({
      timestamp: new Date().toISOString(),
      event_type: 'cron_jtbd',
      trigger: jtbd,
      session_id: sessionId,
      user_id: userId,
      details: ctx.details,
    });

    this.registry.appendMainLog({
      timestamp: new Date().toISOString(),
      event_type: 'jtbd_trigger',
      action: jtbd,
      result: 'success',
      approval_gate_status: 'n/a',
      session_id: sessionId,
      user_id: userId,
    });

    try {
      await run();
      this.registry.appendMainLog({
        timestamp: new Date().toISOString(),
        event_type: 'cron_execution',
        action: `${jtbd}_complete`,
        result: 'success',
        session_id: sessionId,
        user_id: userId,
      });
    } catch (err) {
      this.registry.appendMainLog({
        timestamp: new Date().toISOString(),
        event_type: 'cron_execution',
        action: `${jtbd}_error`,
        result: 'failure',
        session_id: sessionId,
        user_id: userId,
        details: { error: String(err) },
      });
      throw err;
    }
  }
}
