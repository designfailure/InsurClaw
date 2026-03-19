/**
 * Claw registry — main_log & agentic_log per Registry log.md
 */

import { mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

export type MainLogEventType =
  | 'cron_execution'
  | 'tool_invocation'
  | 'agent_delegation'
  | 'approval_gate'
  | 'user_action'
  | 'jtbd_trigger';

export type AgenticEventType =
  | 'step_ingest'
  | 'step_context'
  | 'step_plan'
  | 'step_execute'
  | 'step_validate'
  | 'step_respond'
  | 'cron_jtbd'
  | 'delegation';

export interface MainLogEntry {
  timestamp: string;
  event_type: MainLogEventType;
  agent_id?: string;
  action: string;
  result: 'success' | 'partial' | 'failure';
  approval_gate_status?: 'pending' | 'approved' | 'rejected' | 'n/a';
  details?: Record<string, unknown>;
  session_id?: string;
  user_id?: string;
}

export interface AgenticLogEntry {
  timestamp: string;
  event_type: AgenticEventType;
  step?: string;
  agent_id?: string;
  trigger?: string;
  details?: Record<string, unknown>;
  session_id?: string;
  user_id?: string;
}

export class ClawRegistry {
  private mainPath: string;
  private agenticPath: string;
  private agentsDir: string;

  constructor(logsRoot: string) {
    mkdirSync(logsRoot, { recursive: true });
    this.agentsDir = join(logsRoot, 'agents');
    mkdirSync(this.agentsDir, { recursive: true });
    this.mainPath = join(logsRoot, 'main_log.jsonl');
    this.agenticPath = join(logsRoot, 'agentic_log.jsonl');
  }

  appendMainLog(entry: MainLogEntry): void {
    appendFileSync(this.mainPath, `${JSON.stringify(entry)}\n`, 'utf-8');
  }

  appendAgenticLog(entry: AgenticLogEntry): void {
    appendFileSync(this.agenticPath, `${JSON.stringify(entry)}\n`, 'utf-8');
  }

  appendAgentNamedLog(agentSlug: string, entry: Record<string, unknown>): void {
    const safe = agentSlug.replace(/[^a-zA-Z0-9._-]+/g, '_');
    const path = join(this.agentsDir, `agent-${safe}_log.jsonl`);
    appendFileSync(path, `${JSON.stringify({ ...entry, timestamp: new Date().toISOString() })}\n`, 'utf-8');
  }
}
