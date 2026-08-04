'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Bell, 
  Settings, 
  Shield, 
  Database, 
  Zap, 
  Globe, 
  Layers, 
  BarChart3,
  Activity,
  Webhook,
  Key,
  Copy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Save,
  LogOut,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Send,
  Filter,
  Search,
  Download,
  Upload,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  Menu,
  ArrowRight,
  Link
} from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// واجهات متقدمة
interface RoutingRule {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'regex';
  value: string;
  destination: 'telegram' | 'discord' | 'whatsapp' | 'slack' | 'teams' | 'custom';
  priority: number;
  enabled: boolean;
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
  action: 'send' | 'block' | 'transform' | 'redirect';
  transformTemplate?: string;
}

interface WebhookLog {
  id: string;
  time: string;
  event: string;
  status: string;
  statusCode: number;
  duration: number;
  payload: any;
  response: any;
  source: string;
  ip: string;
  headers: Record<string, string>;
}

interface AnalyticsData {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  dailyRequests: { date: string; count: number }[];
  platformUsage: { platform: string; count: number }[];
  errorRates: { status: string; count: number }[];
}

interface WebhookSecret {
  key: string;
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
}

interface WebhookTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export default function Dashboard() {
  // State Management
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // User Settings
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('Asia/Riyadh');
  const [language, setLanguage] = useState('ar');

  // Platform Configurations
  const [telegramConfig, setTelegramConfig] = useState({
    token: '',
    chatId: '',
    parseMode: 'HTML',
    disableNotification: false,
    protectContent: false
  });
  const [discordConfig, setDiscordConfig] = useState({
    webhook: '',
    username: 'Hook Signal Bot',
    avatarUrl: '',
    embedColor: '#5865F2'
  });
  const [whatsappConfig, setWhatsappConfig] = useState({
    token: '',
    phoneId: '',
    fromNumber: '',
    businessAccountId: ''
  });
  const [slackConfig, setSlackConfig] = useState({
    webhook: '',
    channel: '#signals',
    username: 'Hook Signal',
    iconEmoji: ':signal:'
  });
  const [teamsConfig, setTeamsConfig] = useState({
    webhook: '',
    themeColor: '#6264A7',
    summary: 'Signal Alert'
  });
  const [customWebhook, setCustomWebhook] = useState('');

