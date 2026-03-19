export interface IncomingMessage {
  platform: string;
  chatId: string;
  channelRef: string;
  text: string;
  userId: string;
  userName?: string;
  isGroup: boolean;
  threadTs?: string;
  raw?: unknown;
}

export interface OutgoingMessage {
  text: string;
  blocks?: unknown[];
  threadTs?: string;
}
