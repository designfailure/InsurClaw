import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AgentConfigSchema = z.object({
  id: z.string(),
  model: z.string(),
  workspace: z.string(),
  skills: z.array(z.string()).optional(),
});

const ConfigSchema = z.object({
  orchestrator: z.object({
    id: z.string(),
    model: z.string(),
    max_turns: z.number(),
    approval_gates: z.array(z.string()),
  }),
  agents: z.array(AgentConfigSchema),
  admin: z.object({
    whatsapp_ids: z.array(z.string()),
    trigger_rules: z.object({
      claim_value_threshold: z.number(),
      fraud_flag: z.boolean(),
      escalation_required: z.boolean(),
    }),
  }).optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type InsurClawConfig = z.infer<typeof ConfigSchema>;

export function loadAgentConfig(configPath?: string): InsurClawConfig {
  const path = configPath ?? join(__dirname, '../../config/agent-config.yaml');
  const content = readFileSync(path, 'utf-8');
  const raw = parseYaml(content);
  return ConfigSchema.parse(raw);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databasePath: process.env.INSURCLAW_DB_PATH ?? './data/insurclaw.db',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  slackBotToken: process.env.SLACK_BOT_TOKEN ?? '',
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  slackAppToken: process.env.SLACK_APP_TOKEN ?? '',
};
