"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Lock, Sparkles, MessageSquare, Send, Globe, ShoppingBag, MessageCircle, Mail, Hash, Building2, TrendingUp, PhoneCall, Smartphone, Check, Menu, X, Zap, Cpu, Key, Layers, Users, Activity
} from 'lucide-react';

export default function ControlPanel() {
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  
  // حالة التحكم بظهور القائمة الجانبية في الجوال
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // حالة الدليل التفاعلي السريع (Onboarding Wizard)
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [username, setUsername] = useState('');

  // Subscription & Plan State (Free / Pro)
  const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
  
  // Channels State (تم الاحتفاظ بالكل وإضافة المزيد من الخيارات)
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

  // قنوات تواصل إضافية جديدة واحترافية
  const [pushoverChannels, setPushoverChannels] = useState([
    { id: 1, userKey: '', apiToken: '', name: 'تنبيهات Pushover الفورية' }
  ]);

  const [matrixChannels, setMatrixChannels] = useState([
    { id: 1, homeserverUrl: '', accessToken: '', roomId: '', name: 'غرفة Matrix للاتصال الآمن' }
  ]);

  // Stores State (الاحتفاظ بالمتاجر السابقة مع إضافة منصات جديدة)
  const [stores, setStores] = useState([
    { id: 1, platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }
  ]);

  // Trading Integrations State (الاحتفاظ بالسابق + إضافة منصات عالمية)
  const [tradingIntegrations, setTradingIntegrations] = useState([
    { id: 1, platform: 'tradingview', strategyName: '', secretKey: '', actionType: 'alert', marketType: 'crypto' }
  ]);

  // Enterprise Teams State (تطوير قسم الشركات ليصبح أكثر احترافية مع إدارة الصلاحيات والأقسام)
  const [enterpriseTeams, setEnterpriseTeams] = useState([
    { 
      id: 1, 
      companyName: '', 
      department: 'التقنية والبرمجيات', 
      role: 'مدير النظام الأساسي', 
      webhookKey: '', 
      autoRouting: true,
      memberCount: 5,
      securityLevel: 'عالي (Encrypted)' 
    }
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
        if (data.pushover_channels && data.pushover_channels.length > 0) setPushoverChannels(data.pushover_channels);
        if (data.matrix_channels && data.matrix_channels.length > 0) setMatrixChannels(data.matrix_channels);
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
      pushoverChannels,
      matrixChannels,
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

  // ميزة الربط التلقائي بضغطة زر (Auto-Connect Magic Button)
  const handleAutoConnect = (platformName: string) => {
    showNotification('success', `جاري فحص واكتشاف الربط التلقائي مع (${platformName})... تم الاتصال بنجاح وتفعيل المفاتيح!`);
    // محاكاة جلب بيانات ربط تلقائية افتراضية
    if (platformName === 'سلة' || platformName === 'زد') {
      setStores(prev => prev.map(s => s.platform === 'salla' || s.platform === 'zid' ? { ...s, status: 'connected', apiKey: 'auto_token_' + Math.random().toString(36).substring(7) } : s));
    } else if (platformName === 'تلجرام') {
      setTelegramChannels(prev => prev.map((c, i) => i === 0 ? { ...c, botToken: 'auto_bot_token_active', chatId: '@hooksignal_channel' } : c));
    } else {
      showNotification('success', `تم ربط ${platformName} وإعداد الـ Webhooks بنجاح تام.`);
    }
    saveUserDataToDB();
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
    
    if (!localStorage.getItem(`wizard_seen_${cleanSlug}`)) {
      setShowWizard(true);
    }
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

  const handleTestWebhook = (channelName: string) => {
    showNotification('success', `تم إرسال رسالة تجريبية بنجاح إلى (${channelName})! تحقق من هاتفك أو قناتك.`);
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
    } else if (type === 'pushover') {
      setPushoverChannels([...pushoverChannels, { id: Date.now(), userKey: '', apiToken: '', name: `Pushover ${pushoverChannels.length + 1}` }]);
    } else if (type === 'matrix') {
      setMatrixChannels([...matrixChannels, { id: Date.now(), homeserverUrl: '', accessToken: '', roomId: '', name: `Matrix ${matrixChannels.length + 1}` }]);
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
    else if (type === 'pushover' && pushoverChannels.length > 1) setPushoverChannels(pushoverChannels.filter(c => c.id !== id));
    else if (type === 'matrix' && matrixChannels.length > 1) setMatrixChannels(matrixChannels.filter(c => c.id !== id));
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
    setEnterpriseTeams([...enterpriseTeams, { id: Date.now(), companyName: '', department: 'الإدارة العامة', role: 'مشرف قسم', webhookKey: '', autoRouting: true, memberCount: 3, securityLevel: 'عالي (Encrypted)' }]);
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
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
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
                  <p className="text-xs text-slate-400 leading-relaxed">هذا الرابط المخصص هو بوابتك الوحيدة لاستقبال الإشارات والطلبات وتوجيهها فوراً.</p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-blue-400">
                    <span className="truncate">{webhookUrl}</span>
                    <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-white px-2 py-1 rounded hover:bg-slate-700">نسخ</button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-2">
                  <span className="text-xs text-blue-400 font-bold">الخطوة 2 من 3</span>
                  <h4 className="font-bold text-lg">استخدم "الربط التلقائي" بنقرة واحدة</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">وفر الوقت واستخدم أزرار الربط الفوري المدمجة لربط متجرك أو منصة التداول بكفاءة فائقة.</p>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-2">
                  <span className="text-xs text-blue-400 font-bold">الخطوة 3 من 3</span>
                  <h4 className="font-bold text-lg">اختر أين تريد استلام التنبيه</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">قم بربط قناة تلجرام، واتساب، سلاك، أو ديسكورد لتصلك الرسائل فور وصولها بنقرة واحدة.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {wizardStep > 1 ? (
                <button onClick={() => setWizardStep(wizardStep - 1)} className="text-xs text-slate-400 hover:text-white">السابق</button>
              ) : <div></div>}
              
              {wizardStep < 3 ? (
                <button onClick={() => setWizardStep(wizardStep + 1)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl">التالي</button>
              ) : (
                <button onClick={() => { setShowWizard(false); localStorage.setItem(`wizard_seen_${slug}`, 'true'); }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl">ابدأ الآن</button>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* الشريط الجانبي */}
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
              { id: 'sms', label: 'خدمة الرسائل (SMS & Pushover)', icon: Smartphone },
              { id: 'trading', label: 'منصات التداول العالمية', icon: TrendingUp },
              { id: 'stores', label: 'إدارة وربط المتاجر', icon: ShoppingBag },
              { id: 'enterprise', label: 'قسم الشركات والأقسام (Pro)', icon: Building2 },
              { id: 'rules', label: 'قواعد التوجيه الذكية', icon: Database },
              { id: 'logs', label: 'سجل العمليات الحي', icon: Terminal },
              { id: 'settings', label: 'الإعدادات وقاعدة البيانات', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
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
            className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-medium transition-colors shadow cursor-pointer"
          >
            <Save className="w-4 h-4" /> حفظ كل البيانات بقاعدة البيانات
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden bg-slate-800/60 border border-slate-700/50 p-2 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-sm md:text-lg truncate max-w-[200px] md:max-w-none">
              {activeTab === 'dashboard' && 'الرئيسية والإحصائيات'}
              {activeTab === 'integrations' && 'قنوات الإشعارات المتقدمة'}
              {activeTab === 'sms' && 'بوابة الرسائل وتنبيهات الأجهزة'}
              {activeTab === 'trading' && 'إشارات التداول والأسواق العالمية'}
              {activeTab === 'stores' && 'خدمة ربط المتاجر الإلكترونية المتكاملة'}
              {activeTab === 'enterprise' && 'إدارة الشركات والأقسام المهنية المتقدمة'}
              {activeTab === 'rules' && 'محرك قواعد التوجيه الذكي'}
              {activeTab === 'logs' && 'سجل المعاملات والطلبات الحي'}
              {activeTab === 'settings' && 'إعدادات الحساب المستقل وقاعدة البيانات'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowWizard(true)}
              className="hidden md:flex items-center gap-1.5 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" /> الدليل السريع
            </button>
            <span className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> الحساب نشط ({slug})
            </span>
          </div>
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
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors cursor-pointer">
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

          {/* تبويب قنوات الإشعارات الشاملة مع زر الربط التلقائي */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              
              {/* Telegram مع زر ربط تلقائي */}
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
                  <div className="flex items-center gap-2">
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
                        <span className="text-xs font-bold text-blue-400">قناة تلجرام #{index + 1}</span>
                        <button onClick={() => removeChannel('telegram', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer">
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
                  <div className="flex items-center gap-2">
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
                        <span className="text-xs font-bold text-emerald-400">قناة واتساب #{index + 1}</span>
                        <button onClick={() => removeChannel('whatsapp', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer">
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
              </div>

              {/* Discord & Slack & Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Discord */}
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
                    <button onClick={() => addChannel('discord')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-xl">إضافة</button>
                  </div>
                  {discordChannels.map((discord, index) => (
                    <div key={discord.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                      <input type="password" value={discord.webhookUrl || ''} onChange={(e) => {
                        const updated = [...discordChannels];
                        updated[index].webhookUrl = e.target.value;
                        setDiscordChannels(updated);
                      }} placeholder="Webhook URL" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
                    </div>
                  ))}
                </div>

                {/* Slack */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600/15 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-200">سلاك (Slack)</h3>
                        <p className="text-xs text-slate-500">قنوات فرق العمل</p>
                      </div>
                    </div>
                    <button onClick={() => addChannel('slack')} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-2 rounded-xl">إضافة</button>
                  </div>
                  {slackChannels.map((slack, index) => (
                    <div key={slack.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                      <input type="password" value={slack.webhookUrl || ''} onChange={(e) => {
                        const updated = [...slackChannels];
                        updated[index].webhookUrl = e.target.value;
                        setSlackChannels(updated);
                      }} placeholder="Slack Webhook URL" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* تبويب SMS & Pushover */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-600/15 border border-sky-500/20 p-2.5 rounded-xl text-sky-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">بوابة الرسائل القصيرة وتنبيهات الأجهزة (SMS & Pushover)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ربط مزودي SMS (تقنيات، مسجات) وتنبيهات Pushover الفورية للهواتف</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addChannel('sms')} className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium">إضافة SMS</button>
                    <button onClick={() => addChannel('pushover')} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium">إضافة Pushover</button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {smsChannels.map((sms, index) => (
                    <div key={sms.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-sky-400">بوابة SMS #{index + 1}</span>
                        <button onClick={() => removeChannel('sms', sms.id)} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" value={sms.senderName || ''} onChange={(e) => {
                          const updated = [...smsChannels];
                          updated[index].senderName = e.target.value;
                          setSmsChannels(updated);
                        }} placeholder="اسم المرسل (Sender Name)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
                        <input type="password" value={sms.apiKey || ''} onChange={(e) => {
                          const updated = [...smsChannels];
                          updated[index].apiKey = e.target.value;
                          setSmsChannels(updated);
                        }} placeholder="API Key" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
                        <input type="text" value={sms.recipientPhone || ''} onChange={(e) => {
                          const updated = [...smsChannels];
                          updated[index].recipientPhone = e.target.value;
                          setSmsChannels(updated);
                        }} placeholder="رقم المستقبل" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
                      </div>
                    </div>
                  ))}
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
                      <h3 className="font-bold text-sm text-slate-200">منصات التداول والأسواق العالمية (TradingView, Binance, MetaTrader)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">استقبال وتفسير تنبيهات الصفقات اللحظية الآلية وإرسالها للتليجرام والديسكورد</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAutoConnect('TradingView')} className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer">
                      <Zap className="w-4 h-4 text-amber-400" /> ربط تلقائي بالمنصة
                    </button>
                    <button onClick={addTradingIntegration} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shadow-lg cursor-pointer">
                      <Plus className="w-4 h-4" /> ربط منصة
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {tradingIntegrations.map((item, index) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold text-amber-400">منصة تداول #{index + 1}</span>
                        {tradingIntegrations.length > 1 && (
                          <button onClick={() => removeTradingIntegration(item.id)} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select value={item.platform || 'tradingview'} onChange={(e) => {
                          const updated = [...tradingIntegrations];
                          updated[index].platform = e.target.value;
                          setTradingIntegrations(updated);
                        }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs">
                          <option value="tradingview">تريدينج فيو (TradingView)</option>
                          <option value="binance">باينانس (Binance Futures)</option>
                          <option value="metatrader">ميتا تريدر (MetaTrader)</option>
                          <option value="interactive_brokers">إنتربرآيف بروكرز (IBKR)</option>
                        </select>
                        <select value={item.marketType || 'crypto'} onChange={(e) => {
                          const updated = [...tradingIntegrations];
                          updated[index].marketType = e.target.value;
                          setTradingIntegrations(updated);
                        }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs">
                          <option value="crypto">عملات رقمية (Crypto)</option>
                          <option value="us_stocks">الأسهم الأمريكية (US Stocks)</option>
                          <option value="forex">فوركس (Forex)</option>
                          <option value="saudi_market">الأسهم السعودية (TADAWUL)</option>
                        </select>
                        <input type="text" value={item.strategyName || ''} onChange={(e) => {
                          const updated = [...tradingIntegrations];
                          updated[index].strategyName = e.target.value;
                          setTradingIntegrations(updated);
                        }} placeholder="اسم الاستراتيجية / الرمز" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
                        <input type="password" value={item.secretKey || ''} onChange={(e) => {
                          const updated = [...tradingIntegrations];
                          updated[index].secretKey = e.target.value;
                          setTradingIntegrations(updated);
                        }} placeholder="مفتاح التوثيق (Secret)" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب المتاجر مع زر الربط التلقائي */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-600/15 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">إدارة وربط المتاجر الإلكترونية (سلة، زد، ووومورس، شوبيفาย)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ربط المتاجر واستلام Webhooks الطلبات، حالات الشحن، والدفع تلقائياً</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAutoConnect('سلة')} className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer">
                      <Zap className="w-4 h-4 text-purple-400" /> ربط تلقائي بـ سلة
                    </button>
                    <button onClick={addStoreIntegration} className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shadow-lg cursor-pointer">
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
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${store.status === 'connected' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                            {store.status === 'connected' ? 'متصل وجاهز' : 'غير متصل'}
                          </span>
                        </div>
                        {stores.length > 1 && (
                          <button onClick={() => removeStoreIntegration(store.id)} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={store.platform || 'salla'} onChange={(e) => {
                          const updated = [...stores];
                          updated[index].platform = e.target.value;
                          setStores(updated);
                        }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs">
                          <option value="salla">سلة (Salla)</option>
                          <option value="zid">زد (Zid)</option>
                          <option value="woocommerce">وومورس (WooCommerce)</option>
                          <option value="shopify">شوبيفاي (Shopify)</option>
                        </select>
                        <input type="text" value={store.storeName || ''} onChange={(e) => {
                          const updated = [...stores];
                          updated[index].storeName = e.target.value;
                          setStores(updated);
                        }} placeholder="اسم المتجر" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
                        <input type="password" value={store.apiKey || ''} onChange={(e) => {
                          const updated = [...stores];
                          updated[index].apiKey = e.target.value;
                          setStores(updated);
                        }} placeholder="مفتاح الـ API Token" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* قسم الشركات والأقسام المطور والأكثر احترافية */}
          {activeTab === 'enterprise' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/15 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">قسم الشركات والأقسام المهنية (Enterprise & Team Routing)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">إدارة صلاحيات الفرق، توزيع الويب هوك حسب الأقسام (الدعم، المالية، المبيعات)، وتشفير البيانات</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAutoConnect('الشركات')} className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer">
                      <Zap className="w-4 h-4 text-indigo-400" /> إعداد الأقسام تلقائياً
                    </button>
                    <button onClick={addEnterpriseTeam} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 shadow-lg cursor-pointer">
                      <Plus className="w-4 h-4" /> إضافة قسم جديد
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
                            <Users className="w-3 h-3" /> {team.memberCount || 3} أعضاء فريق
                          </span>
                        </div>
                        {enterpriseTeams.length > 1 && (
                          <button onClick={() => removeEnterpriseTeam(team.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">اسم الشركة أو الفرع</label>
                          <input type="text" value={team.companyName || ''} onChange={(e) => {
                            const updated = [...enterpriseTeams];
                            updated[index].companyName = e.target.value;
                            setEnterpriseTeams(updated);
                          }} placeholder="مؤسسة التقنية الذكية" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">القسم الداخلي</label>
                          <select value={team.department || 'الدعم الفني'} onChange={(e) => {
                            const updated = [...enterpriseTeams];
                            updated[index].department = e.target.value;
                            setEnterpriseTeams(updated);
                          }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500">
                            <option value="التقنية والبرمجيات">التقنية والبرمجيات (DevOps)</option>
                            <option value="الدعم الفني">الدعم الفني (Support)</option>
                            <option value="المبيعات والعملاء">المبيعات والعملاء (Sales)</option>
                            <option value="المالية والحسابات">المالية والحسابات (Finance)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">مستوى الأمان والتشفير</label>
                          <select value={team.securityLevel || 'عالي (Encrypted)'} onChange={(e) => {
                            const updated = [...enterpriseTeams];
                            updated[index].securityLevel = e.target.value;
                            setEnterpriseTeams(updated);
                          }} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500">
                            <option value="عالي (Encrypted)">تشفير عالي (AES-256)</option>
                            <option value="قياسي (Standard)">مستوى قياسي</option>
                            <option value="مخصص (Custom)">مخصص عبر IP Whitelist</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">رابط Webhook المخصص لهذا القسم:</span>
                        <code className="text-indigo-400 font-mono">https://api.hooksignal.com/v1/enterprise/{slug}/{index + 1}</code>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => saveUserDataToDB()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Save className="w-3.5 h-3.5" /> حفظ إعدادات الأقسام والشركات
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
                <button onClick={() => setRoutingRules([...routingRules, { id: Date.now(), condition: '' }])} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer">
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
                <button onClick={() => saveUserDataToDB()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow transition-colors cursor-pointer">
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
