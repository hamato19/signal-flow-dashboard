"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Lock, 
  Sparkles, MessageSquare, Send, Globe, ShoppingBag, 
  MessageCircle, Mail, Hash, Building2, TrendingUp, 
  PhoneCall, Smartphone, Check, Menu, X, Zap, Cpu, Key, 
  Layers, Users, Activity, Link2, Radio, Bot, Cloud,
  Gift, Star, Crown, Award, Rocket, BarChart3, 
  Wallet, Store, LineChart, Briefcase, HardDrive,
  ChevronLeft, ChevronRight, CircleDot, Dot, 
  RadioReceiver, Network, Satellite, Wifi, 
  Signal, Waves, Antenna, User, ArrowLeft, 
  Fingerprint, ShieldCheck, BadgeCheck, 
  Gem, Sparkle, Clock
} from 'lucide-react';

// ====== Types ======
type NavItem = {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  pro?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

// ====== بيانات المستخدمين المتعددة ======
const USERS_DATA: Record<string, any> = {
  'fahad-dev': {
    username: 'Fahad Al-Otaibi',
    plan: 'pro',
    slug: 'fahad-dev',
    joined: '2024-01-15',
    telegramChannels: [
      { id: 1, botToken: '752109843:AAH_Fahad_Token', chatId: '@fahad_channel', name: 'قناة فهد الرئيسية', isActive: true, lastMessage: '2026-08-09 18:53:08', messagesCount: 1247 }
    ],
    whatsappChannels: [
      { id: 1, phoneNumberId: '10394858', accessToken: 'EAAG_Fahad_Token', recipientPhone: '+966501234567', name: 'واتساب فهد', isActive: true, lastMessage: '2026-08-09 18:52:15', messagesCount: 823 }
    ],
    slackChannels: [
      { id: 1, webhookUrl: 'https://hooks.slack.com/fahad', channelName: '#fahad-alerts', isActive: true, lastMessage: '2026-08-09 18:30:22', messagesCount: 156 }
    ],
    discordChannels: [
      { id: 1, webhookUrl: 'https://discord.com/webhooks/fahad', serverName: 'سيرفر فهد', isActive: true, lastMessage: '2026-08-09 18:25:10', messagesCount: 89 }
    ],
    stores: [
      { id: 1, platform: 'salla', storeName: 'متجر فهد الإلكتروني', apiKey: 'salla_fahad_7x9k2m', webhookSecret: 'sec_fahad_8f3j2k', status: 'connected', lastOrder: '2026-08-09 18:45:12', ordersCount: 542, revenue: '187,450 SAR' }
    ],
    tradingIntegrations: [
      { id: 1, platform: 'tradingview', strategyName: 'Fahad_Scalping_v3', secretKey: 'tv_fahad_9988', actionType: 'alert', marketType: 'crypto', isActive: true, lastSignal: '2026-08-09 18:50:33', signalsCount: 256, winRate: '82.3%' }
    ],
    analytics: {
      totalRequests: 3478,
      successRate: 99.92,
      averageResponseTime: 187,
      activeChannels: 8,
      totalMessages: 3280,
      uptime: 99.98,
      lastWebhook: '2026-08-09 18:53:08',
      dailyGrowth: 15.2
    }
  },
  'sarah-tech': {
    username: 'Sarah Al-Ghamdi',
    plan: 'free',
    slug: 'sarah-tech',
    joined: '2024-06-20',
    telegramChannels: [
      { id: 1, botToken: '752109843:AAH_Sarah_Token', chatId: '@sarah_channel', name: 'قناة سارة التقنية', isActive: true, lastMessage: '2026-08-09 17:30:00', messagesCount: 347 }
    ],
    whatsappChannels: [
      { id: 1, phoneNumberId: '10394858', accessToken: 'EAAG_Sarah_Token', recipientPhone: '+966507654321', name: 'واتساب سارة', isActive: true, lastMessage: '2026-08-09 17:25:00', messagesCount: 223 }
    ],
    slackChannels: [
      { id: 1, webhookUrl: '', channelName: '#sarah-alerts', isActive: false, lastMessage: '', messagesCount: 0 }
    ],
    discordChannels: [
      { id: 1, webhookUrl: '', serverName: 'سيرفر سارة', isActive: false, lastMessage: '', messagesCount: 0 }
    ],
    stores: [
      { id: 1, platform: 'shopify', storeName: 'متجر سارة للأزياء', apiKey: 'shopify_sarah_3x9k2m', webhookSecret: 'sec_sarah_7f3j2k', status: 'connected', lastOrder: '2026-08-09 17:12:00', ordersCount: 142, revenue: '47,450 SAR' }
    ],
    tradingIntegrations: [
      { id: 1, platform: 'binance', strategyName: 'Sarah_DCA_Strategy', secretKey: 'bn_sarah_6677', actionType: 'alert', marketType: 'crypto', isActive: true, lastSignal: '2026-08-09 17:30:33', signalsCount: 56, winRate: '68.5%' }
    ],
    analytics: {
      totalRequests: 1478,
      successRate: 97.87,
      averageResponseTime: 243,
      activeChannels: 4,
      totalMessages: 1280,
      uptime: 99.85,
      lastWebhook: '2026-08-09 17:30:08',
      dailyGrowth: 8.2
    }
  },
  'mohammad-pro': {
    username: 'Mohammad Al-Malki',
    plan: 'pro',
    slug: 'mohammad-pro',
    joined: '2023-11-01',
    telegramChannels: [
      { id: 1, botToken: '752109843:AAH_Mohammad_Token', chatId: '@mohammad_channel', name: 'قناة محمد الاستثمارية', isActive: true, lastMessage: '2026-08-09 18:55:00', messagesCount: 2156 }
    ],
    whatsappChannels: [
      { id: 1, phoneNumberId: '10394858', accessToken: 'EAAG_Mohammad_Token', recipientPhone: '+966508765432', name: 'واتساب محمد', isActive: true, lastMessage: '2026-08-09 18:50:00', messagesCount: 1423 }
    ],
    slackChannels: [
      { id: 1, webhookUrl: 'https://hooks.slack.com/mohammad', channelName: '#mohammad-alerts', isActive: true, lastMessage: '2026-08-09 18:30:22', messagesCount: 256 }
    ],
    discordChannels: [
      { id: 1, webhookUrl: 'https://discord.com/webhooks/mohammad', serverName: 'سيرفر محمد', isActive: true, lastMessage: '2026-08-09 18:25:10', messagesCount: 189 }
    ],
    stores: [
      { id: 1, platform: 'zid', storeName: 'متجر محمد للتقنية', apiKey: 'zid_mohammad_4x7k2m', webhookSecret: 'sec_mohammad_2f3j2k', status: 'connected', lastOrder: '2026-08-09 18:30:00', ordersCount: 842, revenue: '287,450 SAR' }
    ],
    tradingIntegrations: [
      { id: 1, platform: 'metatrader', strategyName: 'Mohammad_Forex_Elite', secretKey: 'mt_mohammad_9988', actionType: 'alert', marketType: 'forex', isActive: true, lastSignal: '2026-08-09 18:45:00', signalsCount: 456, winRate: '75.5%' }
    ],
    analytics: {
      totalRequests: 5478,
      successRate: 99.95,
      averageResponseTime: 156,
      activeChannels: 10,
      totalMessages: 5280,
      uptime: 99.99,
      lastWebhook: '2026-08-09 18:55:00',
      dailyGrowth: 22.5
    }
  }
};

export default function ControlPanel() {
  // ====== State Management ======
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [username, setUsername] = useState('');
  const [userPlan, setUserPlan] = useState('free');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // ====== Channel States ======
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, botToken: '', chatId: '', name: 'قناة تلجرام الرئيسية', isActive: false, lastMessage: '', messagesCount: 0 }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState([
    { id: 1, phoneNumberId: '', accessToken: '', recipientPhone: '', name: 'قناة واتساب #1', isActive: false, lastMessage: '', messagesCount: 0 }
  ]);

  const [slackChannels, setSlackChannels] = useState([
    { id: 1, webhookUrl: '', channelName: '#alerts', isActive: false, lastMessage: '', messagesCount: 0 }
  ]);

  const [discordChannels, setDiscordChannels] = useState([
    { id: 1, webhookUrl: '', serverName: 'سيرفر الديسكورد', isActive: false, lastMessage: '', messagesCount: 0 }
  ]);

  const [smsChannels, setSmsChannels] = useState([
    { id: 1, provider: 'taqnyat', apiKey: '', senderName: '', recipientPhone: '', isActive: false, lastMessage: '', messagesCount: 0 }
  ]);

  const [pushoverChannels, setPushoverChannels] = useState([
    { id: 1, userKey: '', apiToken: '', name: 'تنبيهات Pushover الفورية', isActive: false, lastMessage: '', messagesCount: 0 }
  ]);

  // ====== Integration States ======
  const [stores, setStores] = useState([
    { id: 1, platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected', lastOrder: '', ordersCount: 0, revenue: '0 SAR' }
  ]);

  const [tradingIntegrations, setTradingIntegrations] = useState([
    { id: 1, platform: 'tradingview', strategyName: '', secretKey: '', actionType: 'alert', marketType: 'crypto', isActive: false, lastSignal: '', signalsCount: 0, winRate: '0%' }
  ]);

  const [enterpriseTeams, setEnterpriseTeams] = useState([
    { id: 1, companyName: '', department: 'التقنية والبرمجيات', role: 'مدير النظام الأساسي', webhookKey: '', autoRouting: true, memberCount: 5, securityLevel: 'عالي (Encrypted)', lastActivity: '' }
  ]);

  const [routingRules, setRoutingRules] = useState([
    { id: 1, condition: 'payload.type === "order"', action: 'إرسال إلى تلجرام', isActive: true },
    { id: 2, condition: 'payload.amount > 1000', action: 'إرسال إلى واتساب', isActive: true },
    { id: 3, condition: 'payload.severity === "critical"', action: 'إرسال إلى جميع القنوات', isActive: true }
  ]);

  // ====== Analytics Data ======
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    successRate: 99.87,
    averageResponseTime: 243,
    activeChannels: 0,
    totalMessages: 0,
    uptime: 99.95,
    lastWebhook: '',
    dailyGrowth: 0,
    requestsByChannel: {
      telegram: 0,
      whatsapp: 0,
      email: 0,
      pushover: 0,
      slack: 0,
      discord: 0
    },
    responseTimeByChannel: {
      telegram: 125,
      whatsapp: 187,
      email: 412,
      pushover: 89,
      slack: 234,
      discord: 156
    },
    tradingStats: {
      totalSignals: 0,
      successfulTrades: 0,
      winRate: 0,
      totalProfit: '0 SAR',
      activeStrategies: 0
    },
    storeStats: {
      totalOrders: 0,
      totalRevenue: '0 SAR',
      averageOrder: '0 SAR',
      conversionRate: 0
    }
  });

  // ====== Sidebar Navigation Structure ======
  const navSections: NavSection[] = [
    {
      title: 'الرئيسية',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, badge: 'Live' },
      ]
    },
    {
      title: 'قنوات الإشعارات',
      items: [
        { id: 'integrations', label: 'جميع القنوات', icon: Webhook, badge: String(analytics.activeChannels) },
        { id: 'telegram', label: 'تلجرام', icon: Send },
        { id: 'whatsapp', label: 'واتساب', icon: MessageCircle },
        { id: 'sms', label: 'SMS & Pushover', icon: Smartphone },
      ]
    },
    {
      title: 'التكاملات',
      items: [
        { id: 'trading', label: 'منصات التداول', icon: TrendingUp, badge: String(analytics.tradingStats.totalSignals) },
        { id: 'stores', label: 'المتاجر الإلكترونية', icon: ShoppingBag, badge: String(analytics.storeStats.totalOrders) },
        { id: 'enterprise', label: 'الشركات والأقسام', icon: Building2, pro: true },
      ]
    },
    {
      title: 'الإدارة',
      items: [
        { id: 'rules', label: 'قواعد التوجيه', icon: Database },
        { id: 'logs', label: 'سجل العمليات', icon: Terminal },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
      ]
    }
  ];

  // ====== Effects ======
  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug && USERS_DATA[savedSlug]) {
      setSlug(savedSlug);
      setInputSlug(savedSlug);
      loadUserData(savedSlug);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    setWebhookUrl(`https://api.hooksignal.com/v1/webhook/${slug}`);
  }, [slug]);

  // ====== Load User Data ======
  const loadUserData = (userSlug: string) => {
    const userData = USERS_DATA[userSlug];
    if (!userData) {
      showNotification('error', '❌ المستخدم غير موجود');
      return;
    }

    setCurrentUserData(userData);
    setUsername(userData.username);
    setUserPlan(userData.plan);
    setIsLoggedIn(true);

    if (userData.telegramChannels) setTelegramChannels(userData.telegramChannels);
    if (userData.whatsappChannels) setWhatsappChannels(userData.whatsappChannels);
    if (userData.slackChannels) setSlackChannels(userData.slackChannels);
    if (userData.discordChannels) setDiscordChannels(userData.discordChannels);
    if (userData.stores) setStores(userData.stores);
    if (userData.tradingIntegrations) setTradingIntegrations(userData.tradingIntegrations);

    if (userData.analytics) {
      setAnalytics(prev => ({
        ...prev,
        ...userData.analytics,
        requestsByChannel: {
          telegram: userData.telegramChannels?.reduce((acc: number, c: any) => acc + (c.messagesCount || 0), 0) || 0,
          whatsapp: userData.whatsappChannels?.reduce((acc: number, c: any) => acc + (c.messagesCount || 0), 0) || 0,
          slack: userData.slackChannels?.reduce((acc: number, c: any) => acc + (c.messagesCount || 0), 0) || 0,
          discord: userData.discordChannels?.reduce((acc: number, c: any) => acc + (c.messagesCount || 0), 0) || 0,
          email: 0,
          pushover: 0
        },
        tradingStats: {
          totalSignals: userData.tradingIntegrations?.[0]?.signalsCount || 0,
          successfulTrades: Math.floor((userData.tradingIntegrations?.[0]?.signalsCount || 0) * (parseFloat(userData.tradingIntegrations?.[0]?.winRate || '0') / 100)),
          winRate: parseFloat(userData.tradingIntegrations?.[0]?.winRate || '0'),
          totalProfit: userData.tradingIntegrations?.[0]?.totalProfit || '+0 SAR',
          activeStrategies: userData.tradingIntegrations?.filter((t: any) => t.isActive).length || 0
        },
        storeStats: {
          totalOrders: userData.stores?.[0]?.ordersCount || 0,
          totalRevenue: userData.stores?.[0]?.revenue || '0 SAR',
          averageOrder: userData.stores?.[0]?.ordersCount > 0 ? `${(parseInt(userData.stores?.[0]?.revenue?.replace(/,/g, '') || '0') / userData.stores?.[0]?.ordersCount).toFixed(2)} SAR` : '0 SAR',
          conversionRate: 4.2
        }
      }));
    }

    showNotification('success', `👋 مرحباً ${userData.username}`);
  };

  // ====== Save to DB ======
  const saveUserDataToDB = async () => {
    if (!slug) return;
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('success', '✅ تم حفظ بيانات المستخدم بنجاح');
    } catch (e: any) {
      showNotification('error', '❌ حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  // ====== Notifications ======
  const showNotification = (type: string, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '' });
    }, 4000);
  };

  // ====== Auto Connect ======
  const handleAutoConnect = (sectionName: string) => {
    showNotification('success', `🔗 جاري الاتصال التلقائي مع (${sectionName})...`);

    setTimeout(() => {
      let success = true;
      
      if (sectionName === 'تلجرام' || sectionName === 'Telegram') {
        setTelegramChannels(prev => prev.map((c, i) => 
          i === 0 ? { 
            ...c, 
            botToken: `752109843:AAH_${slug}_Token_${Date.now()}`,
            chatId: `@${slug}_channel`,
            isActive: true,
            lastMessage: new Date().toISOString().replace('T', ' ').slice(0, 19),
            messagesCount: (c.messagesCount || 0) + 1
          } : c
        ));
        setAnalytics(prev => ({ 
          ...prev, 
          activeChannels: prev.activeChannels + 1,
          totalRequests: prev.totalRequests + 1
        }));
        
      } else if (sectionName === 'واتساب' || sectionName === 'WhatsApp') {
        setWhatsappChannels(prev => prev.map((c, i) => 
          i === 0 ? { 
            ...c, 
            phoneNumberId: `10394858_${slug}`,
            accessToken: `EAAG_${slug}_Token_${Date.now()}`,
            recipientPhone: '+9665xxxxxxxx',
            isActive: true,
            lastMessage: new Date().toISOString().replace('T', ' ').slice(0, 19),
            messagesCount: (c.messagesCount || 0) + 1
          } : c
        ));
        setAnalytics(prev => ({ 
          ...prev, 
          activeChannels: prev.activeChannels + 1,
          totalRequests: prev.totalRequests + 1
        }));
        
      } else if (sectionName === 'سلة' || sectionName === 'المتاجر') {
        setStores(prev => prev.map((s, i) => 
          i === 0 ? { 
            ...s, 
            status: 'connected', 
            storeName: `متجر ${username}`,
            apiKey: `${s.platform}_${slug}_${Math.random().toString(36).substring(7)}`,
            webhookSecret: `sec_${slug}_${Math.random().toString(36).substring(7)}`,
            lastOrder: new Date().toISOString().replace('T', ' ').slice(0, 19),
            ordersCount: (s.ordersCount || 0) + 1,
            revenue: (s.revenue || '0 SAR')
          } : s
        ));
        
      } else if (sectionName === 'TradingView' || sectionName === 'التداول') {
        setTradingIntegrations(prev => prev.map((t, i) => 
          i === 0 ? { 
            ...t, 
            strategyName: `${username}_Strategy_v${Math.floor(Math.random() * 5) + 1}`,
            secretKey: `${t.platform}_${slug}_${Math.random().toString(36).substring(7)}`,
            isActive: true,
            lastSignal: new Date().toISOString().replace('T', ' ').slice(0, 19),
            signalsCount: (t.signalsCount || 0) + 1,
            winRate: `${(Math.random() * 20 + 70).toFixed(1)}%`
          } : t
        ));
        
      } else {
        success = false;
        showNotification('info', `ℹ️ تم تفعيل الربط التلقائي لقسم ${sectionName}.`);
      }

      if (success) {
        showNotification('success', `✅ تم الربط التلقائي لـ (${sectionName}) بنجاح!`);
        setTimeout(() => saveUserDataToDB(), 300);
      }
    }, 800);
  };

  // ====== Test Webhook ======
  const handleTestWebhook = (channelName: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    showNotification('success', `📨 تم إرسال رسالة تجريبية إلى (${channelName}) في ${now}`);
    setAnalytics(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      lastWebhook: now,
      totalMessages: prev.totalMessages + 1
    }));
  };

  // ====== Channel Management ======
  const addChannel = (type: string) => {
    const maxFreeChannels = userPlan === 'free' ? 2 : 10;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    if (type === 'telegram') {
      if (telegramChannels.length >= maxFreeChannels) {
        showNotification('error', `⚠️ الحد الأقصى للقنوات هو ${maxFreeChannels}`);
        return;
      }
      setTelegramChannels([...telegramChannels, { 
        id: Date.now(), 
        botToken: '', 
        chatId: '', 
        name: `قناة تلجرام ${telegramChannels.length + 1}`,
        isActive: false,
        lastMessage: now,
        messagesCount: 0
      }]);
    } else if (type === 'whatsapp') {
      if (whatsappChannels.length >= maxFreeChannels) {
        showNotification('error', `⚠️ الحد الأقصى للقنوات هو ${maxFreeChannels}`);
        return;
      }
      setWhatsappChannels([...whatsappChannels, { 
        id: Date.now(), 
        phoneNumberId: '', 
        accessToken: '', 
        recipientPhone: '', 
        name: `قناة واتساب ${whatsappChannels.length + 1}`,
        isActive: false,
        lastMessage: now,
        messagesCount: 0
      }]);
    } else if (type === 'slack') {
      setSlackChannels([...slackChannels, { 
        id: Date.now(), 
        webhookUrl: '', 
        channelName: `#channel-${slackChannels.length + 1}`,
        isActive: false,
        lastMessage: now,
        messagesCount: 0
      }]);
    } else if (type === 'discord') {
      setDiscordChannels([...discordChannels, { 
        id: Date.now(), 
        webhookUrl: '', 
        serverName: `سيرفر ديسكورد ${discordChannels.length + 1}`,
        isActive: false,
        lastMessage: now,
        messagesCount: 0
      }]);
    } else if (type === 'sms') {
      setSmsChannels([...smsChannels, { 
        id: Date.now(), 
        provider: 'taqnyat', 
        apiKey: '', 
        senderName: `${username}`, 
        recipientPhone: '',
        isActive: false,
        lastMessage: now,
        messagesCount: 0
      }]);
    } else if (type === 'pushover') {
      setPushoverChannels([...pushoverChannels, { 
        id: Date.now(), 
        userKey: '', 
        apiToken: '', 
        name: `Pushover ${pushoverChannels.length + 1}`,
        isActive: false,
        lastMessage: now,
        messagesCount: 0
      }]);
    }
    showNotification('success', '✅ تمت إضافة القناة بنجاح');
  };

  const removeChannel = (type: string, id: number) => {
    const minChannels = 1;
    
    if (type === 'telegram' && telegramChannels.length > minChannels) {
      setTelegramChannels(telegramChannels.filter(c => c.id !== id));
    } else if (type === 'whatsapp' && whatsappChannels.length > minChannels) {
      setWhatsappChannels(whatsappChannels.filter(c => c.id !== id));
    } else if (type === 'slack' && slackChannels.length > minChannels) {
      setSlackChannels(slackChannels.filter(c => c.id !== id));
    } else if (type === 'discord' && discordChannels.length > minChannels) {
      setDiscordChannels(discordChannels.filter(c => c.id !== id));
    } else if (type === 'sms' && smsChannels.length > minChannels) {
      setSmsChannels(smsChannels.filter(c => c.id !== id));
    } else if (type === 'pushover' && pushoverChannels.length > minChannels) {
      setPushoverChannels(pushoverChannels.filter(c => c.id !== id));
    } else {
      showNotification('error', '⚠️ يجب الاحتفاظ بقناة واحدة على الأقل نشطة.');
    }
    showNotification('info', '🗑️ تم حذف القناة بنجاح');
  };

  // ====== Store Management ======
  const addStoreIntegration = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setStores([...stores, { 
      id: Date.now(), 
      platform: 'salla', 
      storeName: '', 
      apiKey: '', 
      webhookSecret: '', 
      status: 'disconnected',
      lastOrder: now,
      ordersCount: 0,
      revenue: '0 SAR'
    }]);
    showNotification('success', '✅ تمت إضافة نموذج ربط متجر جديد');
  };

  const removeStoreIntegration = (id: number) => {
    if (stores.length > 1) {
      setStores(stores.filter(s => s.id !== id));
      showNotification('info', '🗑️ تم حذف المتجر بنجاح');
    } else {
      showNotification('error', '⚠️ يجب الاحتفاظ بمتجر واحد على الأقل.');
    }
  };

  // ====== Trading Management ======
  const addTradingIntegration = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setTradingIntegrations([...tradingIntegrations, { 
      id: Date.now(), 
      platform: 'tradingview', 
      strategyName: '', 
      secretKey: '', 
      actionType: 'alert', 
      marketType: 'crypto',
      isActive: false,
      lastSignal: now,
      signalsCount: 0,
      winRate: '0%'
    }]);
    showNotification('success', '✅ تمت إضافة منصة التداول بنجاح');
  };

  const removeTradingIntegration = (id: number) => {
    if (tradingIntegrations.length > 1) {
      setTradingIntegrations(tradingIntegrations.filter(t => t.id !== id));
      showNotification('info', '🗑️ تم حذف منصة التداول بنجاح');
    } else {
      showNotification('error', '⚠️ يجب الاحتفاظ بمنصة تداول واحدة على الأقل.');
    }
  };

  // ====== Enterprise Management ======
  const addEnterpriseTeam = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setEnterpriseTeams([...enterpriseTeams, { 
      id: Date.now(), 
      companyName: '', 
      department: 'الإدارة العامة', 
      role: 'مشرف قسم', 
      webhookKey: '', 
      autoRouting: true, 
      memberCount: 3, 
      securityLevel: 'عالي (Encrypted)',
      lastActivity: now
    }]);
    showNotification('success', '✅ تمت إضافة فرع الشركة بنجاح');
  };

  const removeEnterpriseTeam = (id: number) => {
    if (enterpriseTeams.length > 1) {
      setEnterpriseTeams(enterpriseTeams.filter(e => e.id !== id));
      showNotification('info', '🗑️ تم حذف فرع الشركة بنجاح');
    } else {
      showNotification('error', '⚠️ يجب الاحتفاظ بفريق واحد على الأقل.');
    }
  };

  // ====== Auth Functions ======
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) return;
    
    const cleanSlug = inputSlug.trim().toLowerCase();
    
    if (USERS_DATA[cleanSlug]) {
      setIsLoading(true);
      localStorage.setItem('user_slug', cleanSlug);
      setSlug(cleanSlug);
      loadUserData(cleanSlug);
      setIsLoading(false);
    } else {
      showNotification('error', '❌ المستخدم غير موجود. تأكد من كتابة المعرف بشكل صحيح.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    setCurrentUserData(null);
    showNotification('info', '👋 تم تسجيل الخروج بأمان');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToPricing = () => {
    window.location.href = '/pricing';
  };

  // ====== Render: Login Screen ======
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="#9C92AC" fillOpacity="0.05"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-4 rounded-2xl inline-block shadow-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/30 p-3 rounded-xl">
                    <Webhook className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mt-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              منصة ويب هوك العربية الشاملة
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              أدخل معرف حسابك المستقل (Slug) للدخول إلى لوحة التحكم الخاصة بك
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  معرف الحساب المستقل (Slug)
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <input 
                      type="text" 
                      value={inputSlug}
                      onChange={(e) => setInputSlug(e.target.value)}
                      placeholder="e.g. fahad-dev"
                      className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <Key className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] text-slate-500">مستخدمين تجريبيين:</span>
                  {Object.keys(USERS_DATA).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setInputSlug(key)}
                      className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-blue-400 hover:bg-slate-700 transition-colors"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-medium py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      تسجيل الدخول
                      <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-600">
              © 2026 Hook Signal - جميع الحقوق محفوظة
              <span className="mx-2">•</span>
              <span className="text-slate-500">v2.4.1</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ====== Main Dashboard Render ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex font-sans relative" dir="rtl">
      
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-5 left-5 z-50 bg-slate-900 border shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in ${
          notification.type === 'success' ? 'border-emerald-500/30' :
          notification.type === 'error' ? 'border-rose-500/30' : 'border-blue-500/30'
        }`}>
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Onboarding Wizard */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-100">دليلك السريع للبدء مع Hook Signal</h3>
              </div>
              <button onClick={() => { setShowWizard(false); localStorage.setItem(`wizard_seen_${slug}`, 'true'); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {wizardStep === 1 && (
                <div className="space-y-2">
                  <span className="text-xs text-blue-400 font-bold">الخطوة 1 من 3</span>
                  <h4 className="font-bold text-lg">انسخ رابط الويب هوك الخاص بك</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">هذا الرابط المخصص هو بوابتك لاستقبال الإشارات والطلبات.</p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-blue-400">
                    <span className="truncate">{webhookUrl}</span>
                    <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-white px-2 py-1 rounded hover:bg-slate-700 transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-2">
                  <span className="text-xs text-blue-400 font-bold">الخطوة 2 من 3</span>
                  <h4 className="font-bold text-lg">استخدم "الربط التلقائي" بنقرة واحدة</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">وفر الوقت واستخدم أزرار الربط الفوري المدمجة.</p>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-2">
                  <span className="text-xs text-blue-400 font-bold">الخطوة 3 من 3</span>
                  <h4 className="font-bold text-lg">اختر أين تريد استلام التنبيه</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">قم بربط قناة تلجرام، واتساب، أو ديسكورد لتصلك الرسائل فوراً.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {wizardStep > 1 ? (
                <button onClick={() => setWizardStep(wizardStep - 1)} className="text-xs text-slate-400 hover:text-white transition-colors">
                  السابق
                </button>
              ) : <div></div>}
              
              {wizardStep < 3 ? (
                <button onClick={() => setWizardStep(wizardStep + 1)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl transition-colors">
                  التالي
                </button>
              ) : (
                <button onClick={() => { setShowWizard(false); localStorage.setItem(`wizard_seen_${slug}`, 'true'); }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl transition-colors">
                  ابدأ الآن 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-md"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 
        bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-slate-900/98
        border-l border-slate-800/60 
        flex flex-col transition-all duration-300 ease-in-out
        shadow-2xl shadow-black/50
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        
        {/* Sidebar Header */}
        <div className="relative p-5 border-b border-slate-800/60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-2.5 rounded-xl">
                  <Webhook className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-base bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Hook Signal
                </h2>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/50 px-2 py-0.5 rounded-md">
                  @{slug}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Status */}
          <div className="relative mt-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm" />
                <div className="relative w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">حساب {username}</span>
                <p className="text-xs font-bold capitalize text-slate-200">
                  {userPlan === 'free' ? '📋 الخطة المجانية' : '⭐ باقة PRO'}
                </p>
              </div>
            </div>
            {userPlan === 'free' && (
              <button 
                onClick={goToPricing}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center gap-1.5 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> ترقية
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-1.5">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isPro = item.pro === true;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl 
                      text-sm font-medium transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-600/5' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-l-full" />
                    )}

                    <div className={`
                      relative flex-shrink-0 transition-all duration-300
                      ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="flex-1 text-right truncate">
                      {item.label}
                    </span>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isPro && (
                        <span className="text-[8px] font-bold bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          PRO
                        </span>
                      )}
                      {item.badge && (
                        <span className={`
                          text-[9px] font-bold px-2 py-0.5 rounded-full
                          ${item.badge === 'Live' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : item.badge === 'Beta'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60 space-y-2.5 bg-slate-900/50">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/30 rounded-xl border border-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm" />
                <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-400">النظام يعمل</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">v2.4.1</span>
          </div>

          <button
            onClick={() => saveUserDataToDB()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 hover:from-emerald-600/30 hover:to-emerald-500/30 text-emerald-300 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 shadow-lg shadow-emerald-600/5 cursor-pointer group disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span>{isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden bg-slate-800/60 border border-slate-700/50 p-2 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-sm md:text-lg truncate max-w-[200px] md:max-w-none text-slate-100">
              {activeTab === 'dashboard' && `لوحة تحكم ${username}`}
              {activeTab === 'integrations' && 'قنوات الإشعارات'}
              {activeTab === 'telegram' && 'قنوات تلجرام'}
              {activeTab === 'whatsapp' && 'ربط واتساب'}
              {activeTab === 'sms' && 'بوابة الرسائل'}
              {activeTab === 'trading' && 'منصات التداول'}
              {activeTab === 'stores' && 'المتاجر الإلكترونية'}
              {activeTab === 'enterprise' && 'الشركات والأقسام'}
              {activeTab === 'rules' && 'قواعد التوجيه'}
              {activeTab === 'logs' && 'سجل العمليات'}
              {activeTab === 'settings' && 'الإعدادات'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowWizard(true)}
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-blue-600/15 to-indigo-600/15 hover:from-blue-600/25 hover:to-indigo-600/25 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-xl transition-all duration-300 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" /> الدليل السريع
            </button>
            <span className="text-[11px] md:text-xs px-3 py-1 rounded-full border flex items-center gap-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 whitespace-nowrap">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-sm" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
              </div>
              {slug}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* ====== DASHBOARD TAB ====== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">مرحباً {username} 👋</h2>
                    <p className="text-xs text-slate-400 mt-1">هذه لوحة تحكم حسابك المستقل - {slug}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                        {userPlan === 'free' ? '📋 مجانية' : '⭐ PRO'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        منذ {currentUserData?.joined || 'غير معروف'}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                      <p className="text-[10px] text-slate-400">حالة الحساب</p>
                      <p className="text-xs text-emerald-400 font-bold">🟢 نشط</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhook URL Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بحسابك</h3>
                  <p className="text-xs text-slate-500 mt-1">هذا الرابط مخصص لحساب {username} فقط</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs font-mono">{webhookUrl}</code>
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors cursor-pointer">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">الطلبات المُستلمة</p>
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <h4 className="text-3xl font-bold mt-2 text-slate-100">{analytics.totalRequests.toLocaleString()}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +{analytics.dailyGrowth}%
                    </span>
                    <span className="text-[10px] text-slate-500">منذ 24 ساعة</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">نسبة النجاح</p>
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <h4 className="text-3xl font-bold mt-2 text-emerald-400">{analytics.successRate}%</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-emerald-400">✓ فائق الأداء</span>
                    <span className="text-[10px] text-slate-500">• {analytics.totalMessages} رسالة</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">سرعة الاستجابة</p>
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                  <h4 className="text-3xl font-bold mt-2 text-purple-400">{analytics.averageResponseTime} <span className="text-lg">ms</span></h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-slate-400">متوسط الاستجابة</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">القنوات النشطة</p>
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                      <Radio className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                  <h4 className="text-3xl font-bold mt-2 text-indigo-400">{analytics.activeChannels}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-slate-400">من أصل {telegramChannels.length + whatsappChannels.length + slackChannels.length + discordChannels.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== STORES TAB ====== */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-600/15 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">إدارة وربط المتاجر الإلكترونية</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{analytics.storeStats.totalOrders} طلب • إيرادات {analytics.storeStats.totalRevenue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleAutoConnect('سلة')} className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Zap className="w-4 h-4 text-purple-400" /> ربط تلقائي
                    </button>
                    <button onClick={addStoreIntegration} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors">
                      <Plus className="w-4 h-4" /> ربط متجر
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {stores.map((store, index) => (
                    <div key={store.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-400">متجر #{index + 1}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            store.status === 'connected' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {store.status === 'connected' ? '✅ متصل وجاهز' : '⏳ غير متصل'}
                          </span>
                        </div>
                        {stores.length > 1 && (
                          <button onClick={() => removeStoreIntegration(store.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select 
                          value={store.platform || 'salla'} 
                          onChange={(e) => {
                            const updated = [...stores];
                            updated[index].platform = e.target.value;
                            setStores(updated);
                          }} 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                        >
                          <option value="salla">🛒 سalla (سلة)</option>
                          <option value="zid">🛍️ Zid (زيد)</option>
                          <option value="shopify">🌐 Shopify</option>
                          <option value="woocommerce">📦 WooCommerce</option>
                        </select>
                        <input 
                          type="text" 
                          value={store.storeName || ''} 
                          onChange={(e) => {
                            const updated = [...stores];
                            updated[index].storeName = e.target.value;
                            setStores(updated);
                          }} 
                          placeholder="اسم المتجر" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-colors" 
                        />
                        <input 
                          type="password" 
                          value={store.apiKey || ''} 
                          onChange={(e) => {
                            const updated = [...stores];
                            updated[index].apiKey = e.target.value;
                            setStores(updated);
                          }} 
                          placeholder="مفتاح API الخاص بالمتجر" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-colors font-mono" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
