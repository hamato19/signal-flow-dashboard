"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Check, 
  Lock, Sparkles, MessageSquare, Send, Globe, ShoppingBag, 
  MessageCircle, Mail, Hash, TrendingUp, Users, Clock, 
  Zap, Filter, Search, Download, Upload, Eye, EyeOff,
  Calendar, BarChart3, PieChart, LineChart, Activity,
  Cpu, Server, Cloud, ShieldCheck, Key, Fingerprint,
  User, AtSign, Phone, Link, ExternalLink, ChevronDown,
  ChevronUp, Menu, X, AlertCircle, Info, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// الأنواع والواجهات
// ============================================

interface Channel {
  id: string | number;
  name: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastUsed?: string;
}

interface TelegramChannel extends Channel {
  token: string;
  chatId: string;
  parseMode: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableNotification: boolean;
  protectContent: boolean;
}

interface WhatsAppChannel extends Channel {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string;
  businessAccountId?: string;
  templateName?: string;
}

interface SlackChannel extends Channel {
  webhookUrl: string;
  channelName: string;
  username?: string;
  iconEmoji?: string;
}

interface DiscordChannel extends Channel {
  webhookUrl: string;
  serverName: string;
  username?: string;
  avatarUrl?: string;
  embedColor?: string;
}

interface EmailChannel extends Channel {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  recipientEmail: string;
  useSSL: boolean;
  fromName?: string;
}

interface StoreIntegration {
  id: string | number;
  platform: 'salla' | 'zid' | 'woocommerce' | 'shopify' | 'custom';
  storeName: string;
  apiKey: string;
  webhookSecret: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  totalOrders?: number;
  storeUrl?: string;
}

interface RoutingRule {
  id: string | number;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'greater_than' | 'less_than';
    value: string;
  }[];
  action: 'send' | 'block' | 'transform' | 'redirect' | 'webhook';
  destination?: string;
  transformTemplate?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    matches: number;
    lastMatch?: string;
  };
}

interface AnalyticsData {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  totalErrors: number;
  uptime: number;
  dailyStats: {
    date: string;
    requests: number;
    errors: number;
    avgTime: number;
  }[];
  platformUsage: {
    platform: string;
    count: number;
    percentage: number;
  }[];
  topRules: {
    ruleId: string;
    name: string;
    matches: number;
  }[];
}

interface WebhookLog {
  id: string | number;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  source: string;
  payload: any;
  response: any;
  ip: string;
  userAgent: string;
  error?: string;
}

// ============================================
// المكون الرئيسي
// ============================================

