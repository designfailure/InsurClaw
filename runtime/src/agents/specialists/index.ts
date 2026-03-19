/**
 * Specialist Agents - Prevention, Event, Underwriting, Claims
 * Each agent has domain-specific system prompt and tools
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadAgentConfig } from '../../config/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = join(__dirname, '../../..'); // insurclaw root (runtime -> insurclaw)

export type SpecialistId = 'prevention_service' | 'event_coverage' | 'risk_engine' | 'claims_adjuster';

const AGENT_SYSTEMS: Record<SpecialistId, string> = {
  prevention_service: `You are the Prevention Agent. Your job is to prevent insurable losses before they occur.
You monitor: EUMETNET weather alerts, property maintenance schedules, travel advisories.
You intervene early with specific, actionable steps. You reduce claim frequency.
You estimate avoided-loss value where calculable. Use it.
Be direct and specific. No jargon.`,

  event_coverage: `You are the Event Agent. You handle flight delays (EC 261/2004), weather parametric, travel disruption.
Speed is your product. Detect events and pre-draft claims before the user notices.
Classify: Likely Covered / Possibly Covered / Likely Excluded.
Prepare evidence checklist. Never auto-submit without approval.`,

  risk_engine: `You are the Underwriting Agent. You build risk models. You reverse-engineer carrier pricing.
When the user receives a renewal quote, analyze: "This is X% above market. Here's why."
Never show false certainty. Label confidence levels.`,

  claims_adjuster: `You are the Claims Agent. When loss occurs, you are the user's war council.
Prepare claims with evidentiary standards carriers find difficult to reject.
Detect lowball offers. Escalate disputes with precision.
Structure every claim package as if it will be reviewed by a court.`,
};

export interface SpecialistResult {
  text: string;
  structured?: Record<string, unknown>;
}

export async function runSpecialist(
  agentId: SpecialistId,
  task: string,
  userId: string,
  context?: Record<string, unknown>
): Promise<SpecialistResult> {
  const config = loadAgentConfig();
  const agentConfig = config.agents.find((a) => a.id === agentId);
  if (!agentConfig) {
    return { text: `Unknown agent: ${agentId}` };
  }

  let systemPrompt = AGENT_SYSTEMS[agentId];

  // Load skills if paths exist
  if (agentConfig.skills?.length) {
    for (const skillPath of agentConfig.skills) {
      const fullPath = join(SKILLS_ROOT, skillPath);
      if (existsSync(fullPath)) {
        const skillContent = readFileSync(fullPath, 'utf-8');
        systemPrompt += `\n\n--- Skill: ${skillPath} ---\n${skillContent}`;
      }
    }
  }

  const contextStr = context ? `\n\nContext: ${JSON.stringify(context)}` : '';
  const userMessage = `Task: ${task}\nUser ID: ${userId}${contextStr}`;

  const client = new Anthropic();
  const response = await client.messages.create({
    model: agentConfig.model,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  const text = textContent?.type === 'text' ? textContent.text : '';

  return { text };
}
