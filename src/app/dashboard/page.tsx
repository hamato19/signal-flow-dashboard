"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Lock, Sparkles, MessageSquare, Send, Globe, ShoppingBag, MessageCircle, Mail, Hash, Building2, TrendingUp, PhoneCall, Smartphone, Check, Menu, X
} from 'lucide-react';

export default function ControlPanel() {
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  
  // حالة التحكم بظهور القائمة الجانبية في الجوال
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [username, setUsername] = useState('');

  // Subscription & Plan State (Free / Pro)
  const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
  
  // Channels State
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, botToken: '', chatId: '', name: 'قناة تلجرام الرئيسية' }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState([
    { id: 1, phoneNumberId: '', accessToken: '', recipientPhone: '', name: 'رقم واتساب الرسمي' }
  ]);

  const [slackChannels, setSlackChannels] = useState([
    { id: 1, webhookUrl: '', channelName: '#alerts' }
  ]);

  const [discordChannels, setDiscordChannels] = useState([
    { id: 1, webhookUrl: '', serverName: 'سيرفر الديسكورد' }
  ]);

  const [emailChannels, setEmailChannels] = useState([
    { id: 1, smtpHost: '', smtpUser: '', smtpPass: '', recipientEmail: '' }
  ]);

  const [smsChannels, setSmsChannels] = useState([
    { id: 1, provider: 'taqnyat', apiKey: '', senderName: '', recipientPhone: '' }
  ]);

  const [stores, setStores] = useState([
    { id: 1, platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }
  ]);

  const [tradingIntegrations, setTradingIntegrations] = useState([
    { id: 1, platform: 'tradingview', strategyName: '', secretKey: '', actionType: 'alert', marketType: 'crypto' }
  ]);

  const [enterpriseTeams, setEnterpriseTeams] = useState([
    { id: 1, companyName: '', department: 'التقنية', webhookKey: '' }
  ]);

  const [routingRules, setRoutingRules] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRequests: 1420,
    successRate: 99.4,
    averageResponseTime: 125,
  });

  const [webhookUrl, setWebhookUrl] = useState('');

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

  const fetchUserData = async (userSlug: string) => {
    try {
      const res = await fetch(`/api/user-settings?slug=${userSlug}`);
      const result = await res.json();
      
      if (result.success && result.data) {
        const data = result.data;
        if (data.telegram_channels && data.telegram_channels.length > 0) setTelegramChannels(data.telegram_channels);
        if (data.whatsapp_channels && data.whatsapp_channels.length > 0) setWhatsappChannels(data.whatsapp_channels);
        if (data.slack_channels && data.slack_channels.length > 0) setSlackChannels(data.slack_channels);
        if (data.discord_channels && data.discord_channels.length > 0) setDiscordChannels(data.discord_channels);
        if (data.email_channels && data.email_channels.length > 0) setEmailChannels(data.email_channels);
        if (data.sms_channels && data.sms_channels.length > 0) setSmsChannels(data.sms_channels);
        if (data.stores && data.stores.length > 0) setStores(data.stores);
        if (data.trading_integrations && data.trading_integrations.length > 0) setTradingIntegrations(data.trading_integrations);
        if (data.enterprise_teams && data.enterprise_teams.length > 0) setEnterpriseTeams(data.enterprise_teams);
        if (data.user_plan) setUserPlan(data.user_plan);
        if (data.username) setUsername(data.username);
      }
    } catch (e) {
      console.error('Error fetching user data from DB:', e);
      showNotification('error', 'فشل استرجاع البيانات من قاعدة البيانات');
    }
  };

  const saveUserDataToDB = async (customPayload?: any) => {
    if (!slug) return;
    
    const payload = customPayload || {
      slug,
      telegramChannels,
      whatsappChannels,
      slackChannels,
      discordChannels,
      emailChannels,
      smsChannels,
      stores,
      tradingIntegrations,
      enterpriseTeams,
      userPlan,
      username
    };

    try {
      const res = await fetch('/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        showNotification('success', 'تم حفظ وتحديث البيانات في قاعدة البيانات بنجاح');
      } else {
        showNotification('error', `فشل الحفظ: ${result.error}`);
      }
    } catch (e: any) {
      console.error('Error saving user data:', e);
      showNotification('error', 'حدث خطأ أثناء الاتصال بقاعدة البيانات');
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '' });
    }, 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) return;
    const cleanSlug = inputSlug.trim().toLowerCase();
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
    fetchUserData(cleanSlug);
    showNotification('success', `مرحباً بك مجدداً في حسابك المستقل (${cleanSlug})`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    showNotification('info', 'تم تسجيل الخروج بأمان');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addChannel = (type: string) => {
    if (userPlan === 'free') {
      showNotification('error', 'الخطة المجانية تتيح قناة واحدة فقط لكل نوع. قم بالترقية للباقة الشاملة لإضافة قنوات متعددة بلا حدود!');
      return;
    }

    if (type === 'telegram') {
      setTelegramChannels([...telegramChannels, { id: Date.now(), botToken: '', chatId: '', name: `قناة تلجرام ${telegramChannels.length + 1}` }]);
    } else if (type === 'whatsapp') {
      setWhatsappChannels([...whatsappChannels, { id: Date.now(), phoneNumberId: '', accessToken: '', recipientPhone: '', name: `رقم واتساب ${whatsappChannels.length + 1}` }]);
    } else if (type === 'slack') {
      setSlackChannels([...slackChannels, { id: Date.now(), webhookUrl: '', channelName: `#channel-${slackChannels.length + 1}` }]);
    } else if (type === 'discord') {
      setDiscordChannels([...discordChannels, { id: Date.now(), webhookUrl: '', serverName: `سيرفر ديسكورد ${discordChannels.length + 1}` }]);
    } else if (type === 'email') {
      setEmailChannels([...emailChannels, { id: Date.now(), smtpHost: '', smtpUser: '', smtpPass: '', recipientEmail: '' }]);
    } else if (type === 'sms') {
      setSmsChannels([...smsChannels, { id: Date.now(), provider: 'taqnyat', apiKey: '', senderName: '', recipientPhone: '' }]);
    }
    showNotification('success', 'تمت إضافة القناة بنجاح');
  };

  const removeChannel = (type: string, id: number) => {
    if (type === 'telegram' && telegramChannels.length > 1) setTelegramChannels(telegramChannels.filter(c => c.id !== id));
    else if (type === 'whatsapp' && whatsappChannels.length > 1) setWhatsappChannels(whatsappChannels.filter(c => c.id !== id));
    else if (type === 'slack' && slackChannels.length > 1) setSlackChannels(slackChannels.filter(c => c.id !== id));
    else if (type === 'discord' && discordChannels.length > 1) setDiscordChannels(discordChannels.filter(c => c.id !== id));
    else if (type === 'email' && emailChannels.length > 1) setEmailChannels(emailChannels.filter(c => c.id !== id));
    else if (type === 'sms' && smsChannels.length > 1) setSmsChannels(smsChannels.filter(c => c.id !== id));
    else {
      showNotification('error', 'يجب الاحتفاظ بقناة واحدة على الأقل نشطة.');
    }
  };

  const addStoreIntegration = () => {
    setStores([...stores, { id: Date.now(), platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }]);
    showNotification('success', 'تمت إضافة نموذج ربط متجر جديد');
  };

  const removeStoreIntegration = (id: number) => {
    setStores(stores.filter(s => s.id !== id));
    showNotification('info', 'تم حذف المتجر بنجاح');
  };

  const addTradingIntegration = () => {
    setTradingIntegrations([...tradingIntegrations, { id: Date.now(), platform: 'tradingview', strategyName: '', secretKey: '', actionType: 'alert', marketType: 'crypto' }]);
    showNotification('success', 'تمت إضافة منصة التداول بنجاح');
  };

  const removeTradingIntegration = (id: number) => {
    setTradingIntegrations(tradingIntegrations.filter(t => t.id !== id));
    showNotification('info', 'تم حذف منصة التداول بنجاح');
  };

  const addEnterpriseTeam = () => {
    setEnterpriseTeams([...enterpriseTeams, { id: Date.now(), companyName: '', department: 'التقنية', webhookKey: '' }]);
    showNotification('success', 'تمت إضافة فرع الشركة بنجاح');
  };

  const removeEnterpriseTeam = (id: number) => {
    setEnterpriseTeams(enterpriseTeams.filter(e => e.id !== id));
    showNotification('info', 'تم حذف فرع الشركة بنجاح');
  };

  const goToPricing = () => {
    window.location.href = '/pricing';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-600/15 border border-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Webhook className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">منصة ويب هوك العربية الشاملة</h1>
            <p className="text-slate-400 text-sm mt-2">أدخل معرف حسابك المستقل (Slug) للدخول إلى لوحة التحكم الخاصة بك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">معرف الحساب المستقل (Slug)</label>
              <input 
                type="text" 
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                placeholder="e.g. fahad-dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              تسجيل الدخول / إنشاء الحساب
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans relative" dir="rtl">
      
      {notification.show && (
        <div className="fixed top-5 left-5 z-50 bg-slate-900 border border-slate-800 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* خلفية معتمة تظهر عند فتح القائمة الجانبية في الجوال */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* الشريط الجانبي (متجاوب مع الجوال والشاشات الكبيرة) */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-slate-900/95 md:bg-slate-900/50 border-l border-slate-800/80 
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/15 border border-blue-500/20 p-2 rounded-xl text-blue-400">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Hook Signal</h2>
                <span className="text-xs text-blue-400 font-mono truncate block max-w-[120px]">@{slug}</span>
              </div>
            </div>
            {/* زر إغلاق القائمة في الجوال */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pt-4">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">حسابك المستقل</span>
                <p className="text-xs font-bold capitalize">{userPlan === 'free' ? 'الخطة المجانية' : 'باقة PRO الشاملة'}</p>
              </div>
              {userPlan === 'free' && (
                <button 
                  onClick={goToPricing}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shadow cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> ترقية
                </button>
              )}
            </div>
          </div>

          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
            {[
              { id: 'dashboard', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
              { id: 'integrations', label: 'قنوات الإشعارات والربط', icon: Webhook },
              { id: 'sms', label: 'خدمة الرسائل النصية (SMS)', icon: Smartphone },
              { id: 'trading', label: 'منصات التداول والأسواق العالمية', icon: TrendingUp },
              { id: 'stores', label: 'إدارة وربط المتاجر', icon: ShoppingBag },
              { id: 'enterprise', label: 'قسم الشركات والأقسام', icon: Building2 },
              { id: 'rules', label: 'قواعد التوجيه الذكية', icon: Database },
              { id: 'logs', label: 'سجل العمليات الحي', icon: Terminal },
              { id: 'settings', label: 'الإعدادات العامة وقاعدة البيانات', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false); // إغلاق القائمة تلقائياً عند اختيار قسم في الجوال
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => saveUserDataToDB()}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-medium transition-colors shadow"
          >
            <Save className="w-4 h-4" /> حفظ كل البيانات بقاعدة البيانات
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* زر فتح القائمة الجانبية في الشاشات الصغيرة */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden bg-slate-800/60 border border-slate-700/50 p-2 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-sm md:text-lg truncate max-w-[200px] md:max-w-none">
              {activeTab === 'dashboard' && 'الرئيسية والإحصائيات'}
              {activeTab === 'integrations' && 'قنوات الإشعارات (تلجرام، واتساب...)'}
              {activeTab === 'sms' && 'بوابة رسائل الهواتف القصيرة (SMS)'}
              {activeTab === 'trading' && 'إشارات التداول والأسواق العالمية'}
              {activeTab === 'stores' && 'خدمة ربط المتاجر الإلكترونية'}
              {activeTab === 'enterprise' && 'قسم الشركات والفرق المهنية'}
              {activeTab === 'rules' && 'محرك قواعد التوجيه الذكي'}
              {activeTab === 'logs' && 'سجل المعاملات والطلبات الحي'}
              {activeTab === 'settings' && 'إعدادات الحساب المستقل وقاعدة البيانات'}
            </h1>
          </div>
          <span className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> الحساب نشط ({slug})
          </span>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بحسابك المستقل</h3>
                  <p className="text-xs text-slate-500 mt-1">استقبل الإشارات من التداول والمتاجر والشركات ووجهها لقنواتك الفردية بأمان تام</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs">{webhookUrl}</code>
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
            </div>
          )}

          {/* تبويب قنوات الإشعارات الشاملة */}
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
                      <h3 className="font-bold text-sm text-slate-200">قنوات تلجرام (Telegram Channels)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">أرسل إشعاراتك الفورية إلى عدة قنوات أو مجموعات تلجرام بالتوازي</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('telegram')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {telegramChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-blue-400">قناة تلجرام #{index + 1}</span>
                        <button onClick={() => removeChannel('telegram', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Bot Token</label>
                          <input type="password" value={channel.botToken || ''} onChange={(e) => {
                            const updated = [...telegramChannels];
                            updated[index].botToken = e.target.value;
                            setTelegramChannels(updated);
                          }} placeholder="123456789:ABC..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Chat ID</label>
                          <input type="text" value={channel.chatId || ''} onChange={(e) => {
                            const updated = [...telegramChannels];
                            updated[index].chatId = e.target.value;
                            setTelegramChannels(updated);
                          }} placeholder="-100xxxxxxxxxx" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات تلجرام
                  </button>
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
                      <h3 className="font-bold text-sm text-slate-200">ربط واتساب (WhatsApp Cloud API)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">إرسال التنبيهات ورسائل العملاء عبر حساب واتساب بزنس الرسمي</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('whatsapp')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {whatsappChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-400">قناة واتساب #{index + 1}</span>
                        <button onClick={() => removeChannel('whatsapp', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Phone Number ID</label>
                          <input type="text" value={channel.phoneNumberId || ''} onChange={(e) => {
                            const updated = [...whatsappChannels];
                            updated[index].phoneNumberId = e.target.value;
                            setWhatsappChannels(updated);
                          }} placeholder="10394858..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Access Token</label>
                          <input type="password" value={channel.accessToken || ''} onChange={(e) => {
                            const updated = [...whatsappChannels];
                            updated[index].accessToken = e.target.value;
                            setWhatsappChannels(updated);
                          }} placeholder="EAAG..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">رقم المستلم / المجموعات</label>
                          <input type="text" value={channel.recipientPhone || ''} onChange={(e) => {
                            const updated = [...whatsappChannels];
                            updated[index].recipientPhone = e.target.value;
                            setWhatsappChannels(updated);
                          }} placeholder="+9665xxxxxxxx" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات واتساب
                  </button>
                </div>
              </div>

              {/* Discord */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/15 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">سيرفرات ديسكورد (Discord Webhooks)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">توجيه التنبيهات وإشارات التداول إلى قنوات ديسكورد التفاعلية</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('discord')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {discordChannels.map((discord, index) => (
                    <div key={discord.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-indigo-400">ديسكورد #{index + 1}</span>
                        <button onClick={() => removeChannel('discord', discord.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Discord Webhook URL</label>
                          <input type="password" value={discord.webhookUrl || ''} onChange={(e) => {
                            const updated = [...discordChannels];
                            updated[index].webhookUrl = e.target.value;
                            setDiscordChannels(updated);
                          }} placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">اسم السيرفر / القناة</label>
                          <input type="text" value={discord.serverName || ''} onChange={(e) => {
                            const updated = [...discordChannels];
                            updated[index].serverName = e.target.value;
                            setDiscordChannels(updated);
                          }} placeholder="Trading Signals" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات ديسكورد
                  </button>
                </div>
              </div>

              {/* Slack */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-600/15 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">سلاك (Slack Webhooks)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">إرسال التنبيهات البرمجية والمالية إلى قنوات فريق العمل في Slack</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('slack')} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {slackChannels.map((slack, index) => (
                    <div key={slack.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-purple-400">سلاك #{index + 1}</span>
                        <button onClick={() => removeChannel('slack', slack.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Slack Webhook URL</label>
                          <input type="password" value={slack.webhookUrl || ''} onChange={(e) => {
                            const updated = [...slackChannels];
                            updated[index].webhookUrl = e.target.value;
                            setSlackChannels(updated);
                          }} placeholder="https://hooks.slack.com/services/..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">اسم القناة (#channel)</label>
                          <input type="text" value={slack.channelName || ''} onChange={(e) => {
                            const updated = [...slackChannels];
                            updated[index].channelName = e.target.value;
                            setSlackChannels(updated);
                          }} placeholder="#alerts" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات سلاك
                  </button>
                </div>
              </div>

              {/* Email SMTP */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-600/15 border border-rose-500/20 p-2.5 rounded-xl text-rose-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">البريد الإلكتروني (SMTP Email)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">إرسال تقارير الإشعارات عبر بريد SMTP مخصص عند كل استلام ويب هوك</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('email')} className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {emailChannels.map((email, index) => (
                    <div key={email.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-rose-400">إعداد البريد #{index + 1}</span>
                        <button onClick={() => removeChannel('email', email.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">SMTP Host</label>
                          <input type="text" value={email.smtpHost || ''} onChange={(e) => {
                            const updated = [...emailChannels];
                            updated[index].smtpHost = e.target.value;
                            setEmailChannels(updated);
                          }} placeholder="smtp.mailgun.org" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">SMTP User</label>
                          <input type="text" value={email.smtpUser || ''} onChange={(e) => {
                            const updated = [...emailChannels];
                            updated[index].smtpUser = e.target.value;
                            setEmailChannels(updated);
                          }} placeholder="user@domain.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">SMTP Pass</label>
                          <input type="password" value={email.smtpPass || ''} onChange={(e) => {
                            const updated = [...emailChannels];
                            updated[index].smtpPass = e.target.value;
                            setEmailChannels(updated);
                          }} placeholder="********" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">البريد المستلم</label>
                          <input type="email" value={email.recipientEmail || ''} onChange={(e) => {
                            const updated = [...emailChannels];
                            updated[index].recipientEmail = e.target.value;
                            setEmailChannels(updated);
                          }} placeholder="admin@domain.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات البريد
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* تبويب SMS */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-600/15 border border-sky-500/20 p-2.5 rounded-xl text-sky-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">بوابة الرسائل القصيرة (SMS Gateway)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ربط مزودي خدمة الرسائل (مثل تقنيات، Unifonic) لإرسال تنبيهات SMS</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('sms')} className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> إضافة بوابة
                  </button>
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
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">مزود الخدمة</label>
                          <select value={sms.provider || 'taqnyat'} onChange={(e) => {
                            const updated = [...smsChannels];
                            updated[index].provider = e.target.value;
                            setSmsChannels(updated);
                          }} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500">
                            <option value="taqnyat">تقنيات (Taqnyat)</option>
                            <option value="unifonic">يونيفونيك (Unifonic)</option>
                            <option value="msegat">مسجات (Msegat)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">API Key / Token</label>
                          <input type="password" value={sms.apiKey || ''} onChange={(e) => {
                            const updated = [...smsChannels];
                            updated[index].apiKey = e.target.value;
                            setSmsChannels(updated);
                          }} placeholder="API Key..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">اسم المرسل (Sender Name)</label>
                          <input type="text" value={sms.senderName || ''} onChange={(e) => {
                            const updated = [...smsChannels];
                            updated[index].senderName = e.target.value;
                            setSmsChannels(updated);
                          }} placeholder="HookSignal" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات SMS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* تبويب التداول */}
          {activeTab === 'trading' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-600/15 border border-amber-500/20 p-2.5 rounded-xl text-amber-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">منصات التداول والأسواق العالمية (TradingView)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">استقبال وتفسير تنبيهات TradingView للأسهم الأمريكية والعملات الرقمية</p>
                    </div>
                  </div>
                  <button onClick={addTradingIntegration} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors shadow-lg">
                    <Plus className="w-4 h-4" /> ربط منصة
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {tradingIntegrations.map((item, index) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-amber-400">منصة تداول #{index + 1}</span>
                        {tradingIntegrations.length > 1 && (
                          <button onClick={() => removeTradingIntegration(item.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">المنصة</label>
                          <select value={item.platform || 'tradingview'} onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].platform = e.target.value;
                            setTradingIntegrations(updated);
                          }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500">
                            <option value="tradingview">تريدينج فيو (TradingView)</option>
                            <option value="binance">باينانس (Binance Futures)</option>
                            <option value="metatrader">ميتا تريدر (MetaTrader)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">نوع السوق</label>
                          <select value={item.marketType || 'crypto'} onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].marketType = e.target.value;
                            setTradingIntegrations(updated);
                          }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500">
                            <option value="crypto">عملات رقمية (Crypto)</option>
                            <option value="us_stocks">الأسهم الأمريكية (US Stocks)</option>
                            <option value="forex">فوركس (Forex)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم الاستراتيجية</label>
                          <input type="text" value={item.strategyName || ''} onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].strategyName = e.target.value;
                            setTradingIntegrations(updated);
                          }} placeholder="BTC_Strategy" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">مفتاح السرية</label>
                          <input type="password" value={item.secretKey || ''} onChange={(e) => {
                            const updated = [...tradingIntegrations];
                            updated[index].secretKey = e.target.value;
                            setTradingIntegrations(updated);
                          }} placeholder="secret_xxx" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات التداول
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* تبويب المتاجر */}
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
                      <p className="text-xs text-slate-500 mt-0.5">ربط منصات سلة (Salla)، زد (Zid)، ووومورس واستلام Webhooks الطلبات تلقائياً</p>
                    </div>
                  </div>
                  <button onClick={addStoreIntegration} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors shadow-lg">
                    <Plus className="w-4 h-4" /> ربط متجر
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {stores.map((store, index) => (
                    <div key={store.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-purple-400">متجر #{index + 1}</span>
                        {stores.length > 1 && (
                          <button onClick={() => removeStoreIntegration(store.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">منصة المتجر</label>
                          <select value={store.platform || 'salla'} onChange={(e) => {
                            const updated = [...stores];
                            updated[index].platform = e.target.value;
                            setStores(updated);
                          }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500">
                            <option value="salla">سلة (Salla)</option>
                            <option value="zid">زد (Zid)</option>
                            <option value="woocommerce">وومورس (WooCommerce)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم المتجر</label>
                          <input type="text" value={store.storeName || ''} onChange={(e) => {
                            const updated = [...stores];
                            updated[index].storeName = e.target.value;
                            setStores(updated);
                          }} placeholder="متجر العطور" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">مفتاح API</label>
                          <input type="password" value={store.apiKey || ''} onChange={(e) => {
                            const updated = [...stores];
                            updated[index].apiKey = e.target.value;
                            setStores(updated);
                          }} placeholder="api_token..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات المتاجر
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* تبويب الشركات */}
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
                      <p className="text-xs text-slate-500 mt-0.5">تنظيم الويب هوك الخاص بالشركات وفصل أقسامها (الدعم، المبيعات)</p>
                    </div>
                  </div>
                  <button onClick={addEnterpriseTeam} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors shadow-lg">
                    <Plus className="w-4 h-4" /> إضافة قسم
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {enterpriseTeams.map((team, index) => (
                    <div key={team.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-indigo-400">فرع/قسم الشركة #{index + 1}</span>
                        {enterpriseTeams.length > 1 && (
                          <button onClick={() => removeEnterpriseTeam(team.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم الشركة</label>
                          <input type="text" value={team.companyName || ''} onChange={(e) => {
                            const updated = [...enterpriseTeams];
                            updated[index].companyName = e.target.value;
                            setEnterpriseTeams(updated);
                          }} placeholder="شركة التقنية المتقدمة" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">القسم الداخلي</label>
                          <input type="text" value={team.department || ''} onChange={(e) => {
                            const updated = [...enterpriseTeams];
                            updated[index].department = e.target.value;
                            setEnterpriseTeams(updated);
                          }} placeholder="الدعم الفني / المبيعات" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات الشركات
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">قواعد توجيه الإشارات الذكية</h3>
                  <p className="text-xs text-slate-500 mt-1">توجيه الرسائل والطلبات بناءً على الـ Payload وشروط الفلترة المخصصة</p>
                </div>
                <button onClick={() => setRoutingRules([...routingRules, { id: Date.now(), condition: '' }])} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1">
                  <Plus className="w-4 h-4" /> إضافة قاعدة
                </button>
              </div>
              {routingRules.length === 0 ? <p className="text-xs text-slate-500 text-center py-6">لا توجد قواعد مضافة حتى الآن في حسابك المستقل.</p> : null}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">سجل المعاملات والطلبات الحي</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-48 overflow-y-auto">
                في انتظار استقبال طلبات الويب هوك الخاصة بحسابك المستقل (@{slug})...
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">إعدادات الحساب المستقل وقاعدة البيانات</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">معرف الحساب المستقل (Slug)</label>
                  <input type="text" value={slug} disabled className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">اسم المسؤول عن الحساب</label>
                  <input type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} placeholder="اسمك أو اسم المؤسسة" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
                </div>
                <button onClick={() => saveUserDataToDB()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow transition-colors">
                  حفظ وتحديث قاعدة البيانات المستقلة
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