  // Advanced Features
  const [messageTemplate, setMessageTemplate] = useState('');
  const [templates, setTemplates] = useState<WebhookTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [webhookSecret, setWebhookSecret] = useState<WebhookSecret>({
    key: '',
    createdAt: '',
    expiresAt: '',
    lastUsed: ''
  });
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRequests: 0,
    successRate: 0,
    averageResponseTime: 0,
    dailyRequests: [],
    platformUsage: [],
    errorRates: []
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<'active' | 'inactive' | 'error'>('inactive');

  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'rules' | 'templates' | 'logs' | 'analytics' | 'security'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general', 'telegram']));
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Effects
  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug) {
      setSlug(savedSlug);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (slug && typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setWebhookUrl(`${baseUrl}/api/webhook/${slug}`);
      checkWebhookStatus();
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    loadData();
  }, [slug]);

  // Helper Functions
  const checkWebhookStatus = async () => {
    try {
      const res = await fetch(`/api/webhook/${slug}/status`);
      const data = await res.json();
      setWebhookStatus(data.active ? 'active' : 'inactive');
    } catch {
      setWebhookStatus('error');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/settings?slug=${slug}`);
      const data = await res.json();
      if (data.success && data.settings) {
        // Load all settings
        setUsername(data.settings.username || '');
        setEmail(data.settings.email || '');
        setTimezone(data.settings.timezone || 'Asia/Riyadh');
        setLanguage(data.settings.language || 'ar');

        setTelegramConfig({
          token: data.settings.telegram_token || '',
          chatId: data.settings.telegram_chat_id || '',
          parseMode: data.settings.telegram_parse_mode || 'HTML',
          disableNotification: data.settings.telegram_disable_notification || false,
          protectContent: data.settings.telegram_protect_content || false
        });

        setDiscordConfig({
          webhook: data.settings.discord_webhook || '',
          username: data.settings.discord_username || 'Hook Signal Bot',
          avatarUrl: data.settings.discord_avatar_url || '',
          embedColor: data.settings.discord_embed_color || '#5865F2'
        });

        setWhatsappConfig({
          token: data.settings.whatsapp_token || '',
          phoneId: data.settings.whatsapp_phone_id || '',
          fromNumber: data.settings.whatsapp_from_number || '',
          businessAccountId: data.settings.whatsapp_business_account_id || ''
        });

        setSlackConfig({
          webhook: data.settings.slack_webhook || '',
          channel: data.settings.slack_channel || '#signals',
          username: data.settings.slack_username || 'Hook Signal',
          iconEmoji: data.settings.slack_icon_emoji || ':signal:'
        });

        setTeamsConfig({
          webhook: data.settings.teams_webhook || '',
          themeColor: data.settings.teams_theme_color || '#6264A7',
          summary: data.settings.teams_summary || 'Signal Alert'
        });

        setCustomWebhook(data.settings.custom_webhook || '');
        setMessageTemplate(data.settings.message_template || '');
        setTemplates(data.settings.templates || []);
        setRoutingRules(data.settings.routing_rules || []);
        
        if (data.settings.webhook_secret) {
          setWebhookSecret({
            key: data.settings.webhook_secret,
            createdAt: data.settings.secret_created_at || new Date().toISOString(),
            expiresAt: data.settings.secret_expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsed: data.settings.secret_last_used || 'Never'
          });
        }

        setLogs(data.settings.logs || []);
        setAnalytics(data.settings.analytics || {
          totalRequests: 0,
          successRate: 0,
          averageResponseTime: 0,
          dailyRequests: [],
          platformUsage: [],
          errorRates: []
        });
      }
    } catch (err) {
      console.error("Error loading data", err);
      showNotification('error', 'حدث خطأ في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = inputSlug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanSlug) {
      showNotification('error', 'الرجاء إدخال اسم مستخدم صحيح');
      return;
    }
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
    showNotification('success', 'تم تسجيل الدخول بنجاح');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    showNotification('info', 'تم تسجيل الخروج');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          username,
          email,
          timezone,
          language,
          telegram_token: telegramConfig.token,
          telegram_chat_id: telegramConfig.chatId,
          telegram_parse_mode: telegramConfig.parseMode,
          telegram_disable_notification: telegramConfig.disableNotification,
          telegram_protect_content: telegramConfig.protectContent,
          discord_webhook: discordConfig.webhook,
          discord_username: discordConfig.username,
          discord_avatar_url: discordConfig.avatarUrl,
          discord_embed_color: discordConfig.embedColor,
          whatsapp_token: whatsappConfig.token,
          whatsapp_phone_id: whatsappConfig.phoneId,
          whatsapp_from_number: whatsappConfig.fromNumber,
          whatsapp_business_account_id: whatsappConfig.businessAccountId,
          slack_webhook: slackConfig.webhook,
          slack_channel: slackConfig.channel,
          slack_username: slackConfig.username,
          slack_icon_emoji: slackConfig.iconEmoji,
          teams_webhook: teamsConfig.webhook,
          teams_theme_color: teamsConfig.themeColor,
          teams_summary: teamsConfig.summary,
          custom_webhook: customWebhook,
          routing_rules: routingRules,
          message_template: messageTemplate,
          templates: templates,
          webhook_secret: webhookSecret.key,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حفظ جميع الإعدادات بنجاح');
        await loadData();
      } else {
        showNotification('error', data.error || 'حدث خطأ في الحفظ');
      }
    } catch (err) {
      showNotification('error', 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟')) return;
    try {
      const res = await fetch(`/api/settings?slug=${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حذف الحساب بنجاح');
        handleLogout();
      }
    } catch (err) {
      showNotification('error', 'حدث خطأ في حذف الحساب');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'تم النسخ بنجاح');
  };

  const regenerateSecret = () => {
    const newSecret = 'whsec_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setWebhookSecret({
      ...webhookSecret,
      key: newSecret,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
    showNotification('success', 'تم توليد مفتاح سري جديد بنجاح');
  };

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  // Routing Rules Functions
  const addRule = useCallback(() => {
    const newRule: RoutingRule = {
      id: Math.random().toString(36).substring(2, 9),
      field: 'signal',
      operator: 'equals',
      value: 'BUY',
      destination: 'telegram',
      priority: routingRules.length + 1,
      enabled: true,
      action: 'send'
    };
    setRoutingRules([...routingRules, newRule]);
  }, [routingRules]);

  const updateRule = useCallback((id: string, key: keyof RoutingRule, value: any) => {
    setRoutingRules(
      routingRules.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule))
    );
  }, [routingRules]);

  const removeRule = useCallback((id: string) => {
    setRoutingRules(routingRules.filter((rule) => rule.id !== id));
  }, [routingRules]);

  const moveRule = useCallback((id: string, direction: 'up' | 'down') => {
    const index = routingRules.findIndex(r => r.id === id);
    if (direction === 'up' && index > 0) {
      const newRules = [...routingRules];
      [newRules[index], newRules[index - 1]] = [newRules[index - 1], newRules[index]];
      setRoutingRules(newRules);
    } else if (direction === 'down' && index < routingRules.length - 1) {
      const newRules = [...routingRules];
      [newRules[index], newRules[index + 1]] = [newRules[index + 1], newRules[index]];
      setRoutingRules(newRules);
    }
  }, [routingRules]);

  // Analytics and Statistics
  const stats = useMemo(() => {
    const total = analytics.totalRequests || 0;
    const success = analytics.successRate || 0;
    const avgTime = analytics.averageResponseTime || 0;
    return { total, success, avgTime };
  }, [analytics]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-gray-900/85 backdrop-blur border border-gray-800 p-8 rounded-2xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
              <Webhook className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Hook Signal Platform
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              لوحة تحكم متقدمة لإدارة وتوجيه إشارات التداول
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                اسم المستخدم (Slug)
              </label>
              <input 
                type="text" 
                value={inputSlug} 
                onChange={(e) => setInputSlug(e.target.value)} 
                placeholder="my-custom-signal"
                required
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition text-sm" 
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              دخول / إنشاء لوحة التحكم
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900/95 border-r border-gray-800 p-4 flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Webhook className="w-6 h-6 text-blue-400" />
            {sidebarOpen && <span className="text-sm font-bold">Hook Signal</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'overview', icon: BarChart3, label: 'نظرة عامة' },
            { id: 'settings', icon: Settings, label: 'الإعدادات' },
            { id: 'rules', icon: Filter, label: 'قواعد التوجيه' },
            { id: 'templates', icon: Layers, label: 'القوالب' },
            { id: 'logs', icon: Activity, label: 'السجل' },
            { id: 'analytics', icon: Globe, label: 'التحليلات' },
            { id: 'security', icon: Shield, label: 'الأمان' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === tab.id 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {sidebarOpen && <span className="text-sm">{tab.label}</span>}
              {sidebarOpen && activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="w-0.5 h-6 bg-blue-400 rounded-full ml-auto"
                />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="border-t border-gray-800 pt-4 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                {activeTab === 'overview' && 'نظرة عامة'}
                {activeTab === 'settings' && 'إعدادات المنصات'}
                {activeTab === 'rules' && 'محرك قواعد التوجيه'}
                {activeTab === 'templates' && 'مصمم القوالب'}
                {activeTab === 'logs' && 'سجل العمليات'}
                {activeTab === 'analytics' && 'التحليلات والإحصائيات'}
                {activeTab === 'security' && 'الأمان والحماية'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                المعرف: <span className="font-mono text-blue-400">{slug}</span>
                <span className={`inline-block w-2 h-2 rounded-full ml-2 ${
                  webhookStatus === 'active' ? 'bg-emerald-400' : 
                  webhookStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 px-4 py-2 rounded-xl">
                <div className="text-xs text-gray-400">الحالة</div>
                <div className={`text-xs font-medium ${
                  webhookStatus === 'active' ? 'text-emerald-400' : 
                  webhookStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {webhookStatus === 'active' ? '🟢 نشط' : 
                   webhookStatus === 'error' ? '🔴 خطأ' : '🟡 غير نشط'}
                </div>
              </div>
              <button
                onClick={loadData}
                className="p-2 bg-gray-900/80 border border-gray-800 rounded-xl hover:bg-gray-800 transition"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </header>

          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
                  notification.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                  notification.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                  'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                }`}
              >
                {notification.type === 'success' && <Check className="w-4 h-4" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4" />}
                {notification.type === 'info' && <Info className="w-4 h-4" />}
                <span className="text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-auto">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSave}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">إجمالي الطلبات</p>
                        <p className="text-2xl font-bold mt-1">{stats.total.toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">نسبة النجاح</p>
                        <p className="text-2xl font-bold mt-1">{stats.success}%</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">متوسط وقت الاستجابة</p>
                        <p className="text-2xl font-bold mt-1">{stats.avgTime}ms</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">المنصات النشطة</p>
                        <p className="text-2xl font-bold mt-1">5</p>
                      </div>
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                  <h3 className="text-sm font-semibold mb-4">إجراءات سريعة</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="flex items-center gap-2 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition text-sm"
                    >
                      <Copy className="w-4 h-4 text-blue-400" />
                      نسخ رابط الويب هوك
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('rules')}
                      className="flex items-center gap-2 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition text-sm"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      إضافة قاعدة جديدة
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="flex items-center gap-2 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition text-sm"
                    >
                      <Layers className="w-4 h-4 text-purple-400" />
                      إنشاء قالب جديد
                    </button>
                    <button
                      type="button"
                      onClick={regenerateSecret}
                      className="flex items-center gap-2 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition text-sm"
                    >
                      <Key className="w-4 h-4 text-yellow-400" />
                      تجديد المفتاح السري
                    </button>
                  </div>
                </div>

                {/* Webhook URL */}
                <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-blue-400">
                    🔗 رابط الويب هوك الخاص بك
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={webhookUrl} 
                      readOnly 
                      className="flex-1 p-3 bg-black/60 border border-gray-700 rounded-xl text-gray-300 text-xs font-mono select-all" 
                    />
                    <button 
                      type="button" 
                      onClick={() => copyToClipboard(webhookUrl)} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-xs font-medium transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      نسخ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                  <h2 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-3 mb-4">
                    ⚙️ إعدادات المنصات وقنوات التنبيه
                  </h2>

                  {/* General Settings */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('general')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">الإعدادات العامة</span>
                      {expandedSections.has('general') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('general') && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">الاسم الظاهري</label>
                            <input 
                              type="text" 
                              value={username} 
                              onChange={(e) => setUsername(e.target.value)} 
                              placeholder="اسمك أو اسم قناتك"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">البريد الإلكتروني</label>
                            <input 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)} 
                              placeholder="your@email.com"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">المنطقة الزمنية</label>
                            <select 
                              value={timezone} 
                              onChange={(e) => setTimezone(e.target.value)}
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition"
                            >
                              <option value="Asia/Riyadh">الرياض (UTC+3)</option>
                              <option value="Asia/Dubai">دبي (UTC+4)</option>
                              <option value="Europe/London">لندن (UTC+0)</option>
                              <option value="America/New_York">نيويورك (UTC-4)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">اللغة</label>
                            <select 
                              value={language} 
                              onChange={(e) => setLanguage(e.target.value)}
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition"
                            >
                              <option value="ar">العربية</option>
                              <option value="en">English</option>
                              <option value="tr">Türkçe</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Telegram */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('telegram')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">Telegram</span>
                      {expandedSections.has('telegram') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('telegram') && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Bot Token</label>
                            <input 
                              type="text" 
                              value={telegramConfig.token} 
                              onChange={(e) => setTelegramConfig({...telegramConfig, token: e.target.value})} 
                              placeholder="123456789:ABC..."
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Chat ID</label>
                            <input 
                              type="text" 
                              value={telegramConfig.chatId} 
                              onChange={(e) => setTelegramConfig({...telegramConfig, chatId: e.target.value})} 
                              placeholder="معرف الشات أو المجموعة"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">نوع التنسيق</label>
                            <select 
                              value={telegramConfig.parseMode} 
                              onChange={(e) => setTelegramConfig({...telegramConfig, parseMode: e.target.value})}
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition"
                            >
                              <option value="HTML">HTML</option>
                              <option value="Markdown">Markdown</option>
                              <option value="MarkdownV2">Markdown V2</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">إخفاء الإشعار</label>
                            <select 
                              value={telegramConfig.disableNotification ? 'true' : 'false'} 
                              onChange={(e) => setTelegramConfig({...telegramConfig, disableNotification: e.target.value === 'true'})}
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition"
                            >
                              <option value="false">لا</option>
                              <option value="true">نعم</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">حماية المحتوى</label>
                            <select 
                              value={telegramConfig.protectContent ? 'true' : 'false'} 
                              onChange={(e) => setTelegramConfig({...telegramConfig, protectContent: e.target.value === 'true'})}
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition"
                            >
                              <option value="false">لا</option>
                              <option value="true">نعم</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Discord */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('discord')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">Discord</span>
                      {expandedSections.has('discord') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('discord') && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Webhook URL</label>
                          <input 
                            type="text" 
                            value={discordConfig.webhook} 
                            onChange={(e) => setDiscordConfig({...discordConfig, webhook: e.target.value})} 
                            placeholder="https://discord.com/api/webhooks/..."
                            className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">اسم البوت</label>
                            <input 
                              type="text" 
                              value={discordConfig.username} 
                              onChange={(e) => setDiscordConfig({...discordConfig, username: e.target.value})} 
                              placeholder="اسم البوت"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">رابط الصورة</label>
                            <input 
                              type="text" 
                              value={discordConfig.avatarUrl} 
                              onChange={(e) => setDiscordConfig({...discordConfig, avatarUrl: e.target.value})} 
                              placeholder="https://..."
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">لون Embed</label>
                            <input 
                              type="color" 
                              value={discordConfig.embedColor} 
                              onChange={(e) => setDiscordConfig({...discordConfig, embedColor: e.target.value})} 
                              className="w-full p-1 bg-black/50 border border-gray-700 rounded-xl h-10 focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('whatsapp')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">WhatsApp Business</span>
                      {expandedSections.has('whatsapp') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('whatsapp') && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Token</label>
                            <input 
                              type="text" 
                              value={whatsappConfig.token} 
                              onChange={(e) => setWhatsappConfig({...whatsappConfig, token: e.target.value})} 
                              placeholder="مفتاح API"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Phone ID</label>
                            <input 
                              type="text" 
                              value={whatsappConfig.phoneId} 
                              onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneId: e.target.value})} 
                              placeholder="معرف الهاتف"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">رقم المرسل</label>
                            <input 
                              type="text" 
                              value={whatsappConfig.fromNumber} 
                              onChange={(e) => setWhatsappConfig({...whatsappConfig, fromNumber: e.target.value})} 
                              placeholder="+1234567890"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Business Account ID</label>
                            <input 
                              type="text" 
                              value={whatsappConfig.businessAccountId} 
                              onChange={(e) => setWhatsappConfig({...whatsappConfig, businessAccountId: e.target.value})} 
                              placeholder="معرف الحساب التجاري"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slack */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('slack')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">Slack</span>
                      {expandedSections.has('slack') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('slack') && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Webhook URL</label>
                          <input 
                            type="text" 
                            value={slackConfig.webhook} 
                            onChange={(e) => setSlackConfig({...slackConfig, webhook: e.target.value})} 
                            placeholder="https://hooks.slack.com/services/..."
                            className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">القناة</label>
                            <input 
                              type="text" 
                              value={slackConfig.channel} 
                              onChange={(e) => setSlackConfig({...slackConfig, channel: e.target.value})} 
                              placeholder="#channel"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">اسم المستخدم</label>
                            <input 
                              type="text" 
                              value={slackConfig.username} 
                              onChange={(e) => setSlackConfig({...slackConfig, username: e.target.value})} 
                              placeholder="اسم المستخدم"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">أيقونة Emoji</label>
                            <input 
                              type="text" 
                              value={slackConfig.iconEmoji} 
                              onChange={(e) => setSlackConfig({...slackConfig, iconEmoji: e.target.value})} 
                              placeholder=":signal:"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('teams')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">Microsoft Teams</span>
                      {expandedSections.has('teams') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('teams') && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Webhook URL</label>
                          <input 
                            type="text" 
                            value={teamsConfig.webhook} 
                            onChange={(e) => setTeamsConfig({...teamsConfig, webhook: e.target.value})} 
                            placeholder="https://outlook.office.com/webhook/..."
                            className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">لون السمة</label>
                            <input 
                              type="color" 
                              value={teamsConfig.themeColor} 
                              onChange={(e) => setTeamsConfig({...teamsConfig, themeColor: e.target.value})} 
                              className="w-full p-1 bg-black/50 border border-gray-700 rounded-xl h-10 focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">الملخص</label>
                            <input 
                              type="text" 
                              value={teamsConfig.summary} 
                              onChange={(e) => setTeamsConfig({...teamsConfig, summary: e.target.value})} 
                              placeholder="ملخص التنبيه"
                              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Webhook */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection('custom')}
                      className="flex items-center justify-between w-full p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition"
                    >
                      <span className="text-sm font-medium">Custom Webhook</span>
                      {expandedSections.has('custom') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedSections.has('custom') && (
                      <div className="mt-4">
                        <label className="block text-xs text-gray-400 mb-1">URL للسيرفر الخارجي</label>
                        <input 
                          type="text" 
                          value={customWebhook} 
                          onChange={(e) => setCustomWebhook(e.target.value)} 
                          placeholder="https://your-external-server.com/receiver"
                          className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 outline-none transition" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
              <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-300">🛡️ محرك الشروط والتصفية المتقدم</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      توجيه التنبيهات بناءً على محتوى رسالة الويب هوك مع أولويات متعددة
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addRule}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    إضافة قاعدة جديدة
                  </button>
                </div>

                {routingRules.length === 0 ? (
                  <div className="text-center py-10 bg-black/30 border border-dashed border-gray-800 rounded-2xl">
                    <p className="text-xs text-gray-500 mb-2">لا توجد قواعد توجيه مضافة حتى الآن</p>
                    <button type="button" onClick={addRule} className="text-xs text-blue-400 underline">
                      أضف قاعدتك الأولى الآن
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routingRules.map((rule, index) => (
                      <motion.div 
                        key={rule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/40 border border-gray-800 p-4 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 bg-gray-800/30 px-2 py-1 rounded-md">
                              الأولوية: {rule.priority}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              rule.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {rule.enabled ? 'مفعل' : 'معطل'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              rule.action === 'send' ? 'bg-blue-500/20 text-blue-400' :
                              rule.action === 'block' ? 'bg-red-500/20 text-red-400' :
                              rule.action === 'transform' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {rule.action === 'send' ? 'إرسال' :
                               rule.action === 'block' ? 'حظر' :
                               rule.action === 'transform' ? 'تحويل' : 'إعادة توجيه'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveRule(rule.id, 'up')}
                              className="p-1 hover:bg-gray-700 rounded transition"
                              disabled={index === 0}
                            >
                              <ChevronUp className={`w-3 h-3 ${index === 0 ? 'text-gray-600' : 'text-gray-400'}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveRule(rule.id, 'down')}
                              className="p-1 hover:bg-gray-700 rounded transition"
                              disabled={index === routingRules.length - 1}
                            >
                              <ChevronDown className={`w-3 h-3 ${index === routingRules.length - 1 ? 'text-gray-600' : 'text-gray-400'}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeRule(rule.id)}
                              className="p-1 hover:bg-red-500/20 rounded transition"
                            >
                              <X className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">الحقل</label>
                            <input
                              type="text"
                              value={rule.field}
                              onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                              className="w-full p-2 bg-black/60 border border-gray-700 rounded-lg text-xs text-white outline-none font-mono"
                              placeholder="signal"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">الشرط</label>
                            <select
                              value={rule.operator}
                              onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                              className="w-full p-2 bg-black/60 border border-gray-700 rounded-lg text-xs text-white outline-none"
                            >
                              <option value="equals">يساوي</option>
                              <option value="contains">يحتوي</option>
                              <option value="starts_with">يبدأ بـ</option>
                              <option value="ends_with">ينتهي بـ</option>
                              <option value="greater_than">أكبر من</option>
                              <option value="less_than">أقل من</option>
                              <option value="regex">Regex</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">القيمة</label>
                            <input
                              type="text"
                              value={rule.value}
                              onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                              className="w-full p-2 bg-black/60 border border-gray-700 rounded-lg text-xs text-white outline-none font-mono"
                              placeholder="BUY"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">التوجيه</label>
                            <select
                              value={rule.destination}
                              onChange={(e) => updateRule(rule.id, 'destination', e.target.value)}
                              className="w-full p-2 bg-black/60 border border-gray-700 rounded-lg text-xs text-white outline-none"
                            >
                              <option value="telegram">Telegram</option>
                              <option value="discord">Discord</option>
                              <option value="whatsapp">WhatsApp</option>
                              <option value="slack">Slack</option>
                              <option value="teams">MS Teams</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">الإجراء</label>
                            <select
                              value={rule.action}
                              onChange={(e) => updateRule(rule.id, 'action', e.target.value)}
                              className="w-full p-2 bg-black/60 border border-gray-700 rounded-lg text-xs text-white outline-none"
                            >
                              <option value="send">إرسال</option>
                              <option value="block">حظر</option>
                              <option value="transform">تحويل</option>
                              <option value="redirect">إعادة توجيه</option>
                            </select>
                          </div>
                        </div>

                        {rule.action === 'transform' && (
                          <div className="mt-3">
                            <label className="block text-[10px] text-gray-400 mb-1">قالب التحويل</label>
                            <input
                              type="text"
                              value={rule.transformTemplate || ''}
                              onChange={(e) => updateRule(rule.id, 'transformTemplate', e.target.value)}
                              className="w-full p-2 bg-black/60 border border-gray-700 rounded-lg text-xs text-white outline-none font-mono"
                              placeholder="تحويل الرسالة إلى: {{message}}"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <label className="flex items-center gap-2 text-xs text-gray-400">
                            <input
                              type="checkbox"
                              checked={rule.enabled}
                              onChange={(e) => updateRule(rule.id, 'enabled', e.target.checked)}
                              className="w-3 h-3 bg-black/50 border border-gray-700 rounded"
                            />
                            تفعيل القاعدة
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                <h2 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-3 mb-4">
                  ✍️ مصمم القوالب الديناميكية للرسائل
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">قالب الرسالة المخصص</label>
                    <textarea 
                      rows={6}
                      value={messageTemplate}
                      onChange={(e) => setMessageTemplate(e.target.value)}
                      placeholder="🚨 تنبيه جديد من {{ticker}}&#10;السعر: {{price}}&#10;الاتجاه: {{signal}}&#10;الوقت: {{time}}"
                      className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white text-xs font-mono focus:border-blue-500 outline-none transition resize-none"
                    />
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-2">المتغيرات المتاحة:</p>
                    <div className="flex flex-wrap gap-2">
                      {['{{ticker}}', '{{price}}', '{{signal}}', '{{time}}', '{{volume}}', '{{change}}', '{{timestamp}}', '{{raw}}'].map((v) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => setMessageTemplate(messageTemplate + ' ' + v)}
                          className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-xs text-blue-400 font-mono hover:bg-gray-800 transition"
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">القوالب المحفوظة</label>
                    <div className="flex gap-2">
                      <select 
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="flex-1 p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition"
                      >
                        <option value="">اختر قالباً محفوظاً</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2"
                      >
                        <Save className="w-3 h-3" />
                        حفظ كقالب
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-300">📊 سجل الأحداث الحية</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      آخر {logs.length} عملية تمت مع تفاصيل الطلب والاستجابة
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      className="p-2 bg-black/50 border border-gray-700 rounded-xl text-white text-xs outline-none"
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                      <option value="all">جميع المنصات</option>
                      <option value="telegram">Telegram</option>
                      <option value="discord">Discord</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="slack">Slack</option>
                      <option value="teams">MS Teams</option>
                    </select>
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-2 bg-black/50 border border-gray-700 rounded-xl text-white text-xs outline-none w-32"
                    />
                    <button
                      type="button"
                      onClick={() => {}}
                      className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 font-mono">
                        <th className="py-3">الوقت</th>
                        <th className="py-3">الحدث</th>
                        <th className="py-3">المصدر</th>
                        <th className="py-3">الحالة</th>
                        <th className="py-3">المدة</th>
                        <th className="py-3 text-right">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50 font-mono text-[11px]">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-800/30 transition">
                          <td className="py-3 text-gray-400">
                            {format(new Date(log.time), 'hh:mm:ss a', { locale: arSA })}
                          </td>
                          <td className="py-3 text-blue-400">{log.event}</td>
                          <td className="py-3 text-gray-400">{log.source}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-md ${
                              log.statusCode >= 200 && log.statusCode < 300 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {log.status} ({log.statusCode})
                            </span>
                          </td>
                          <td className="py-3 text-gray-400">{log.duration}ms</td>
                          <td className="py-3 text-right">
                            <button 
                              type="button" 
                              onClick={() => {}}
                              className="text-blue-400 hover:underline text-xs"
                            >
                              عرض التفاصيل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                <h2 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-3 mb-4">
                  📊 التحليلات والإحصائيات المتقدمة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-400">طلبات ناجحة</p>
                    <p className="text-2xl font-bold mt-1">{stats.success}%</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-400">إجمالي الطلبات</p>
                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-400">متوسط وقت الاستجابة</p>
                    <p className="text-2xl font-bold mt-1">{stats.avgTime}ms</p>
                  </div>
                </div>

                {/* Charts placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800 h-48 flex items-center justify-center">
                    <p className="text-xs text-gray-400">📊 توزيع الطلبات حسب المنصة</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-gray-800 h-48 flex items-center justify-center">
                    <p className="text-xs text-gray-400">📈 الطلبات اليومية</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                <h2 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-3 mb-4">
                  🛡️ حماية وأمن الويب هوك
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">المفتاح السري للتحقق</label>
                    <div className="flex gap-2">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        readOnly 
                        value={webhookSecret.key} 
                        className="flex-1 p-2.5 bg-black/60 border border-gray-700 rounded-xl text-gray-300 text-xs font-mono" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button 
                        type="button" 
                        onClick={regenerateSecret}
                        className="p-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        تجديد
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">تاريخ الإنشاء</p>
                      <p className="text-gray-300 mt-1">{format(new Date(webhookSecret.createdAt), 'dd/MM/yyyy', { locale: arSA })}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">تاريخ الانتهاء</p>
                      <p className="text-gray-300 mt-1">{format(new Date(webhookSecret.expiresAt), 'dd/MM/yyyy', { locale: arSA })}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">آخر استخدام</p>
                      <p className="text-gray-300 mt-1">{webhookSecret.lastUsed || 'لم يستخدم بعد'}</p>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                    <p className="text-[11px] text-gray-400">
                      🔒 يستخدم هذا المفتاح للتحقق من أن الطلبات الواردة إلى رابط الويب هوك الخاص بك تأتي من مصدر موثوق وتمنع أي عمليات إرسال وهمية.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-800 mt-6">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                حفظ جميع الإعدادات
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-medium transition text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف الحساب
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
