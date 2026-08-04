// ==========================================
// Dashboard Types & Interfaces
// ==========================================

export interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  parseMode: 'HTML' | 'Markdown';
  disableNotification: boolean;
}

export interface DiscordConfig {
  enabled: boolean;
  webhookUrl: string;
  username: string;
  avatarUrl: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  instanceId: string;
  accessToken: string;
  phoneNumber: string;
}

export interface SlackConfig {
  enabled: boolean;
  webhookUrl: string;
  channel: string;
}

export interface TeamsConfig {
  enabled: boolean;
  webhookUrl: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  condition: string;
  priority: number;
  active: boolean;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  source: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  payload: string;
  responseCode: number;
}

export interface AnalyticsData {
  totalSignals: number;
  successRate: number;
  activeWebhooks: number;
  avgLatencyMs: number;
}

export interface SystemSettings {
  retryAttempts: number;
  timeoutSeconds: number;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  maintenanceMode: boolean;
}

