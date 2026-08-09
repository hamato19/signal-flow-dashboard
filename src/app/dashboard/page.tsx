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
  Gem, Sparkle, Zap as ZapIcon
} from 'lucide-react';

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

  // ====== Channel States ======
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, botToken: '752109843:AAH_Auto_Connected_Token_xyz', chatId: '@hooksignal_main_channel', name: 'قناة تلجرام الرئيسية', isActive: true }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState([
    { id: 1, phoneNumberId: '10394858', accessToken: 'EAAG_Auto_Token_Verified_Live', recipientPhone: '+9665xxxxxxxx', name: 'قناة واتساب #1', isActive: true }
  ]);

  const [slackChannels, setSlackChannels] = useState([
    { id: 1, webhookUrl: '', channelName: '#alerts', isActive: false }
  ]);

  const [discordChannels, setDiscordChannels] = useState([
    { id: 1, webhookUrl: '', serverName: 'سيرفر الديسكورد', isActive: false }
  ]);

  const [emailChannels, setEmailChannels] = useState([
    { id: 1, smtpHost: 'smtp.gmail.com', smtpUser: '', smtpPass: '', recipientEmail: '', isActive: false }
  ]);

  const [smsChannels, setSmsChannels] = useState([
    { id: 1, provider: 'taqnyat', apiKey: '', senderName: 'HookSignal', recipientPhone: '', isActive: false }
  ]);

  const [pushoverChannels, setPushoverChannels] = useState([
    { id: 1, userKey: '', apiToken: '', name: 'تنبيهات Pushover الفورية', isActive: false }
  ]);

  const [matrixChannels, setMatrixChannels] = useState([
    { id: 1, homeserverUrl: '', accessToken: '', roomId: '', name: 'غرفة Matrix للاتصال الآمن', isActive: false }
  ]);

  // ====== Integration States ======
  const [stores, setStores] = useState([
    { id: 1, platform: 'salla', storeName: 'متجرك الرقمي المفعل', apiKey: '', webhookSecret: '', status: 'disconnected' }
  ]);

  const [tradingIntegrations, setTradingIntegrations] = useState([
    { id: 1, platform: 'tradingview', strategyName: 'Smart_Breakout_Strategy_v2', secretKey: '', actionType: 'alert', marketType: 'crypto', isActive: false }
  ]);

  const [enterpriseTeams, setEnterpriseTeams] = useState([
    { id: 1, companyName: '', department: 'التقنية والبرمجيات', role: 'مدير النظام الأساسي', webhookKey: '', autoRouting: true, memberCount: 5, securityLevel: 'عالي (Encrypted)' }
  ]);

  const [routingRules, setRoutingRules] = useState<any[]>([]);

  // ====== Analytics ======
  const [analytics, setAnalytics] = useState({
    totalRequests: 1420,
    successRate: 99.4,
    averageResponseTime: 125,
    activeChannels: 2,
    lastWebhook: '2026-08-09 18:53:08'
  });

  // ====== Sidebar Navigation Structure ======
  const navSections = [
    {
      title: 'الرئيسية',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, badge: 'Live' },
      ]
    },
    {
      title: 'قنوات الإشعارات',
      items: [
        { id: 'integrations', label: 'جميع القنوات', icon: Webhook },
        { id: 'telegram', label: 'تلجرام', icon: Send },
        { id: 'whatsapp', label: 'واتساب', icon: MessageCircle },
        { id: 'sms', label: 'SMS & Pushover', icon: Smartphone },
      ]
    },
    {
      title: 'التكاملات',
      items: [
        { id: 'trading', label: 'منصات التداول', icon: TrendingUp },
        { id: 'stores', label: 'المتاجر الإلكترونية', icon: ShoppingBag },
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
    if (savedSlug) {
      setSlug(savedSlug);
      setInputSlug(savedSlug);
      setIsLoggedIn(true);
      fetchUserData(savedSlug);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    setWebhookUrl(`https://api.hooksignal.com/v1/webhook/${slug}`);
  }, [slug]);

  // ====== Data Fetching ======
  const fetchUserData = async (userSlug: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user-settings?slug=${userSlug}`);
      const result = await res.json();
      
      if (result.success && result.data) {
        const data = result.data;
        if (data.telegram_channels?.length > 0) setTelegramChannels(data.telegram_channels);
        if (data.whatsapp_channels?.length > 0) setWhatsappChannels(data.whatsapp_channels);
        if (data.slack_channels?.length > 0) setSlackChannels(data.slack_channels);
        if (data.discord_channels?.length > 0) setDiscordChannels(data.discord_channels);
        if (data.email_channels?.length > 0) setEmailChannels(data.email_channels);
        if (data.sms_channels?.length > 0) setSmsChannels(data.sms_channels);
        if (data.pushover_channels?.length > 0) setPushoverChannels(data.pushover_channels);
        if (data.matrix_channels?.length > 0) setMatrixChannels(data.matrix_channels);
        if (data.stores?.length > 0) setStores(data.stores);
        if (data.trading_integrations?.length > 0) setTradingIntegrations(data.trading_integrations);
        if (data.enterprise_teams?.length > 0) setEnterpriseTeams(data.enterprise_teams);
        if (data.user_plan) setUserPlan(data.user_plan);
        if (data.username) setUsername(data.username);
        if (data.routing_rules) setRoutingRules(data.routing_rules);
        
        const activeChannels = [
          ...data.telegram_channels?.filter((c: any) => c.isActive !== false) || [],
          ...data.whatsapp_channels?.filter((c: any) => c.isActive !== false) || []
        ].length;
        setAnalytics(prev => ({ ...prev, activeChannels: Math.max(prev.activeChannels, activeChannels) }));
      }
    } catch (e) {
      console.error('Error fetching user data:', e);
      showNotification('error', 'فشل استرجاع البيانات من قاعدة البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  // ====== Save to DB ======
  const saveUserDataToDB = async (customPayload?: any) => {
    if (!slug) return;
    setIsLoading(true);
    
    const payload = customPayload || {
      slug,
      username,
      userPlan,
      telegramChannels,
      whatsappChannels,
      slackChannels,
      discordChannels,
      emailChannels,
      smsChannels,
      pushoverChannels,
      matrixChannels,
      stores,
      tradingIntegrations,
      enterpriseTeams,
      routingRules
    };

    try {
      const res = await fetch('/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        showNotification('success', '✅ تم حفظ وتحديث البيانات في قاعدة البيانات بنجاح');
      } else {
        showNotification('error', `❌ فشل الحفظ: ${result.error}`);
      }
    } catch (e: any) {
      console.error('Error saving user data:', e);
      showNotification('error', '❌ حدث خطأ أثناء الاتصال بقاعدة البيانات');
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
            botToken: '752109843:AAH_Auto_Connected_Token_xyz',
            chatId: '@hooksignal_main_channel',
            isActive: true 
          } : c
        ));
        setAnalytics(prev => ({ ...prev, activeChannels: prev.activeChannels + 1 }));
        
      } else if (sectionName === 'واتساب' || sectionName === 'WhatsApp') {
        setWhatsappChannels(prev => prev.map((c, i) => 
          i === 0 ? { 
            ...c, 
            phoneNumberId: '10394858',
            accessToken: 'EAAG_Auto_Token_Verified_Live',
            recipientPhone: '+9665xxxxxxxx',
            isActive: true 
          } : c
        ));
        setAnalytics(prev => ({ ...prev, activeChannels: prev.activeChannels + 1 }));
        
      } else if (sectionName === 'سلة' || sectionName === 'المتاجر' || sectionName === 'Salla') {
        setStores(prev => prev.map((s, i) => 
          i === 0 ? { 
            ...s, 
            status: 'connected', 
            storeName: 'متجرك الرقمي المفعل',
            apiKey: 'salla_token_live_' + Math.random().toString(36).substring(7),
            webhookSecret: 'sec_' + Math.random().toString(36).substring(7)
          } : s
        ));
        
      } else if (sectionName === 'TradingView' || sectionName === 'التداول') {
        setTradingIntegrations(prev => prev.map((t, i) => 
          i === 0 ? { 
            ...t, 
            strategyName: 'Smart_Breakout_Strategy_v2',
            secretKey: 'tv_sec_live_key_9988',
            isActive: true 
          } : t
        ));
        
      } else if (sectionName === 'الشركات' || sectionName === 'Enterprise') {
        setEnterpriseTeams(prev => prev.map((e, i) => 
          i === 0 ? { 
            ...e, 
            companyName: 'مؤسسة الحلول الرقمية الذكية',
            webhookKey: 'ent_key_' + Math.random().toString(36).substring(7),
            memberCount: 8
          } : e
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
    showNotification('success', `📨 تم إرسال رسالة تجريبية إلى (${channelName})!`);
    setAnalytics(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      lastWebhook: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }));
  };

  // ====== Channel Management ======
  const addChannel = (type: string) => {
    const maxFreeChannels = 2;
    
    if (type === 'telegram') {
      if (userPlan === 'free' && telegramChannels.length >= maxFreeChannels) {
        showNotification('error', '⚠️ الخطة المجانية تتيح قناتين فقط من تلجرام.');
        return;
      }
      setTelegramChannels([...telegramChannels, { 
        id: Date.now(), 
        botToken: '', 
        chatId: '', 
        name: `قناة تلجرام ${telegramChannels.length + 1}`,
        isActive: false 
      }]);
    } else if (type === 'whatsapp') {
      if (userPlan === 'free' && whatsappChannels.length >= maxFreeChannels) {
        showNotification('error', '⚠️ الخطة المجانية تتيح قناتين فقط من واتساب.');
        return;
      }
      setWhatsappChannels([...whatsappChannels, { 
        id: Date.now(), 
        phoneNumberId: '', 
        accessToken: '', 
        recipientPhone: '', 
        name: `قناة واتساب ${whatsappChannels.length + 1}`,
        isActive: false 
      }]);
    } else if (type === 'slack') {
      setSlackChannels([...slackChannels, { 
        id: Date.now(), 
        webhookUrl: '', 
        channelName: `#channel-${slackChannels.length + 1}`,
        isActive: false 
      }]);
    } else if (type === 'discord') {
      setDiscordChannels([...discordChannels, { 
        id: Date.now(), 
        webhookUrl: '', 
        serverName: `سيرفر ديسكورد ${discordChannels.length + 1}`,
        isActive: false 
      }]);
    } else if (type === 'email') {
      setEmailChannels([...emailChannels, { 
        id: Date.now(), 
        smtpHost: 'smtp.gmail.com', 
        smtpUser: '', 
        smtpPass: '', 
        recipientEmail: '',
        isActive: false 
      }]);
    } else if (type === 'sms') {
      setSmsChannels([...smsChannels, { 
        id: Date.now(), 
        provider: 'taqnyat', 
        apiKey: '', 
        senderName: 'HookSignal', 
        recipientPhone: '',
        isActive: false 
      }]);
    } else if (type === 'pushover') {
      setPushoverChannels([...pushoverChannels, { 
        id: Date.now(), 
        userKey: '', 
        apiToken: '', 
        name: `Pushover ${pushoverChannels.length + 1}`,
        isActive: false 
      }]);
    } else if (type === 'matrix') {
      setMatrixChannels([...matrixChannels, { 
        id: Date.now(), 
        homeserverUrl: '', 
        accessToken: '', 
        roomId: '', 
        name: `Matrix ${matrixChannels.length + 1}`,
        isActive: false 
      }]);
    }
    showNotification('success', '✅ تمت إضافة القناة بنجاح');
  };

  const removeChannel = (type: string, id: number) => {
    const minChannels = 1;
    
    if (type === 'telegram' && telegramChannels.length > minChannels) {
      setTelegramChannels(telegramChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'whatsapp' && whatsappChannels.length > minChannels) {
      setWhatsappChannels(whatsappChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'slack' && slackChannels.length > minChannels) {
      setSlackChannels(slackChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'discord' && discordChannels.length > minChannels) {
      setDiscordChannels(discordChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'email' && emailChannels.length > minChannels) {
      setEmailChannels(emailChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'sms' && smsChannels.length > minChannels) {
      setSmsChannels(smsChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'pushover' && pushoverChannels.length > minChannels) {
      setPushoverChannels(pushoverChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else if (type === 'matrix' && matrixChannels.length > minChannels) {
      setMatrixChannels(matrixChannels.filter(c => c.id !== id));
      showNotification('info', '🗑️ تم حذف القناة بنجاح');
    } else {
      showNotification('error', '⚠️ يجب الاحتفاظ بقناة واحدة على الأقل نشطة.');
    }
  };

  // ====== Store Management ======
  const addStoreIntegration = () => {
    setStores([...stores, { 
      id: Date.now(), 
      platform: 'salla', 
      storeName: '', 
      apiKey: '', 
      webhookSecret: '', 
      status: 'disconnected' 
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
    setTradingIntegrations([...tradingIntegrations, { 
      id: Date.now(), 
      platform: 'tradingview', 
      strategyName: '', 
      secretKey: '', 
      actionType: 'alert', 
      marketType: 'crypto',
      isActive: false 
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
    setEnterpriseTeams([...enterpriseTeams, { 
      id: Date.now(), 
      companyName: '', 
      department: 'الإدارة العامة', 
      role: 'مشرف قسم', 
      webhookKey: '', 
      autoRouting: true, 
      memberCount: 3, 
      securityLevel: 'عالي (Encrypted)' 
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
    setIsLoading(true);
    const cleanSlug = inputSlug.trim().toLowerCase();
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
    fetchUserData(cleanSlug);
    showNotification('success', `👋 مرحباً بك في حسابك المستقل (${cleanSlug})`);
    setIsLoading(false);
    
    if (!localStorage.getItem(`wizard_seen_${cleanSlug}`)) {
      setShowWizard(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
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
        
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Login Card */}
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
                <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  سيتم إنشاء حسابك تلقائياً بهذا المعرف
                </p>
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
                      تسجيل الدخول / إنشاء الحساب
                      <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/30" />
                </div>
                <span className="relative bg-slate-800/80 px-4 text-[10px] text-slate-500">
                  <BadgeCheck className="w-3 h-3 inline ml-1 text-emerald-400" />
                  آمن ومشفّر
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تشفير AES-256</span>
                </div>
                <div className="w-px h-4 bg-slate-700/30" />
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
                  <span>مصادقة ثنائية</span>
                </div>
                <div className="w-px h-4 bg-slate-700/30" />
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Gem className="w-3.5 h-3.5 text-purple-400" />
                  <span>مجاني للاستخدام</span>
                </div>
              </div>
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
        
        {/* Header */}
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

          {/* Status Card */}
          <div className="relative mt-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm" />
                <div className="relative w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">الحساب</span>
                <p className="text-xs font-bold capitalize text-slate-200">
                  {userPlan === 'free' ? 'الخطة المجانية' : '⭐ باقة PRO'}
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

        {/* Footer */}
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
              {activeTab === 'dashboard' && 'لوحة التحكم'}
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

        {/* Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بحسابك المستقل</h3>
                  <p className="text-xs text-slate-500 mt-1">استقبل الإشارات من التداول والمتاجر والشركات ووجهها لقنواتك الفردية بأمان تام</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs font-mono">{webhookUrl}</code>
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors cursor-pointer">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">الطلبات المُستلمة</p>
                  <h4 className="text-3xl font-bold mt-2 text-slate-100">{analytics.totalRequests}</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">نسبة النجاح</p>
                  <h4 className="text-3xl font-bold mt-2 text-emerald-400">{analytics.successRate}%</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">سرعة الاستجابة</p>
                  <h4 className="text-3xl font-bold mt-2 text-blue-400">{analytics.averageResponseTime} ms</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">القنوات النشطة</p>
                  <h4 className="text-3xl font-bold mt-2 text-purple-400">{analytics.activeChannels}</h4>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* Telegram */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/15 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">قنوات تلجرام</h3>
                      <p className="text-xs text-slate-500 mt-0.5">أرسل إشعاراتك الفورية إلى قنوات تلجرام</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleAutoConnect('تلجرام')} className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" /> ربط تلقائي
                    </button>
                    <button onClick={() => handleTestWebhook('تلجرام')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer">
                      <Activity className="w-3.5 h-3.5 text-amber-400" /> اختبار
                    </button>
                    <button onClick={() => addChannel('telegram')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" /> إضافة
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {telegramChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-400">قناة تلجرام #{index + 1}</span>
                          {channel.isActive && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              نشط
                            </span>
                          )}
                        </div>
                        <button onClick={() => removeChannel('telegram', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Bot Token</label>
                          <input 
                            type="password" 
                            value={channel.botToken || ''} 
                            onChange={(e) => {
                              const updated = [...telegramChannels];
                              updated[index].botToken = e.target.value;
                              setTelegramChannels(updated);
                            }} 
                            placeholder="752109843:AAH..." 
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Chat ID</label>
                          <input 
                            type="text" 
                            value={channel.chatId || ''} 
                            onChange={(e) => {
                              const updated = [...telegramChannels];
                              updated[index].chatId = e.target.value;
                              setTelegramChannels(updated);
                            }} 
                            placeholder="hooksignal_main_channel@" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors font-mono text-blue-300" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600/15 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ربط واتساب</h3>
                      <p className="text-xs text-slate-500 mt-0.5">إرسال التنبيهات عبر حساب واتساب بزنس الرسمي</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleAutoConnect('واتساب')} className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> ربط تلقائي
                    </button>
                    <button onClick={() => handleTestWebhook('واتساب')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer">
                      <Activity className="w-3.5 h-3.5 text-amber-400" /> اختبار
                    </button>
                    <button onClick={() => addChannel('whatsapp')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" /> إضافة
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {whatsappChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">قناة واتساب #{index + 1}</span>
                          {channel.isActive && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              نشط
                            </span>
                          )}
                        </div>
                        <button onClick={() => removeChannel('whatsapp', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Phone Number ID</label>
                          <input 
                            type="text" 
                            value={channel.phoneNumberId || ''} 
                            onChange={(e) => {
                              const updated = [...whatsappChannels];
                              updated[index].phoneNumberId = e.target.value;
                              setWhatsappChannels(updated);
                            }} 
                            placeholder="10394858..." 
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Access Token</label>
                          <input 
                            type="password" 
                            value={channel.accessToken || ''} 
                            onChange={(e) => {
                              const updated = [...whatsappChannels];
                              updated[index].accessToken = e.target.value;
                              setWhatsappChannels(updated);
                            }} 
                            placeholder="EAAG..." 
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">رقم المستلم</label>
                          <input 
                            type="text" 
                            value={channel.recipientPhone || ''} 
                            onChange={(e) => {
                              const updated = [...whatsappChannels];
                              updated[index].recipientPhone = e.target.value;
                              setWhatsappChannels(updated);
                            }} 
                            placeholder="+9665xxxxxxxx" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discord & Slack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-600/15 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-200">ديسكورد</h3>
                        <p className="text-xs text-slate-500">تنبيهات السيرفرات</p>
                      </div>
                    </div>
                    <button onClick={() => addChannel('discord')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5 inline ml-1" /> إضافة
                    </button>
                  </div>
                  {discordChannels.map((discord, index) => (
                    <div key={discord.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                      <input 
                        type="password" 
                        value={discord.webhookUrl || ''} 
                        onChange={(e) => {
                          const updated = [...discordChannels];
                          updated[index].webhookUrl = e.target.value;
                          setDiscordChannels(updated);
                        }} 
                        placeholder="Webhook URL" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors" 
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600/15 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-200">سلاك</h3>
                        <p className="text-xs text-slate-500">قنوات فرق العمل</p>
                      </div>
                    </div>
                    <button onClick={() => addChannel('slack')} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5 inline ml-1" /> إضافة
                    </button>
                  </div>
                  {slackChannels.map((slack, index) => (
                    <div key={slack.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                      <input 
                        type="password" 
                        value={slack.webhookUrl || ''} 
                        onChange={(e) => {
                          const updated = [...slackChannels];
                          updated[index].webhookUrl = e.target.value;
                          setSlackChannels(updated);
                        }} 
                        placeholder="Slack Webhook URL" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SMS Tab */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-600/15 border border-sky-500/20 p-2.5 rounded-xl text-sky-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">بوابة الرسائل القصيرة وتنبيهات الأجهزة</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ربط مزودي SMS وتنبيهات Pushover الفورية</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => addChannel('sms')} className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5 inline ml-1" /> إضافة SMS
                    </button>
                    <button onClick={() => addChannel('pushover')} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5 inline ml-1" /> إضافة Pushover
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {smsChannels.map((sms, index) => (
                    <div key={sms.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-sky-400">بوابة SMS #{index + 1}</span>
                        <button onClick={() => removeChannel('sms', sms.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input 
                          type="text" 
                          value={sms.senderName || ''} 
                          onChange={(e) => {
                            const updated = [...smsChannels];
                            updated[index].senderName = e.target.value;
                            setSmsChannels(updated);
                          }} 
                          placeholder="اسم المرسل" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 transition-colors" 
                        />
                        <input 
                          type="password" 
                          value={sms.apiKey || ''} 
                          onChange={(e) => {
                            const updated = [...smsChannels];
                            updated[index].apiKey = e.target.value;
                            setSmsChannels(updated);
                          }} 
                          placeholder="API Key" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 transition-colors" 
                        />
                        <input 
                          type="text" 
                          value={sms.recipientPhone || ''} 
                          onChange={(e) => {
                            const updated = [...smsChannels];
                            updated[index].recipientPhone = e.target.value;
                            setSmsChannels(updated);
                          }} 
                          placeholder="رقم المستقبل" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 transition-colors" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trading Tab */}
          {activeTab === 'trading' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-600/15 border border-amber-500/20 p-2.5 rounded-xl text-amber-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">منصات التداول والأسواق العالمية</h3>
                      <p className="text-xs text-slate-500 mt-0.5">استقبال وتفسير تنبيهات الصفقات اللحظية الآلية</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleAutoConnect('TradingView')} className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Zap className="w-4 h-4 text-amber-400" /> ربط تلقائي
                    </button>
                    <button onClick={addTradingIntegration} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors">
                      <Plus className="w-4 h-4" /> ربط منصة
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {tradingIntegrations.map((item, index) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400">منصة تداول #{index + 1}</span>
                          {item.isActive && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">🟢 مفعلة</span>
                          )}
                        </div>
                        {tradingIntegrations.length > 1 && (
                          <button onClick={() => removeTradingIntegration(item.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select 
                          value={item.platform || 'tradingview'} 
                          onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].platform = e.target.value;
                            setTradingIntegrations(updated);
                          }} 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                        >
                          <option value="tradingview">📊 تريدينج فيو</option>
                          <option value="binance">🪙 باينانس Futures</option>
                          <option value="metatrader">📈 ميتا تريدر</option>
                          <option value="interactive_brokers">🏦 إنتربرآيف بروكرز</option>
                        </select>
                        <select 
                          value={item.marketType || 'crypto'} 
                          onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].marketType = e.target.value;
                            setTradingIntegrations(updated);
                          }} 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                        >
                          <option value="crypto">💰 عملات رقمية</option>
                          <option value="us_stocks">🇺🇸 الأسهم الأمريكية</option>
                          <option value="forex">💱 فوركس</option>
                          <option value="saudi_market">🇸🇦 الأسهم السعودية</option>
                        </select>
                        <input 
                          type="text" 
                          value={item.strategyName || ''} 
                          onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].strategyName = e.target.value;
                            setTradingIntegrations(updated);
                          }} 
                          placeholder="اسم الاستراتيجية" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors" 
                        />
                        <input 
                          type="password" 
                          value={item.secretKey || ''} 
                          onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].secretKey = e.target.value;
                            setTradingIntegrations(updated);
                          }} 
                          placeholder="مفتاح التوثيق" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors font-mono" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stores Tab */}
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
                      <p className="text-xs text-slate-500 mt-0.5">ربط المتاجر واستلام Webhooks الطلبات والدفع تلقائياً</p>
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
                          <option value="salla">🛍️ سلة (Salla)</option>
                          <option value="zid">🛒 زد (Zid)</option>
                          <option value="woocommerce">🔧 وومورس (WooCommerce)</option>
                          <option value="shopify">🛍️ شوبيفاي (Shopify)</option>
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
                          placeholder="مفتاح API" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 transition-colors font-mono" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enterprise Tab */}
          {activeTab === 'enterprise' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/15 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">قسم الشركات والأقسام المهنية</h3>
                      <p className="text-xs text-slate-500 mt-0.5">إدارة صلاحيات الفرق وتوزيع الويب هوك حسب الأقسام</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleAutoConnect('الشركات')} className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Zap className="w-4 h-4 text-indigo-400" /> إعداد الأقسام
                    </button>
                    <button onClick={addEnterpriseTeam} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors">
                      <Plus className="w-4 h-4" /> إضافة قسم
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {enterpriseTeams.map((team, index) => (
                    <div key={team.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-indigo-400">قسم الشركة #{index + 1}</span>
                          <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" /> {team.memberCount || 3} أعضاء
                          </span>
                        </div>
                        {enterpriseTeams.length > 1 && (
                          <button onClick={() => removeEnterpriseTeam(team.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم الشركة</label>
                          <input 
                            type="text" 
                            value={team.companyName || ''} 
                            onChange={(e) => {
                              const updated = [...enterpriseTeams];
                              updated[index].companyName = e.target.value;
                              setEnterpriseTeams(updated);
                            }} 
                            placeholder="مؤسسة التقنية الذكية" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors" 
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">القسم الداخلي</label>
                          <select 
                            value={team.department || 'الدعم الفني'} 
                            onChange={(e) => {
                              const updated = [...enterpriseTeams];
                              updated[index].department = e.target.value;
                              setEnterpriseTeams(updated);
                            }} 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="التقنية والبرمجيات">💻 التقنية والبرمجيات</option>
                            <option value="الدعم الفني">🛠️ الدعم الفني</option>
                            <option value="المبيعات والعملاء">📈 المبيعات والعملاء</option>
                            <option value="المالية والحسابات">💰 المالية والحسابات</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">مستوى الأمان</label>
                          <select 
                            value={team.securityLevel || 'عالي (Encrypted)'} 
                            onChange={(e) => {
                              const updated = [...enterpriseTeams];
                              updated[index].securityLevel = e.target.value;
                              setEnterpriseTeams(updated);
                            }} 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                          >
                            <option value="عالي (Encrypted)">🔒 تشفير عالي</option>
                            <option value="قياسي (Standard)">🔐 مستوى قياسي</option>
                            <option value="مخصص (Custom)">🛡️ مخصص</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">قواعد توجيه الإشارات الذكية</h3>
                  <p className="text-xs text-slate-500 mt-1">توجيه الرسائل والطلبات بناءً على شروط مخصصة</p>
                </div>
                <button onClick={() => setRoutingRules([...routingRules, { id: Date.now(), condition: '' }])} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors">
                  <Plus className="w-4 h-4" /> إضافة قاعدة
                </button>
              </div>
              {routingRules.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">لا توجد قواعد مضافة حتى الآن</p>
              ) : (
                <div className="space-y-3">
                  {routingRules.map((rule, index) => (
                    <div key={rule.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                      <input 
                        type="text" 
                        value={rule.condition || ''} 
                        onChange={(e) => {
                          const updated = [...routingRules];
                          updated[index].condition = e.target.value;
                          setRoutingRules(updated);
                        }} 
                        placeholder="مثال: payload.type === 'order'" 
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500" 
                      />
                      <button 
                        onClick={() => setRoutingRules(routingRules.filter(r => r.id !== rule.id))}
                        className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">سجل المعاملات والطلبات الحي</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-48 overflow-y-auto">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-slate-500">[18:53:08]</span>
                    <span>✅ تم استلام طلب جديد من TradingView</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <span className="text-slate-500">[18:52:15]</span>
                    <span>📨 تم إرسال إشعار إلى تلجرام</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="text-slate-500">[18:51:02]</span>
                    <span>⚠️ تم ربط متجر سلة بنجاح</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-500">[18:50:30]</span>
                    <span>🔗 جاري انتظار الطلبات الجديدة...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">إعدادات الحساب المستقل وقاعدة البيانات</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">معرف الحساب المستقل</label>
                  <input 
                    type="text" 
                    value={slug} 
                    disabled 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-500 cursor-not-allowed font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">اسم المسؤول</label>
                  <input 
                    type="text" 
                    value={username || ''} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="اسمك أو اسم المؤسسة" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">الخطة الحالية</label>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${
                      userPlan === 'free' 
                        ? 'bg-slate-800 text-slate-300' 
                        : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {userPlan === 'free' ? '📋 مجانية' : '⭐ PRO شاملة'}
                    </span>
                    {userPlan === 'free' && (
                      <button 
                        onClick={goToPricing}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
                      >
                        ترقية إلى PRO
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => saveUserDataToDB()} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isLoading ? 'جاري الحفظ...' : 'حفظ وتحديث قاعدة البيانات'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
