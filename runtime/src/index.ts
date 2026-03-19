/**
 * InsurClaw Runtime - Autonomous Consumer Insurance Advocate
 * EU Market | Slack primary | WhatsApp admin notifications
 */

import 'dotenv/config';

export { loadAgentConfig, env } from './config/index.js';
export { getDatabase, closeDatabase } from './memory/database.js';
export { MemoryManager } from './memory/manager.js';
export { ApprovalGateManager, GATED_ACTIONS, type ApprovalRequest } from './approval/gates.js';
export { SlackAdapter } from './gateway/slack-adapter.js';
export { WhatsAppAdminNotifier } from './gateway/whatsapp-admin.js';
export { InsurClawGateway } from './gateway/gateway.js';
export { ConsumerAdvocateOrchestrator } from './agents/orchestrator.js';
export { createInsurTechTools } from './tools/index.js';
