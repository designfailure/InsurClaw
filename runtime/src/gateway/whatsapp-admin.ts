/**
 * WhatsApp Admin Notifications - Outbound-only push for admin triggers
 * Used when approval gates, fraud flags, or escalations require admin attention
 */

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTH_DIR = join(__dirname, '../../auth_whatsapp_admin');

export interface WhatsAppAdminConfig {
  allowedRecipients: string[];
  authDir?: string;
}

export interface AdminNotification {
  triggerType: string;
  summary: string;
  payload: Record<string, unknown>;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

export class WhatsAppAdminNotifier {
  private config: WhatsAppAdminConfig;
  private sock: ReturnType<typeof makeWASocket> | null = null;
  private jidMap = new Map<string, string>();

  constructor(config: WhatsAppAdminConfig) {
    this.config = {
      ...config,
      authDir: config.authDir ?? AUTH_DIR,
    };
  }

  private async ensureAuthDir(): Promise<void> {
    const dir = this.config.authDir!;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private normalizeJid(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (phone.includes('@')) return phone;
    return `${cleaned}@s.whatsapp.net`;
  }

  async start(): Promise<void> {
    await this.ensureAuthDir();
    const { state, saveCreds } = await useMultiFileAuthState(this.config.authDir!);
    const { version } = await fetchLatestBaileysVersion();
    const logger = pino({ level: 'silent' });

    this.sock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: true,
    });

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n[WhatsApp Admin] Scan QR code to connect for admin notifications:');
      }

      if (connection === 'close') {
        const err = lastDisconnect?.error as { output?: { statusCode?: number } } | undefined;
        const statusCode = err?.output?.statusCode;
        if (statusCode === DisconnectReason.loggedOut) {
          console.log('[WhatsApp Admin] Logged out. Delete auth folder to re-authenticate.');
        } else if (this.sock?.user?.id) {
          console.log('[WhatsApp Admin] Reconnecting...');
          this.start();
        }
      }

      if (connection === 'open') {
        console.log('[WhatsApp Admin] Connected for admin notifications');
      }
    });

    this.sock.ev.on('creds.update', saveCreds);
  }

  async stop(): Promise<void> {
    if (this.sock) {
      this.sock.end(undefined);
      this.sock = null;
    }
    console.log('[WhatsApp Admin] Stopped');
  }

  async sendAdminNotification(recipient: string, notification: AdminNotification): Promise<boolean> {
    const normalizedJid = this.normalizeJid(recipient);

    if (!this.config.allowedRecipients.includes(recipient) && !this.config.allowedRecipients.includes('*')) {
      console.warn('[WhatsApp Admin] Recipient not in allowlist:', recipient);
      return false;
    }

    const urgencyEmoji = {
      low: '📋',
      medium: '⚠️',
      high: '🔔',
      critical: '🚨',
    };
    const emoji = urgencyEmoji[notification.urgency ?? 'medium'];

    const msg = [
      `${emoji} *InsurClaw Admin Alert*`,
      `*Type:* ${notification.triggerType}`,
      `*Summary:* ${notification.summary}`,
      '',
      'Details:',
      '```',
      JSON.stringify(notification.payload, null, 2),
      '```',
    ].join('\n');

    try {
      if (this.sock) {
        await this.sock.sendMessage(normalizedJid, { text: msg });
        return true;
      }
      console.warn('[WhatsApp Admin] Not connected. Skipping notification.');
      return false;
    } catch (err) {
      console.error('[WhatsApp Admin] Send failed:', err);
      return false;
    }
  }

  async notifyAdmins(notification: AdminNotification): Promise<number> {
    const recipients = this.config.allowedRecipients.includes('*')
      ? []
      : this.config.allowedRecipients;

    if (recipients.length === 0) {
      console.error('[WhatsApp Admin] No recipients configured. Set ADMIN_WHATSAPP_IDS.');
      return 0;
    }

    let sent = 0;
    for (const r of recipients) {
      const ok = await this.sendAdminNotification(r, notification);
      if (ok) sent++;
    }
    return sent;
  }

  isConnected(): boolean {
    return !!this.sock?.user?.id;
  }
}
