"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Webhook, Settings, Database, 
  Terminal, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Save, RefreshCw, Copy, Check, 
  Sparkles, MessageSquare, Send, ShoppingBag, 
  MessageCircle, Mail, Hash, Activity,
  Zap, Filter, Search, Download, 
  BarChart3, ShieldCheck, Menu, X, AlertCircle, Info,
  Building2, Globe, Cpu, Key, Lock, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// الأنواع والواجهات (TypeScript Interfaces)
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
  provider: 'meta' | 'twilio' | 'evolution' | 'green_api';
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string;
  instanceId?: string;
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
  senderName: string;
}

interface SmsChannel extends Channel {
  provider: 'taqnyat' | 'msegat' | 'twilio' | 'vonage';
  apiKey: string;
  senderSenderId: string;
  recipientPhone: string;
}

interface CustomWebhookChannel extends Channel {
  endpointUrl: string;
  secretHeader: string;
  method: 'POST' | 'PUT' | 'GET';
}

interface StoreIntegration {
  id: string | number;
  platform: 'salla' | 'zid' | 'woocommerce' | 'shopify' | 'midad' | 'custom';
  storeName: string;
  apiKey: string;
  webhookSecret: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  storeUrl?: string;
}

interface EnterpriseIntegration {
  id: string | number;
  companyName: string;
  serviceType: 'erpnext' | 'odoo' | 'salesforce' | 'sap' | 'custom_api';
  clientId: string;
  clientSecret: string;
  endpointUrl: string;
  enabled: boolean;
  status: 'active' | 'suspended' | 'pending';
  ipWhitelisting: string[];
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
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>({ show: false, type: 'info', message: '' });

  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('Asia/Riyadh');