export default function ControlPanel() {
  // ===== حالة المصادقة =====
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== حالة الواجهة =====
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ===== الإشعارات =====
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>({ show: false, type: 'info', message: '' });

  // ===== خطة المستخدم =====
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('Asia/Riyadh');

  // ===== قنوات الاتصال =====
  const [telegramChannels, setTelegramChannels] = useState<TelegramChannel[]>([
    { 
      id: 1, 
      name: 'القناة الرئيسية', 
      token: '', 
      chatId: '', 
      parseMode: 'HTML',
      disableNotification: false,
      protectContent: false,
      enabled: true,
      status: 'disconnected'
    }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState<WhatsAppChannel[]>([
    { 
      id: 1, 
      name: 'رقم واتساب الرسمي',
      phoneNumberId: '',
      accessToken: '',
      recipientPhone: '',
      enabled: true,
      status: 'disconnected'
    }
  ]);

  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([
    { 
      id: 1, 
      name: 'قناة سلاك', 
      webhookUrl: '', 
      channelName: '#alerts',
      enabled: true,
      status: 'disconnected'
    }
  ]);

  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[]>([
    { 
      id: 1, 
      name: 'سيرفر الديسكورد', 
      webhookUrl: '', 
      serverName: 'Hook Signals',
      embedColor: '#5865F2',
      enabled: true,
      status: 'disconnected'
    }
  ]);

  const [emailChannels, setEmailChannels] = useState<EmailChannel[]>([
    { 
      id: 1, 
      name: 'البريد الإلكتروني',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPass: '',
      recipientEmail: '',
      useSSL: true,
      enabled: true,
      status: 'disconnected'
    }
  ]);

  // ===== المتاجر =====
  const [stores, setStores] = useState<StoreIntegration[]>([
    { 
      id: 1, 
      platform: 'salla', 
      storeName: '', 
      apiKey: '', 
      webhookSecret: '',
      status: 'disconnected'
    }
  ]);

  // ===== القواعد والتحليلات =====
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRequests: 1420,
    successRate: 99.4,
    averageResponseTime: 125,
    totalErrors: 9,
    uptime: 99.97,
    dailyStats: [],
    platformUsage: [],
    topRules: []
  });

  // ===== الرابط العام =====
  const [webhookUrl, setWebhookUrl] = useState('');

  // ============================================
  // المؤثرات الجانبية
  // ============================================

  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug) {
      setSlug(savedSlug);
      setInputSlug(savedSlug);
      setIsLoggedIn(true);
      loadUserData(savedSlug);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    setWebhookUrl(`https://api.hooksignal.com/v1/webhook/${slug}`);
  }, [slug]);

  // ============================================
  // الدوال المساعدة
  // ============================================

  const loadUserData = async (userSlug: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const savedSettings = localStorage.getItem(`settings_${userSlug}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setUsername(settings.username || '');
        setEmail(settings.email || '');
        setTimezone(settings.timezone || 'Asia/Riyadh');
        setUserPlan(settings.plan || 'free');
        
        if (settings.telegramChannels) setTelegramChannels(settings.telegramChannels);
        if (settings.whatsappChannels) setWhatsappChannels(settings.whatsappChannels);
        if (settings.slackChannels) setSlackChannels(settings.slackChannels);
        if (settings.discordChannels) setDiscordChannels(settings.discordChannels);
        if (settings.emailChannels) setEmailChannels(settings.emailChannels);
        if (settings.stores) setStores(settings.stores);
        if (settings.routingRules) setRoutingRules(settings.routingRules);
        if (settings.logs) setLogs(settings.logs);
        if (settings.analytics) setAnalytics(settings.analytics);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async () => {
    setIsLoading(true);
    try {
      const settings = {
        username,
        email,
        timezone,
        plan: userPlan,
        telegramChannels,
        whatsappChannels,
        slackChannels,
        discordChannels,
        emailChannels,
        stores,
        routingRules,
        logs,
        analytics
      };
      
      localStorage.setItem(`settings_${slug}`, JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showNotification('success', 'تم حفظ جميع الإعدادات بنجاح!');
    } catch (error) {
      showNotification('error', 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, duration = 4000) => {
    setNotification({ show: true, type, message, duration });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '' });
    }, duration);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) {
      showNotification('error', 'الرجاء إدخال معرف الحساب');
      return;
    }
    const cleanSlug = inputSlug.trim().toLowerCase().replace(/\s+/g, '-');
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
    loadUserData(cleanSlug);
    showNotification('success', 'تم تسجيل الدخول بنجاح');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    showNotification('info', 'تم تسجيل الخروج');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification('success', 'تم النسخ إلى الحافظة');
  };

  // ===== دوال إدارة القنوات =====

  const addChannel = (type: string) => {
    if (userPlan === 'free') {
      const channelCounts = {
        telegram: telegramChannels.length,
        whatsapp: whatsappChannels.length,
        slack: slackChannels.length,
        discord: discordChannels.length,
        email: emailChannels.length
      };
      
      if (channelCounts[type as keyof typeof channelCounts] >= 1) {
        showNotification('error', 'الخطة المجانية تتيح قناة واحدة فقط لكل نوع. قم بالترقية للباقة الشاملة!');
        return;
      }
    }

    const newChannel = {
      id: Date.now(),
      name: `قناة جديدة ${new Date().toLocaleDateString('ar-SA')}`,
      enabled: true,
      status: 'disconnected' as const,
      lastUsed: undefined
    };

    switch (type) {
      case 'telegram':
        setTelegramChannels([...telegramChannels, { 
          ...newChannel, 
          token: '', 
          chatId: '', 
          parseMode: 'HTML' as const,
          disableNotification: false,
          protectContent: false
        }]);
        break;
      case 'whatsapp':
        setWhatsappChannels([...whatsappChannels, { 
          ...newChannel, 
          phoneNumberId: '', 
          accessToken: '', 
          recipientPhone: '' 
        }]);
        break;
      case 'slack':
        setSlackChannels([...slackChannels, { 
          ...newChannel, 
          webhookUrl: '', 
          channelName: '#channel' 
        }]);
        break;
      case 'discord':
        setDiscordChannels([...discordChannels, { 
          ...newChannel, 
          webhookUrl: '', 
          serverName: 'سيرفر جديد',
          embedColor: '#5865F2'
        }]);
        break;
      case 'email':
        setEmailChannels([...emailChannels, { 
          ...newChannel, 
          smtpHost: '', 
          smtpPort: 587, 
          smtpUser: '', 
          smtpPass: '', 
          recipientEmail: '',
          useSSL: true 
        }]);
        break;
    }
    showNotification('success', 'تمت إضافة القناة بنجاح');
  };

  const removeChannel = (type: string, id: string | number) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      telegram: setTelegramChannels,
      whatsapp: setWhatsappChannels,
      slack: setSlackChannels,
      discord: setDiscordChannels,
      email: setEmailChannels
    };

    const getters: Record<string, any[]> = {
      telegram: telegramChannels,
      whatsapp: whatsappChannels,
      slack: slackChannels,
      discord: discordChannels,
      email: emailChannels
    };

    const setter = setters[type];
    const channels = getters[type];

    if (channels.length > 1) {
      const filtered = channels.filter((c: Channel) => c.id !== id);
      setter(filtered);
      showNotification('info', 'تم حذف القناة بنجاح');
    } else {
      showNotification('warning', 'يجب الاحتفاظ بقناة واحدة على الأقل');
    }
  };

  const toggleChannel = (type: string, id: string | number) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      telegram: setTelegramChannels,
      whatsapp: setWhatsappChannels,
      slack: setSlackChannels,
      discord: setDiscordChannels,
      email: setEmailChannels
    };

    const getters: Record<string, any[]> = {
      telegram: telegramChannels,
      whatsapp: whatsappChannels,
      slack: slackChannels,
      discord: discordChannels,
      email: emailChannels
    };

    const setter = setters[type];
    const channels = getters[type];

    setter(channels.map((c: Channel) => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  // ===== إدارة المتاجر =====

  const addStoreIntegration = () => {
    if (userPlan === 'free' && stores.length >= 1) {
      showNotification('error', 'الخطة المجانية تتيح ربط متجر واحد فقط. قم بالترقية لربط متاجر غير محدودة!');
      return;
    }
    setStores([...stores, { 
      id: Date.now(), 
      platform: 'salla', 
      storeName: '', 
      apiKey: '', 
      webhookSecret: '',
      status: 'disconnected'
    }]);
    showNotification('success', 'تمت إضافة نموذج ربط متجر جديد');
  };

  const removeStoreIntegration = (id: string | number) => {
    if (stores.length > 1) {
      setStores(stores.filter(s => s.id !== id));
      showNotification('info', 'تم حذف المتجر بنجاح');
    } else {
      showNotification('warning', 'يجب الاحتفاظ بمتجر واحد على الأقل');
    }
  };

  const testStoreConnection = (id: string | number) => {
    setStores(stores.map(store => 
      store.id === id 
        ? { ...store, status: store.status === 'connected' ? 'error' : 'connected' as const }
        : store
    ));
    showNotification('success', 'تم اختبار الاتصال بنجاح');
  };

  // ===== إدارة القواعد =====

  const addRoutingRule = () => {
    const newRule: RoutingRule = {
      id: Date.now(),
      name: `قاعدة جديدة #${routingRules.length + 1}`,
      enabled: true,
      priority: routingRules.length + 1,
      conditions: [{ field: 'signal', operator: 'equals', value: 'BUY' }],
      action: 'send',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { matches: 0 }
    };
    setRoutingRules([...routingRules, newRule]);
    showNotification('success', 'تمت إضافة قاعدة جديدة');
  };

  const removeRoutingRule = (id: string | number) => {
    setRoutingRules(routingRules.filter(rule => rule.id !== id));
    showNotification('info', 'تم حذف القاعدة');
  };

  const toggleRoutingRule = (id: string | number) => {
    setRoutingRules(routingRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateRoutingRule = (id: string | number, field: keyof RoutingRule, value: any) => {
    setRoutingRules(routingRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value, updatedAt: new Date().toISOString() } : rule
    ));
  };

  // ============================================
  // حساب الإحصائيات
  // ============================================

  const totalChannels = useMemo(() => {
    return telegramChannels.length + whatsappChannels.length + 
           slackChannels.length + discordChannels.length + emailChannels.length;
  }, [telegramChannels, whatsappChannels, slackChannels, discordChannels, emailChannels]);

  const activeChannels = useMemo(() => {
    const allChannels = [
      ...telegramChannels, 
      ...whatsappChannels, 
      ...slackChannels, 
      ...discordChannels, 
      ...emailChannels
    ];
    return allChannels.filter(c => c.enabled).length;
  }, [telegramChannels, whatsappChannels, slackChannels, discordChannels, emailChannels]);

  const connectedStores = useMemo(() => {
    return stores.filter(s => s.status === 'connected').length;
  }, [stores]);

  // ============================================
  // واجهة تسجيل الدخول
  // ============================================

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Webhook className="w-10 h-10 text-blue-400" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              لوحة التحكم الشاملة
            </h1>
            <p className="text-slate-400 text-sm mt-2">أدخل معرف الحساب (Slug) للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">معرف الحساب (Slug)</label>
              <input 
                type="text" 
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                placeholder="أدخل المعرف الخاص بك"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              الدخول للوحة التحكم
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              ليس لديك حساب؟{' '}
              <button className="text-blue-400 hover:underline">
                إنشاء حساب جديد
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // مكون ChannelSection المساعد (داخل المكون الرئيسي)
  // ============================================

  const ChannelSection = ({ 
    title, 
    icon: Icon, 
    color, 
    channels, 
    setChannels, 
    onAdd, 
    onRemove, 
    onToggle, 
    renderFields 
  }: {
    title: string;
    icon: React.ElementType;
    color: string;
    channels: any[];
    setChannels: React.Dispatch<React.SetStateAction<any[]>>;
    onAdd: () => void;
    onRemove: (id: string | number) => void;
    onToggle: (id: string | number) => void;
    renderFields: (channel: any, index: number, updateChannel: (updated: any) => void) => React.ReactNode;
  }) => {
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
      emerald: 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400',
      amber: 'bg-amber-600/10 border-amber-500/20 text-amber-400',
      indigo: 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400',
      rose: 'bg-rose-600/10 border-rose-500/20 text-rose-400',
    };

    const addButtonColors: Record<string, string> = {
      blue: 'bg-blue-600 hover:bg-blue-500',
      emerald: 'bg-emerald-600 hover:bg-emerald-500',
      amber: 'bg-amber-600 hover:bg-amber-500',
      indigo: 'bg-indigo-600 hover:bg-indigo-500',
      rose: 'bg-rose-600 hover:bg-rose-500',
    };

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`${colorClasses[color] || colorClasses.blue} p-2.5 rounded-xl`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {channels.filter((c: Channel) => c.enabled).length} قناة نشطة
              </p>
            </div>
          </div>
          <button 
            onClick={onAdd}
            className={`${addButtonColors[color] || addButtonColors.blue} text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors shadow-lg`}
          >
            <Plus className="w-4 h-4" /> إضافة قناة
          </button>
        </div>

        <div className="space-y-3">
          {channels.map((channel, index) => (
            <div 
              key={channel.id} 
              className={`bg-slate-950 border p-4 rounded-xl space-y-3 transition-colors ${
                channel.enabled ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    value={channel.name}
                    onChange={(e) => {
                      const updated = [...channels];
                      updated[index].name = e.target.value;
                      setChannels(updated);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs font-medium focus:outline-none focus:border-blue-500 w-40"
                  />
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    channel.status === 'connected' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : channel.status === 'error'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    {channel.status === 'connected' ? '✅ متصل' : 
                     channel.status === 'error' ? '⚠️ خطأ' : '⏳ غير متصل'}
                  </span>
                  {channel.lastUsed && (
                    <span className="text-[10px] text-slate-500">
                      آخر استخدام: {new Date(channel.lastUsed).toLocaleTimeString('ar-SA')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggle(channel.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      channel.enabled 
                        ? 'text-emerald-400 hover:bg-emerald-500/10' 
                        : 'text-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {channel.enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      const updated = [...channels];
                      updated[index].status = 'connected';
                      updated[index].lastUsed = new Date().toISOString();
                      setChannels(updated);
                      showNotification('success', 'تم تحديث حالة القناة');
                    }}
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-blue-400"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemove(channel.id)}
                    className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {renderFields(channel, index, (updated) => {
                const newChannels = [...channels];
                newChannels[index] = updated;
                setChannels(newChannels);
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================
  // الواجهة الرئيسية
  // ============================================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans" dir="rtl">
      
      {/* ===== الإشعارات ===== */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-800 shadow-2xl px-5 py-3 rounded-xl flex items-center gap-3 max-w-md"
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification({ ...notification, show: false })}
              className="mr-auto text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== الشريط الجانبي ===== */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className={`bg-slate-900/50 border-l border-slate-800/80 flex flex-col justify-between ${
          sidebarCollapsed ? 'items-center' : ''
        }`}
      >
        <div className="w-full">
          {/* الهيدر */}
          <div className={`p-4 border-b border-slate-800/80 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-2 rounded-xl text-blue-400">
                  <Webhook className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">Hook Signal</h2>
                  <span className="text-[10px] text-slate-500 truncate block max-w-[100px]">slug: {slug}</span>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-2 rounded-xl text-blue-400">
                <Webhook className="w-6 h-6" />
              </div>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-400 hover:text-white p-1"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* الباقة */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-4">
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">الباقة الحالية</span>
                    <p className="text-xs font-bold capitalize">
                      {userPlan === 'free' ? 'المجانية' : userPlan === 'pro' ? 'PRO الشاملة' : 'الشركات'}
                    </p>
                  </div>
                  {userPlan !== 'enterprise' && (
                    <button 
                      onClick={() => {}}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shadow-lg shadow-blue-600/20"
                    >
                      <Sparkles className="w-3 h-3" /> ترقية
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* قائمة التنقل */}
          <nav className={`${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-1.5`}>
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
              { id: 'channels', label: 'قنوات الإشعارات', icon: Send },
              { id: 'stores', label: 'ربط المتاجر', icon: ShoppingBag },
              { id: 'rules', label: 'قواعد التوجيه', icon: Database },
              { id: 'logs', label: 'سجل العمليات', icon: Terminal },
              { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
              { id: 'settings', label: 'الإعدادات', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  {!sidebarCollapsed && item.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* تسجيل الخروج */}
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-slate-800/80`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors`}
          >
            <LogOut className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
            {!sidebarCollapsed && 'تسجيل الخروج'}
          </button>
        </div>
      </motion.aside>

      {/* ===== المحتوى الرئيسي ===== */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* الهيدر العلوي */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="font-bold text-lg truncate">
              {activeTab === 'dashboard' && '📊 الرئيسية والإحصائيات'}
              {activeTab === 'channels' && '📡 قنوات الإشعارات الشاملة'}
              {activeTab === 'stores' && '🛍️ ربط المتاجر الإلكترونية'}
              {activeTab === 'rules' && '⚙️ محرك قواعد التوجيه'}
              {activeTab === 'logs' && '📋 سجل العمليات'}
              {activeTab === 'analytics' && '📈 التحليلات المتقدمة'}
              {activeTab === 'settings' && '⚙️ الإعدادات العامة'}
            </h1>
            
            {/* شريط البحث */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full px-2 text-slate-300 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* حالة النظام */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-emerald-400 font-medium">نشط</span>
            </div>

            {/* زر الحفظ السريع */}
            <button
              onClick={saveUserData}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              حفظ
            </button>
          </div>
        </header>

        {/* المحتوى */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* ===== تبويب الرئيسية ===== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* رابط الويب هوك */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">🔗 رابط الويب هوك الشامل</h3>
                  <p className="text-xs text-slate-500 mt-1">استقبل الإشارات من جميع المصادر ووجهها لقنواتك</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs font-mono">{webhookUrl}</code>
                  <button 
                    onClick={() => copyToClipboard(webhookUrl)} 
                    className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>

              {/* بطاقات الإحصائيات */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    label: 'إجمالي الطلبات', 
                    value: analytics.totalRequests.toLocaleString(), 
                    icon: Activity, 
                    color: 'blue',
                    change: '+12%'
                  },
                  { 
                    label: 'نسبة النجاح', 
                    value: `${analytics.successRate}%`, 
                    icon: CheckCircle2, 
                    color: 'emerald',
                    change: '+1.2%'
                  },
                  { 
                    label: 'متوسط وقت الاستجابة', 
                    value: `${analytics.averageResponseTime}ms`, 
                    icon: Zap, 
                    color: 'purple',
                    change: '-8ms'
                  },
                  { 
                    label: 'القنوات النشطة', 
                    value: activeChannels, 
                    icon: Send, 
                    color: 'indigo',
                    change: `+${activeChannels - 1}`
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  const colorClasses: Record<string, string> = {
                    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                  };
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
                          <h4 className="text-2xl font-bold mt-1 text-slate-100">{stat.value}</h4>
                          <p className="text-[10px] text-emerald-400 mt-1">{stat.change}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClasses[stat.color]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* معلومات سريعة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">📊 نظرة سريعة</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">القنوات الكلية</span>
                      <span className="font-bold">{totalChannels}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">المتاجر المتصلة</span>
                      <span className="font-bold text-emerald-400">{connectedStores}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">قواعد التوجيه</span>
                      <span className="font-bold text-blue-400">{routingRules.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">وقت التشغيل</span>
                      <span className="font-bold text-emerald-400">{analytics.uptime}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">🚀 الإجراءات السريعة</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActiveTab('channels')}
                      className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> إضافة قناة
                    </button>
                    <button 
                      onClick={() => setActiveTab('stores')}
                      className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> ربط متجر
                    </button>
                    <button 
                      onClick={() => setActiveTab('rules')}
                      className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Filter className="w-3.5 h-3.5" /> قاعدة جديدة
                    </button>
                    <button 
                      onClick={saveUserData}
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 p-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-blue-500/20"
                    >
                      <Save className="w-3.5 h-3.5" /> حفظ الكل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== تبويب قنوات الإشعارات ===== */}
          {activeTab === 'channels' && (
            <div className="space-y-6">
              {/* شريط التحكم العلوي */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">فلتر:</span>
                  <select 
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">جميع القنوات</option>
                    <option value="telegram">تليجرام</option>
                    <option value="whatsapp">واتساب</option>
                    <option value="slack">سلاك</option>
                    <option value="discord">ديسكورد</option>
                    <option value="email">بريد</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    <span className="text-emerald-400 font-bold">{activeChannels}</span> من {totalChannels} قناة نشطة
                  </span>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    {showAdvanced ? 'إخفاء' : 'إظهار'} الإعدادات المتقدمة
                  </button>
                </div>
              </div>

              {/* قناة تليجرام */}
              <ChannelSection
                title="تليجرام (Telegram)"
                icon={Send}
                color="blue"
                channels={telegramChannels}
                setChannels={setTelegramChannels}
                onAdd={() => addChannel('telegram')}
                onRemove={(id) => removeChannel('telegram', id)}
                onToggle={(id) => toggleChannel('telegram', id)}
                renderFields={(channel, index, updateChannel) => (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Bot Token</label>
                        <input 
                          type="password" 
                          value={channel.token}
                          onChange={(e) => updateChannel({ ...channel, token: e.target.value })}
                          placeholder="123456789:ABC..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Chat ID</label>
                        <input 
                          type="text" 
                          value={channel.chatId}
                          onChange={(e) => updateChannel({ ...channel, chatId: e.target.value })}
                          placeholder="-100xxxxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {showAdvanced && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/50">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">نوع التنسيق</label>
                          <select 
                            value={channel.parseMode}
                            onChange={(e) => updateChannel({ ...channel, parseMode: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="HTML">HTML</option>
                            <option value="Markdown">Markdown</option>
                            <option value="MarkdownV2">Markdown V2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">إخفاء الإشعار</label>
                          <select 
                            value={channel.disableNotification ? 'true' : 'false'}
                            onChange={(e) => updateChannel({ ...channel, disableNotification: e.target.value === 'true' })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="false">لا</option>
                            <option value="true">نعم</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">حماية المحتوى</label>
                          <select 
                            value={channel.protectContent ? 'true' : 'false'}
                            onChange={(e) => updateChannel({ ...channel, protectContent: e.target.value === 'true' })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="false">لا</option>
                            <option value="true">نعم</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />

              {/* قناة واتساب */}
              <ChannelSection
                title="واتساب (WhatsApp)"
                icon={MessageCircle}
                color="emerald"
                channels={whatsappChannels}
                setChannels={setWhatsappChannels}
                onAdd={() => addChannel('whatsapp')}
                onRemove={(id) => removeChannel('whatsapp', id)}
                onToggle={(id) => toggleChannel('whatsapp', id)}
                renderFields={(channel, index, updateChannel) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Phone Number ID</label>
                      <input 
                        type="text" 
                        value={channel.phoneNumberId}
                        onChange={(e) => updateChannel({ ...channel, phoneNumberId: e.target.value })}
                        placeholder="10394858..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Access Token</label>
                      <input 
                        type="password" 
                        value={channel.accessToken}
                        onChange={(e) => updateChannel({ ...channel, accessToken: e.target.value })}
                        placeholder="EAAG..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">رقم المستلم</label>
                      <input 
                        type="text" 
                        value={channel.recipientPhone}
                        onChange={(e) => updateChannel({ ...channel, recipientPhone: e.target.value })}
                        placeholder="+9665xxxxxxxx"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              />

              {/* قناة سلاك */}
              <ChannelSection
                title="سلاك (Slack)"
                icon={Hash}
                color="amber"
                channels={slackChannels}
                setChannels={setSlackChannels}
                onAdd={() => addChannel('slack')}
                onRemove={(id) => removeChannel('slack', id)}
                onToggle={(id) => toggleChannel('slack', id)}
                renderFields={(channel, index, updateChannel) => (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Webhook URL</label>
                      <input 
                        type="text" 
                        value={channel.webhookUrl}
                        onChange={(e) => updateChannel({ ...channel, webhookUrl: e.target.value })}
                        placeholder="https://hooks.slack.com/services/..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    {showAdvanced && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/50">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">اسم المستخدم</label>
                          <input 
                            type="text" 
                            value={channel.username || ''}
                            onChange={(e) => updateChannel({ ...channel, username: e.target.value })}
                            placeholder="Hook Signal"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">أيقونة Emoji</label>
                          <input 
                            type="text" 
                            value={channel.iconEmoji || ''}
                            onChange={(e) => updateChannel({ ...channel, iconEmoji: e.target.value })}
                            placeholder=":signal:"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              />

              {/* قناة ديسكورد */}
              <ChannelSection
                title="ديسكورد (Discord)"
                icon={MessageSquare}
                color="indigo"
                channels={discordChannels}
                setChannels={setDiscordChannels}
                onAdd={() => addChannel('discord')}
                onRemove={(id) => removeChannel('discord', id)}
                onToggle={(id) => toggleChannel('discord', id)}
                renderFields={(channel, index, updateChannel) => (
                  <>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Webhook URL</label>
                      <input 
                        type="text" 
                        value={channel.webhookUrl}
                        onChange={(e) => updateChannel({ ...channel, webhookUrl: e.target.value })}
                        placeholder="https://discord.com/api/webhooks/..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    {showAdvanced && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/50">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">اسم البوت</label>
                          <input 
                            type="text" 
                            value={channel.username || ''}
                            onChange={(e) => updateChannel({ ...channel, username: e.target.value })}
                            placeholder="Hook Signal"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">رابط الصورة</label>
                          <input 
                            type="text" 
                            value={channel.avatarUrl || ''}
                            onChange={(e) => updateChannel({ ...channel, avatarUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">لون Embed</label>
                          <input 
                            type="color" 
                            value={channel.embedColor || '#5865F2'}
                            onChange={(e) => updateChannel({ ...channel, embedColor: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1 h-10 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              />

              {/* قناة البريد */}
              <ChannelSection
                title="البريد الإلكتروني (Email)"
                icon={Mail}
                color="rose"
                channels={emailChannels}
                setChannels={setEmailChannels}
                onAdd={() => addChannel('email')}
                onRemove={(id) => removeChannel('email', id)}
                onToggle={(id) => toggleChannel('email', id)}
                renderFields={(channel, index, updateChannel) => (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">SMTP Host</label>
                        <input 
                          type="text" 
                          value={channel.smtpHost}
                          onChange={(e) => updateChannel({ ...channel, smtpHost: e.target.value })}
                          placeholder="smtp.gmail.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">المنفذ (Port)</label>
                        <input 
                          type="number" 
                          value={channel.smtpPort}
                          onChange={(e) => updateChannel({ ...channel, smtpPort: parseInt(e.target.value) || 587 })}
                          placeholder="587"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">اسم المستخدم</label>
                        <input 
                          type="text" 
                          value={channel.smtpUser}
                          onChange={(e) => updateChannel({ ...channel, smtpUser: e.target.value })}
                          placeholder="user@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">كلمة المرور</label>
                        <input 
                          type="password" 
                          value={channel.smtpPass}
                          onChange={(e) => updateChannel({ ...channel, smtpPass: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">البريد المستقبل</label>
                        <input 
                          type="email" 
                          value={channel.recipientEmail}
                          onChange={(e) => updateChannel({ ...channel, recipientEmail: e.target.value })}
                          placeholder="admin@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">استخدام SSL</label>
                        <select 
                          value={channel.useSSL ? 'true' : 'false'}
                          onChange={(e) => updateChannel({ ...channel, useSSL: e.target.value === 'true' })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                        >
                          <option value="true">نعم</option>
                          <option value="false">لا</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              />
            </div>
          )}

          {/* ===== تبويب المتاجر ===== */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-600/10 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">إدارة وربط المتاجر الإلكترونية</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ربط منصات سلة (Salla)، زد (Zid)، ووكومرس (WooCommerce)
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={addStoreIntegration}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/20"
                  >
                    <Plus className="w-4 h-4" /> ربط متجر جديد
                  </button>
                </div>

                <div className="space-y-4">
                  {stores.map((store, index) => (
                    <motion.div 
                      key={store.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-purple-400">
                            متجر #{index + 1}
                          </span>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                            store.status === 'connected' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : store.status === 'error'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {store.status === 'connected' ? '✅ متصل' : 
                             store.status === 'error' ? '⚠️ خطأ' : '⏳ في انتظار التفعيل'}
                          </span>
                          {store.lastSync && (
                            <span className="text-[10px] text-slate-500">
                              آخر مزامنة: {new Date(store.lastSync).toLocaleString('ar-SA')}
                            </span>
                          )}
                        </div>
                        {stores.length > 1 && (
                          <button 
                            onClick={() => removeStoreIntegration(store.id)}
                            className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">منصة المتجر</label>
                          <select 
                            value={store.platform}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].platform = e.target.value as any;
                              setStores(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          >
                            <option value="salla">🟣 سلة (Salla)</option>
                            <option value="zid">🟡 زد (Zid)</option>
                            <option value="woocommerce">🟢 ووكومرس</option>
                            <option value="shopify">🔴 Shopify</option>
                            <option value="custom">⚪ مخصص</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">اسم المتجر</label>
                          <input 
                            type="text" 
                            value={store.storeName}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].storeName = e.target.value;
                              setStores(updated);
                            }}
                            placeholder="اسم المتجر"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">مفتاح API</label>
                          <input 
                            type="password" 
                            value={store.apiKey}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].apiKey = e.target.value;
                              setStores(updated);
                            }}
                            placeholder="api_token_xxxxxxxx"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">رابط المتجر</label>
                          <input 
                            type="text" 
                            value={store.storeUrl || ''}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].storeUrl = e.target.value;
                              setStores(updated);
                            }}
                            placeholder="https://store.com"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                                                <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="font-semibold text-slate-300">Webhook المخصص:</span>
                          <code className="text-purple-400 font-mono bg-slate-950 px-2 py-1 rounded">
                            {webhookUrl}/store/{store.id}
                          </code>
                          <button 
                            onClick={() => copyToClipboard(`${webhookUrl}/store/${store.id}`)}
                            className="text-slate-500 hover:text-slate-300"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => testStoreConnection(store.id)}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> اختبار الاتصال
                          </button>
                          <button 
                            onClick={() => {
                              const updated = [...stores];
                              updated[index].status = 'connected';
                              updated[index].lastSync = new Date().toISOString();
                              setStores(updated);
                              showNotification('success', `تم ربط متجر ${store.storeName || store.id} بنجاح`);
                            }}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" /> حفظ الربط
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== تبويب القواعد ===== */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">⚙️ قواعد توجيه الإشارات الذكية</h3>
                    <p className="text-xs text-slate-500 mt-1">توجيه الرسائل والطلبات بناءً على شروط مخصصة</p>
                  </div>
                  <button 
                    onClick={addRoutingRule}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Plus className="w-4 h-4" /> إضافة قاعدة جديدة
                  </button>
                </div>

                {routingRules.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl">
                    <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">لا توجد قواعد توجيه مضافة</p>
                    <p className="text-xs text-slate-500 mt-1">أضف قاعدتك الأولى لتوجيه الإشارات تلقائياً</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routingRules.map((rule, index) => (
                      <motion.div 
                        key={rule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950 border border-slate-800 p-4 rounded-xl"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-bold text-blue-400">#{index + 1}</span>
                            <input 
                              type="text" 
                              value={rule.name}
                              onChange={(e) => updateRoutingRule(rule.id, 'name', e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs font-medium focus:outline-none focus:border-blue-500 w-40"
                            />
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                              rule.enabled 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}>
                              {rule.enabled ? '✅ مفعل' : '⏸️ معطل'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              الأولوية: {rule.priority}
                            </span>
                            {rule.stats && (
                              <span className="text-[10px] text-slate-500">
                                ⚡ {rule.stats.matches} مطابقة
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleRoutingRule(rule.id)}
                              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                              {rule.enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => removeRoutingRule(rule.id)}
                              className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {rule.conditions.map((condition, cIndex) => (
                            <div key={cIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <input 
                                type="text" 
                                value={condition.field}
                                onChange={(e) => {
                                  const updated = [...routingRules];
                                  updated[index].conditions[cIndex].field = e.target.value;
                                  setRoutingRules(updated);
                                }}
                                placeholder="الحقل"
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                              />
                              <select 
                                value={condition.operator}
                                onChange={(e) => {
                                  const updated = [...routingRules];
                                  updated[index].conditions[cIndex].operator = e.target.value as any;
                                  setRoutingRules(updated);
                                }}
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                              >
                                <option value="equals">يساوي</option>
                                <option value="contains">يحتوي</option>
                                <option value="starts_with">يبدأ بـ</option>
                                <option value="ends_with">ينتهي بـ</option>
                                <option value="regex">Regex</option>
                                <option value="greater_than">أكبر من</option>
                                <option value="less_than">أقل من</option>
                              </select>
                              <input 
                                type="text" 
                                value={condition.value}
                                onChange={(e) => {
                                  const updated = [...routingRules];
                                  updated[index].conditions[cIndex].value = e.target.value;
                                  setRoutingRules(updated);
                                }}
                                placeholder="القيمة"
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                              />
                              <div className="flex items-center gap-2">
                                <select 
                                  value={rule.action}
                                  onChange={(e) => updateRoutingRule(rule.id, 'action', e.target.value)}
                                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                                >
                                  <option value="send">📤 إرسال</option>
                                  <option value="block">🚫 حظر</option>
                                  <option value="transform">🔄 تحويل</option>
                                  <option value="redirect">🔀 إعادة توجيه</option>
                                  <option value="webhook">🌐 Webhook</option>
                                </select>
                                <button 
                                  onClick={() => {
                                    const updated = [...routingRules];
                                    updated[index].conditions.splice(cIndex, 1);
                                    setRoutingRules(updated);
                                  }}
                                  className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-400"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const updated = [...routingRules];
                              updated[index].conditions.push({ field: '', operator: 'equals', value: '' });
                              setRoutingRules(updated);
                            }}
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> إضافة شرط
                          </button>
                        </div>

                        {rule.action === 'transform' && (
                          <div className="mt-3 pt-3 border-t border-slate-800">
                            <label className="block text-[10px] text-slate-400 mb-1">قالب التحويل</label>
                            <input 
                              type="text" 
                              value={rule.transformTemplate || ''}
                              onChange={(e) => updateRoutingRule(rule.id, 'transformTemplate', e.target.value)}
                              placeholder="{{message}} - تم التحويل"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        )}

                        {rule.action === 'webhook' && (
                          <div className="mt-3 pt-3 border-t border-slate-800">
                            <label className="block text-[10px] text-slate-400 mb-1">Webhook URL</label>
                            <input 
                              type="text" 
                              value={rule.webhookUrl || ''}
                              onChange={(e) => updateRoutingRule(rule.id, 'webhookUrl', e.target.value)}
                              placeholder="https://api.example.com/webhook"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== تبويب السجل ===== */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-sm text-slate-200">📋 سجل العمليات والطلبات</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {}}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> تصدير
                    </button>
                    <button 
                      onClick={() => {
                        setLogs([]);
                        showNotification('info', 'تم مسح السجل');
                      }}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> مسح
                    </button>
                  </div>
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl">
                    <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">لا توجد سجلات حتى الآن</p>
                    <p className="text-xs text-slate-500 mt-1">ستظهر هنا جميع العمليات الواردة</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-800">
                        <tr className="text-slate-400">
                          <th className="py-2 px-3">الوقت</th>
                          <th className="py-2 px-3">الطريقة</th>
                          <th className="py-2 px-3">المسار</th>
                          <th className="py-2 px-3">الحالة</th>
                          <th className="py-2 px-3">المدة</th>
                          <th className="py-2 px-3">المصدر</th>
                          <th className="py-2 px-3 text-right">الإجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-2 px-3 text-slate-400 font-mono text-[10px]">
                              {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                log.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                                log.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {log.method}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono text-[10px] text-slate-300">{log.path}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                log.status < 300 ? 'bg-emerald-500/20 text-emerald-400' :
                                log.status < 500 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-rose-500/20 text-rose-400'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-400">{log.duration}ms</td>
                            <td className="py-2 px-3 text-slate-400">{log.source}</td>
                            <td className="py-2 px-3 text-right">
                              <button className="text-blue-400 hover:underline text-[10px]">
                                التفاصيل
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== تبويب التحليلات ===== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <h3 className="font-bold text-sm text-slate-200">📈 التحليلات المتقدمة</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'إجمالي الطلبات', value: analytics.totalRequests, icon: Activity, color: 'blue' },
                    { label: 'نسبة النجاح', value: `${analytics.successRate}%`, icon: CheckCircle2, color: 'emerald' },
                    { label: 'متوسط السرعة', value: `${analytics.averageResponseTime}ms`, icon: Zap, color: 'purple' },
                    { label: 'وقت التشغيل', value: `${analytics.uptime}%`, icon: ShieldCheck, color: 'indigo' },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-400">{stat.label}</p>
                          <div className={`w-7 h-7 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 flex items-center justify-center`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-xl font-bold mt-1">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-300 mb-3">📊 استخدام المنصات</h4>
                    <div className="space-y-2">
                      {analytics.platformUsage.length > 0 ? (
                        analytics.platformUsage.map((item) => (
                          <div key={item.platform} className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">{item.platform}</span>
                            <div className="flex items-center gap-2 flex-1 mx-4">
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-slate-300 font-mono">{item.count}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 text-center py-4">لا توجد بيانات كافية</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-300 mb-3">🏆 القواعد الأكثر استخداماً</h4>
                    <div className="space-y-2">
                      {analytics.topRules.length > 0 ? (
                        analytics.topRules.map((rule) => (
                          <div key={rule.ruleId} className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">{rule.name}</span>
                            <span className="text-emerald-400 font-mono">{rule.matches} مطابقة</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 text-center py-4">لا توجد بيانات كافية</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== تبويب الإعدادات ===== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <h3 className="font-bold text-sm text-slate-200">⚙️ الإعدادات العامة</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">اسم المستخدم</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="اسم المستخدم"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">المنطقة الزمنية</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Asia/Riyadh">🇸🇦 الرياض (UTC+3)</option>
                      <option value="Asia/Dubai">🇦🇪 دبي (UTC+4)</option>
                      <option value="Europe/London">🇬🇧 لندن (UTC+0)</option>
                      <option value="America/New_York">🇺🇸 نيويورك (UTC-4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">الباقة</label>
                    <select 
                      value={userPlan}
                      onChange={(e) => setUserPlan(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="free">🆓 مجانية</option>
                      <option value="pro">💎 PRO</option>
                      <option value="enterprise">🏢 شركات</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex gap-3">
                  <button 
                    onClick={saveUserData}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ التغييرات
                  </button>
                  <button 
                    onClick={() => {
                      showNotification('warning', 'هل أنت متأكد من إعادة تعيين جميع الإعدادات؟');
                    }}
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    إعادة تعيين
                  </button>
                </div>

                {/* معلومات إضافية */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">📌 معلومات الحساب</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">معرف الحساب (Slug)</span>
                      <span className="text-blue-400 font-mono">{slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">عدد القنوات</span>
                      <span className="text-slate-300">{totalChannels}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">المتاجر المتصلة</span>
                      <span className="text-slate-300">{connectedStores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">قواعد التوجيه</span>
                      <span className="text-slate-300">{routingRules.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
                        }