  // قنوات الإشعارات الشاملة
  const [telegramChannels, setTelegramChannels] = useState<TelegramChannel[]>([
    { id: 1, name: 'قناة التليجرام الرئيسية', token: '', chatId: '', parseMode: 'HTML', disableNotification: false, protectContent: false, enabled: true, status: 'disconnected' }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState<WhatsAppChannel[]>([
    { id: 1, name: 'رقم واتساب الرسمي', provider: 'meta', phoneNumberId: '', accessToken: '', recipientPhone: '', enabled: true, status: 'disconnected' }
  ]);

  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([
    { id: 1, name: 'قناة سلاك التنبيهات', webhookUrl: '', channelName: '#alerts', enabled: true, status: 'disconnected' }
  ]);

  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[]>([
    { id: 1, name: 'سيرفر الديسكورد', webhookUrl: '', serverName: 'Hook Signals', embedColor: '#5865F2', enabled: true, status: 'disconnected' }
  ]);

  const [emailChannels, setEmailChannels] = useState<EmailChannel[]>([
    { id: 1, name: 'البريد الإلكتروني (SMTP)', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', recipientEmail: '', useSSL: true, senderName: 'HookSignal Bot', enabled: true, status: 'disconnected' }
  ]);

  const [smsChannels, setSmsChannels] = useState<SmsChannel[]>([
    { id: 1, name: 'بوابة الرسائل النصية (SMS)', provider: 'taqnyat', apiKey: '', senderSenderId: 'HookSignal', recipientPhone: '', enabled: true, status: 'disconnected' }
  ]);

  const [customWebhooks, setCustomWebhooks] = useState<CustomWebhookChannel[]>([
    { id: 1, name: 'توصيل ويب هوك خارجي', endpointUrl: '', secretHeader: '', method: 'POST', enabled: true, status: 'disconnected' }
  ]);

  // منصات ومتاجر إلكترونية شاملة
  const [stores, setStores] = useState<StoreIntegration[]>([
    { id: 1, platform: 'salla', storeName: 'متجر سلة الرئيسي', apiKey: '', webhookSecret: '', status: 'disconnected', storeUrl: '' }
  ]);

  // قسم الشركات وربط الأنظمة المؤسسية (B2B / Enterprise)
  const [enterpriseIntegrations, setEnterpriseIntegrations] = useState<EnterpriseIntegration[]>([
    { id: 1, companyName: 'النظام المؤسسي الرئيسي', serviceType: 'erpnext', clientId: '', clientSecret: '', endpointUrl: '', enabled: true, status: 'active', ipWhitelisting: ['127.0.0.1'] }
  ]);

  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');

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

  const loadUserData = async (userSlug: string) => {
    setIsLoading(true);
    try {
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
        if (settings.smsChannels) setSmsChannels(settings.smsChannels);
        if (settings.customWebhooks) setCustomWebhooks(settings.customWebhooks);
        if (settings.stores) setStores(settings.stores);
        if (settings.enterpriseIntegrations) setEnterpriseIntegrations(settings.enterpriseIntegrations);
        if (settings.routingRules) setRoutingRules(settings.routingRules);
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
        username, email, timezone, plan: userPlan,
        telegramChannels, whatsappChannels, slackChannels, discordChannels, emailChannels,
        smsChannels, customWebhooks, stores, enterpriseIntegrations, routingRules, logs
      };
      localStorage.setItem(`settings_${slug}`, JSON.stringify(settings));
      showNotification('success', 'تم حفظ جميع البيانات والإعدادات بنجاح!');
    } catch (error) {
      console.error('Save error:', error);
      showNotification('error', 'حدث خطأ أثناء الحفظ');
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

  // وظائف إدارة القنوات والمتاجر والشركات
  const addChannel = (type: string) => {
    const newId = Date.now();
    switch (type) {
      case 'telegram':
        setTelegramChannels([...telegramChannels, { id: newId, name: 'قناة تليجرام جديدة', token: '', chatId: '', parseMode: 'HTML', disableNotification: false, protectContent: false, enabled: true, status: 'disconnected' }]);
        break;
      case 'whatsapp':
        setWhatsappChannels([...whatsappChannels, { id: newId, name: 'رقم واتساب جديد', provider: 'meta', phoneNumberId: '', accessToken: '', recipientPhone: '', enabled: true, status: 'disconnected' }]);
        break;
      case 'slack':
        setSlackChannels([...slackChannels, { id: newId, name: 'قناة سلاك جديدة', webhookUrl: '', channelName: '#channel', enabled: true, status: 'disconnected' }]);
        break;
      case 'discord':
        setDiscordChannels([...discordChannels, { id: newId, name: 'سيرفر ديسكورد جديد', webhookUrl: '', serverName: 'Discord Server', embedColor: '#5865F2', enabled: true, status: 'disconnected' }]);
        break;
      case 'email':
        setEmailChannels([...emailChannels, { id: newId, name: 'بريد إلكتروني جديد', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', recipientEmail: '', useSSL: true, senderName: 'Bot', enabled: true, status: 'disconnected' }]);
        break;
      case 'sms':
        setSmsChannels([...smsChannels, { id: newId, name: 'بوابة SMS جديدة', provider: 'taqnyat', apiKey: '', senderSenderId: 'Alert', recipientPhone: '', enabled: true, status: 'disconnected' }]);
        break;
      case 'webhook':
        setCustomWebhooks([...customWebhooks, { id: newId, name: 'ويب هوك مخصص جديد', endpointUrl: '', secretHeader: '', method: 'POST', enabled: true, status: 'disconnected' }]);
        break;
    }
    showNotification('success', 'تمت إضافة القناة بنجاح');
  };

  const removeChannel = (type: string, id: string | number) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      telegram: setTelegramChannels, whatsapp: setWhatsappChannels, slack: setSlackChannels,
      discord: setDiscordChannels, email: setEmailChannels, sms: setSmsChannels, webhook: setCustomWebhooks
    };
    const getters: Record<string, any[]> = {
      telegram: telegramChannels, whatsapp: whatsappChannels, slack: slackChannels,
      discord: discordChannels, email: emailChannels, sms: smsChannels, webhook: customWebhooks
    };

    if (getters[type].length > 1) {
      setters[type](getters[type].filter((c: Channel) => c.id !== id));
      showNotification('info', 'تم حذف القناة بنجاح');
    } else {
      showNotification('warning', 'يجب الاحتفاظ بقناة واحدة على الأقل في هذا القسم');
    }
  };

  const toggleChannel = (type: string, id: string | number) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<any>>> = {
      telegram: setTelegramChannels, whatsapp: setWhatsappChannels, slack: setSlackChannels,
      discord: setDiscordChannels, email: setEmailChannels, sms: setSmsChannels, webhook: setCustomWebhooks
    };
    const getters: Record<string, any[]> = {
      telegram: telegramChannels, whatsapp: whatsappChannels, slack: slackChannels,
      discord: discordChannels, email: emailChannels, sms: smsChannels, webhook: customWebhooks
    };

    setters[type](getters[type].map((c: Channel) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const addStore = () => {
    setStores([...stores, { id: Date.now(), platform: 'salla', storeName: 'متجر جديد', apiKey: '', webhookSecret: '', status: 'disconnected', storeUrl: '' }]);
    showNotification('success', 'تمت إضافة المتجر بنجاح');
  };

  const removeStore = (id: string | number) => {
    if (stores.length > 1) {
      setStores(stores.filter(s => s.id !== id));
      showNotification('info', 'تم حذف المتجر');
    } else {
      showNotification('warning', 'يجب الاحتفاظ بمتجر واحد على الأقل');
    }
  };

  const addEnterprise = () => {
    setEnterpriseIntegrations([...enterpriseIntegrations, { id: Date.now(), companyName: 'شركة جديدة', serviceType: 'erpnext', clientId: '', clientSecret: '', endpointUrl: '', enabled: true, status: 'active', ipWhitelisting: [] }]);
    showNotification('success', 'تمت إضافة ربط الشركة بنجاح');
  };

  const removeEnterprise = (id: string | number) => {
    if (enterpriseIntegrations.length > 1) {
      setEnterpriseIntegrations(enterpriseIntegrations.filter(e => e.id !== id));
      showNotification('info', 'تم حذف ربط الشركة');
    } else {
      showNotification('warning', 'يجب الاحتفاظ بربط مؤسسي واحد على الأقل');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-600/20 border border-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Webhook className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold">لوحة التحكم الشاملة للربط والذكاء</h1>
            <p className="text-slate-400 text-xs mt-2">أدخل معرف الحساب (Slug) للوصول إلى لوحتك</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              value={inputSlug}
              onChange={(e) => setInputSlug(e.target.value)}
              placeholder="مثال: company-name"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-center font-mono"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              الدخول للوحة التحكم
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans" dir="rtl">
      <AnimatePresence>
        {notification.show && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-800 shadow-2xl px-5 py-3 rounded-xl flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
            {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الشريط الجانبي */}
      <aside className={`bg-slate-900 border-l border-slate-800 flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            {!sidebarCollapsed && <span className="font-bold text-sm tracking-wide text-blue-400">Hook Signal Pro</span>}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
              { id: 'channels', label: 'قنوات الإشعارات', icon: Send },
              { id: 'stores', label: 'ربط المتاجر', icon: ShoppingBag },
              { id: 'enterprise', label: 'قسم الشركات (B2B)', icon: Building2 },
              { id: 'rules', label: 'قواعد التوجيه والفلترة', icon: Database },
              { id: 'logs', label: 'سجل العمليات (Logs)', icon: Terminal },
              { id: 'settings', label: 'الإعدادات العامة', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${activeTab === item.id ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-3 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all">
            <X className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-base text-slate-200">
              {activeTab === 'dashboard' && 'لوحة المعلومات الرئيسية'}
              {activeTab === 'channels' && 'إدارة قنوات الإشعارات والتنبيهات'}
              {activeTab === 'stores' && 'ربط منصات ومتاجر التجارة الإلكترونية'}
              {activeTab === 'enterprise' && 'قسم الشركات والربط المؤسسي المتقدم (B2B)'}
              {activeTab === 'rules' && 'قواعد التوجيه والأتمتة الذكية'}
              {activeTab === 'logs' && 'سجل الويب هوك والطلبات الواردة'}
              {activeTab === 'settings' && 'إعدادات الحساب والنظام'}
            </h1>
          </div>
          <button onClick={saveUserData} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
            <Save className="w-4 h-4" /> حفظ التغييرات
          </button>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" /> رابط الويب هوك الخاص بك (Webhook URL)
                  </h3>
                  <code className="text-xs text-blue-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg block mt-2 border border-slate-800">{webhookUrl}</code>
                </div>
                <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all">
                  <Copy className="w-4 h-4" /> {copied ? 'تم النسخ!' : 'نسخ الرابط'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-slate-400 text-xs">قنوات الإشعارات النشطة</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-100">
                    {telegramChannels.filter(c => c.enabled).length + whatsappChannels.filter(c => c.enabled).length + slackChannels.filter(c => c.enabled).length + discordChannels.filter(c => c.enabled).length + emailChannels.filter(c => c.enabled).length + smsChannels.filter(c => c.enabled).length}
                  </h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-slate-400 text-xs">المتاجر المرتبطة</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-100">{stores.length}</h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-slate-400 text-xs">حسابات الشركات (B2B)</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-100">{enterpriseIntegrations.length}</h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-slate-400 text-xs">قواعد التوجيه</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-100">{routingRules.length}</h2>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-6">
              
              {/* Telegram Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20"><Send className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">تليجرام (Telegram Bots)</h3>
                      <p className="text-xs text-slate-500">إرسال التنبيهات الفورية للبوتات والمجموعات والقنوات</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('telegram')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all">
                    <Plus className="w-4 h-4" /> إضافة قناة تليجرام
                  </button>
                </div>
                <div className="space-y-3">
                  {telegramChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input type="text" value={channel.name} onChange={(e) => { const u = [...telegramChannels]; u[index].name = e.target.value; setTelegramChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs w-48 text-slate-200" />
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleChannel('telegram', channel.id)} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${channel.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            {channel.enabled ? 'مفعل' : 'معطل'}
                          </button>
                          <button onClick={() => removeChannel('telegram', channel.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="password" placeholder="Bot Token" value={channel.token} onChange={(e) => { const u = [...telegramChannels]; u[index].token = e.target.value; setTelegramChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                        <input type="text" placeholder="Chat ID" value={channel.chatId} onChange={(e) => { const u = [...telegramChannels]; u[index].chatId = e.target.value; setTelegramChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"><MessageCircle className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">واتساب (WhatsApp API)</h3>
                      <p className="text-xs text-slate-500">ربط واتساب بزنس الرسمي أو بوابات الطرف الثالث (Twilio, Evolution)</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('whatsapp')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all">
                    <Plus className="w-4 h-4" /> إضافة واتساب
                  </button>
                </div>
                <div className="space-y-3">
                  {whatsappChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input type="text" value={channel.name} onChange={(e) => { const u = [...whatsappChannels]; u[index].name = e.target.value; setWhatsappChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs w-48 text-slate-200" />
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleChannel('whatsapp', channel.id)} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${channel.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            {channel.enabled ? 'مفعل' : 'معطل'}
                          </button>
                          <button onClick={() => removeChannel('whatsapp', channel.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select value={channel.provider} onChange={(e) => { const u = [...whatsappChannels]; u[index].provider = e.target.value as any; setWhatsappChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200">
                          <option value="meta">Meta Official Cloud API</option>
                          <option value="twilio">Twilio WhatsApp</option>
                          <option value="evolution">Evolution API</option>
                          <option value="green_api">Green API</option>
                        </select>
                        <input type="text" placeholder="Phone Number ID / Instance" value={channel.phoneNumberId} onChange={(e) => { const u = [...whatsappChannels]; u[index].phoneNumberId = e.target.value; setWhatsappChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                        <input type="text" placeholder="Recipient Phone (with country code)" value={channel.recipientPhone} onChange={(e) => { const u = [...whatsappChannels]; u[index].recipientPhone = e.target.value; setWhatsappChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slack & Discord & Email & SMS & Webhook Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Slack */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20"><Hash className="w-5 h-5" /></div>
                      <h3 className="font-bold text-sm text-slate-200">سلاك (Slack Webhooks)</h3>
                    </div>
                    <button onClick={() => addChannel('slack')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-3">
                    {slackChannels.map((channel, index) => (
                      <div key={channel.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                        <input type="text" value={channel.name} onChange={(e) => { const u = [...slackChannels]; u[index].name = e.target.value; setSlackChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs w-full text-slate-200" />
                        <input type="text" placeholder="Webhook URL" value={channel.webhookUrl} onChange={(e) => { const u = [...slackChannels]; u[index].webhookUrl = e.target.value; setSlackChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full font-mono text-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discord */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"><MessageSquare className="w-5 h-5" /></div>
                      <h3 className="font-bold text-sm text-slate-200">ديسكورد (Discord Webhooks)</h3>
                    </div>
                    <button onClick={() => addChannel('discord')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-3">
                    {discordChannels.map((channel, index) => (
                      <div key={channel.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                        <input type="text" value={channel.name} onChange={(e) => { const u = [...discordChannels]; u[index].name = e.target.value; setDiscordChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs w-full text-slate-200" />
                        <input type="text" placeholder="Webhook URL" value={channel.webhookUrl} onChange={(e) => { const u = [...discordChannels]; u[index].webhookUrl = e.target.value; setDiscordChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full font-mono text-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email / SMTP */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20"><Mail className="w-5 h-5" /></div>
                      <h3 className="font-bold text-sm text-slate-200">البريد الإلكتروني (SMTP)</h3>
                    </div>
                    <button onClick={() => addChannel('email')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-3">
                    {emailChannels.map((channel, index) => (
                      <div key={channel.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                        <input type="text" value={channel.name} onChange={(e) => { const u = [...emailChannels]; u[index].name = e.target.value; setEmailChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs w-full text-slate-200" />
                        <input type="text" placeholder="SMTP Host (e.g., smtp.mailgun.org)" value={channel.smtpHost} onChange={(e) => { const u = [...emailChannels]; u[index].smtpHost = e.target.value; setEmailChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full font-mono text-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Gateways */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20"><PhoneCall className="w-5 h-5" /></div>
                      <h3 className="font-bold text-sm text-slate-200">الرسائل النصية القصيرة (SMS)</h3>
                    </div>
                    <button onClick={() => addChannel('sms')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-3">
                    {smsChannels.map((channel, index) => (
                      <div key={channel.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                        <input type="text" value={channel.name} onChange={(e) => { const u = [...smsChannels]; u[index].name = e.target.value; setSmsChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs w-full text-slate-200" />
                        <input type="password" placeholder="API Key / Token" value={channel.apiKey} onChange={(e) => { const u = [...smsChannels]; u[index].apiKey = e.target.value; setSmsChannels(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs w-full font-mono text-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: STORES */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"><ShoppingBag className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">منصات ومتاجر التجارة الإلكترونية</h3>
                      <p className="text-xs text-slate-500">ربط وتلقي طلبات المتاجر (سلة، زد، ووكومرس، شوبيفاي، وغيرها)</p>
                    </div>
                  </div>
                  <button onClick={addStore} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all">
                    <Plus className="w-4 h-4" /> ربط متجر جديد
                  </button>
                </div>
                <div className="space-y-4">
                  {stores.map((store, index) => (
                    <div key={store.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input type="text" value={store.storeName} onChange={(e) => { const u = [...stores]; u[index].storeName = e.target.value; setStores(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs w-48 text-slate-200" />
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeStore(store.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select value={store.platform} onChange={(e) => { const u = [...stores]; u[index].platform = e.target.value as any; setStores(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200">
                          <option value="salla">سلة (Salla Platform)</option>
                          <option value="zid">زد (Zid Platform)</option>
                          <option value="woocommerce">ووكومرس (WooCommerce)</option>
                          <option value="shopify">شوبيفاي (Shopify)</option>
                          <option value="midad">ميداد (Midad)</option>
                          <option value="custom">متجر مخصص (Custom API)</option>
                        </select>
                        <input type="password" placeholder="API Key / Access Token" value={store.apiKey} onChange={(e) => { const u = [...stores]; u[index].apiKey = e.target.value; setStores(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                        <input type="text" placeholder="Webhook Secret" value={store.webhookSecret} onChange={(e) => { const u = [...stores]; u[index].webhookSecret = e.target.value; setStores(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ENTERPRISE (قسم مخصص للشركات) */}
          {activeTab === 'enterprise' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20"><Building2 className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">قسم الشركات وأنظمة الـ B2B المؤسسية</h3>
                      <p className="text-xs text-slate-500">ربط أنظمة التخطيط والموارد (ERPNext, Odoo, Salesforce, SAP) مع صلاحيات أمان عالية</p>
                    </div>
                  </div>
                  <button onClick={addEnterprise} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all">
                    <Plus className="w-4 h-4" /> إضافة ربط شركة جديد
                  </button>
                </div>
                <div className="space-y-4">
                  {enterpriseIntegrations.map((ent, index) => (
                    <div key={ent.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input type="text" value={ent.companyName} onChange={(e) => { const u = [...enterpriseIntegrations]; u[index].companyName = e.target.value; setEnterpriseIntegrations(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs w-48 text-slate-200" />
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeEnterprise(ent.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select value={ent.serviceType} onChange={(e) => { const u = [...enterpriseIntegrations]; u[index].serviceType = e.target.value as any; setEnterpriseIntegrations(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200">
                          <option value="erpnext">ERPNext System</option>
                          <option value="odoo">Odoo ERP</option>
                          <option value="salesforce">Salesforce CRM</option>
                          <option value="sap">SAP Enterprise</option>
                          <option value="custom_api">Custom Enterprise API</option>
                        </select>
                        <input type="text" placeholder="Client ID / App Key" value={ent.clientId} onChange={(e) => { const u = [...enterpriseIntegrations]; u[index].clientId = e.target.value; setEnterpriseIntegrations(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                        <input type="password" placeholder="Client Secret" value={ent.clientSecret} onChange={(e) => { const u = [...enterpriseIntegrations]; u[index].clientSecret = e.target.value; setEnterpriseIntegrations(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200" />
                      </div>
                      <div>
                        <input type="text" placeholder="Endpoint URL" value={ent.endpointUrl} onChange={(e) => { const u = [...enterpriseIntegrations]; u[index].endpointUrl = e.target.value; setEnterpriseIntegrations(u); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono w-full text-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RULES */}
          {activeTab === 'rules' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">قواعد التوجيه والفلترة الذكية</h3>
              <p className="text-xs text-slate-500">قم بإنشاء قواعد لتوجيه الطلبات الواردة بناءً على الشروط (مثل توجيه طلبات سلة إلى تليجرام، وتنبيهات الأخطاء إلى سلاك).</p>
              <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <p className="text-xs text-slate-400">لا توجد قواعد توجيه مضافة حالياً.</p>
                <button onClick={() => {
                  setRoutingRules([...routingRules, { id: Date.now(), name: 'قاعدة جديدة', enabled: true, priority: 1, conditions: [{ field: 'event', operator: 'equals', value: 'order.created' }], action: 'send', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
                  showNotification('success', 'تمت إضافة قاعدة جديدة');
                }} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 rounded-xl transition-all">إضافة قاعدة جديدة</button>
              </div>
            </div>
          )}

          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">سجل العمليات والطلبات الواردة (Logs)</h3>
              <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
                لا توجد طلبات واردة مسجلة في الجلسة الحالية.
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">الإعدادات العامة والحساب</h3>
              <div className="space-y-3 max-w-lg">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">اسم المستخدم</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">البريد الإلكتروني</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200" />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
