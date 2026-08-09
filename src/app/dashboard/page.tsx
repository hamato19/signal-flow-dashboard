"use client";

import React, { useState, useEffect } from 'react';
import { 
  Webhook, 
  Copy, 
  Check, 
  LogOut, 
  Save, 
  Loader2, 
  Settings, 
  Database,
  ShieldCheck,
  MessageCircle,
  Globe,
  Sparkles,
  TrendingUp,
  Building2,
  Lock,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // هيكل البيانات الشامل
  const [settings, setSettings] = useState({
    username: '',
    userPlan: 'free' as string,
    tradingviewWebhook: '',
    binanceWebhook: '',
    metaTraderWebhook: '',
    telegramToken: '', 
    discordWebhook: '',
    slackWebhook: '',
    whatsappApiUrl: '',
    whatsappToken: '',
    emailTo: '',
    smsEndpoint: '',
    corporateName: '',
    corporateApiKey: '',
    corporateEndpoint: '',
    upgradedServices: [] as string[],
    lockedGlobalChannel: {
      category: '',
      identifier: ''
    }
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userSlug = localStorage.getItem('user_slug');

    if (!loggedIn || !userSlug) {
      router.push('/login');
      return;
    }

    setSlug(userSlug);
    fetchUserSettings(userSlug);

    const queryParams = new URLSearchParams(window.location.search);
    const upgradedService = queryParams.get('service');
    if (upgradedService) {
      setSettings(prev => ({
        ...prev,
        upgradedServices: [...new Set([...prev.upgradedServices, upgradedService])]
      }));
      setSuccessMsg(`تم تفعيل الخدمة بنجاح بعد الاشتراك! يمكنك الآن إضافة قنواتك الجديدة.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  }, [router]);

  const fetchUserSettings = async (currentSlug: string) => {
    try {
      const res = await fetch(`/api/settings?slug=${currentSlug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 404) {
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`خطأ في الخادم: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        const initialTrading = data.tradingview_webhook || data.binance_webhook || data.metatrader_webhook || '';
        const initialTelegram = data.telegram_token || '';
        const initialDiscord = data.discord_webhook || '';
        const initialWhatsapp = data.whatsapp_api_url || '';
        const initialEmailSms = data.email_to || '';
        const initialCorporate = data.corporate_name || '';

        let globalLockedCat = '';
        let globalLockedVal = '';
        if (initialTrading) { globalLockedCat = 'trading_platforms'; globalLockedVal = initialTrading; }
        else if (initialTelegram) { globalLockedCat = 'telegram'; globalLockedVal = initialTelegram; }
        else if (initialDiscord) { globalLockedCat = 'discord'; globalLockedVal = initialDiscord; }
        else if (initialWhatsapp) { globalLockedCat = 'whatsapp'; globalLockedVal = initialWhatsapp; }
        else if (initialEmailSms) { globalLockedCat = 'email_sms'; globalLockedVal = initialEmailSms; }
        else if (initialCorporate) { globalLockedCat = 'corporate'; globalLockedVal = initialCorporate; }

        setSettings({
          username: data.username || '',
          userPlan: data.user_plan || 'free',
          tradingviewWebhook: data.tradingview_webhook || '',
          binanceWebhook: data.binance_webhook || '',
          metaTraderWebhook: data.metatrader_webhook || '',
          telegramToken: data.telegram_token || '',
          discordWebhook: data.discord_webhook || '',
          slackWebhook: data.slack_webhook || '',
          whatsappApiUrl: data.whatsapp_api_url || '',
          whatsappToken: data.whatsapp_token || '',
          emailTo: data.email_to || '',
          smsEndpoint: data.sms_endpoint || '',
          corporateName: data.corporate_name || '',
          corporateApiKey: data.corporate_api_key || '',
          corporateEndpoint: data.corporate_endpoint || '',
          upgradedServices: data.upgraded_services || [],
          lockedGlobalChannel: {
            category: globalLockedCat,
            identifier: globalLockedVal
          }
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setErrorMsg('فشل في جلب الإعدادات من قاعدة البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  // التحكم الصارم بقناة مجانية واحدة فقط (تم إصلاح خطأ TypeScript بنجاح)
  const handleFieldChange = (field: string, value: string, category: string) => {
    const isFree = settings.userPlan === 'free';

    if (isFree && value.trim() !== '') {
      if (settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== category) {
        router.push(`/upgrade?service=all_channels`);
        return;
      }
      const lockedVal = settings.lockedGlobalChannel.identifier;
      if (lockedVal && lockedVal !== '' && value !== lockedVal) {
        router.push(`/upgrade?service=${category}`);
        return;
      }
    }

    let updatedGlobal = { ...settings.lockedGlobalChannel };
    if (isFree && !updatedGlobal.identifier && value.trim() !== '') {
      updatedGlobal = { category, identifier: value };
    }

    setSettings({
      ...settings,
      [field]: value,
      lockedGlobalChannel: updatedGlobal
    });
  };

  const handleAddChannelClick = (category: string) => {
    router.push(`/upgrade?service=${category}`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...settings }),
      });

      if (!res.ok) {
        throw new Error(`فشل الاتصال بالخادم برمز: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        setSuccessMsg('تم حفظ وتحديث الإعدادات بنجاح في قاعدة البيانات وسيتم استرجاعها دائماً!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(result.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error: any) {
      setErrorMsg('خطأ في الاتصال بالخادم: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_slug');
    router.push('/login');
  };

  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/webhook/${slug}` 
    : `/api/webhook/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-400">جاري استرجاع بياناتك من قاعدة البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16" dir="rtl">
      
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2.5 rounded-xl">
              <Webhook className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-200">لوحة تحكم الإشارات الاحترافية</h1>
              <span className="text-[10px] text-blue-400 font-mono">Slug: @{slug}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              الباقة: <strong className="uppercase text-blue-400">{settings.userPlan}</strong>
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-800/60 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 text-slate-300 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-6">

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-3 shadow-lg">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-3 shadow-lg">
            <Database className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              رابط الويب هوك الموحد (Webhook Endpoint)
            </h2>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-mono">
              متوافق مع المنصات المختلفة
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            قم بلصق هذا الرابط في منصات التداول لاستقبال التنبيهات وإرسالها فورياً للقنوات المفعلة.
          </p>

          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={webhookUrl}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono select-all"
              dir="ltr"
            />
            <button 
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-8">
          
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-slate-200">إعدادات المنصات والقنوات</h2>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-amber-200 font-bold">قاعدة الباقة المجانية:</strong>
              <p className="text-amber-300/90 leading-relaxed">
                يُسمح لك بقناة واحدة فقط مجاناً لإجمالي الأقسام. سيتم حفظ بياناتك دائماً في قاعدة البيانات واسترجاعها تلقائياً عند تسجيل الدخول في أي وقت.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">1. معلومات الحساب الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">اسم المستخدم أو اللقب</label>
                <input 
                  type="text"
                  value={settings.username}
                  onChange={(e) => setSettings({...settings, username: e.target.value})}
                  placeholder="أدخل اسمك"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">نوع الخطة العامة</label>
                <select
                  value={settings.userPlan}
                  onChange={(e) => setSettings({...settings, userPlan: e.target.value})}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="free">المجانية (قناة واحدة فقط لجميع الأقسام)</option>
                  <option value="pro">المتقدمة (Pro - قنوات غير محدودة)</option>
                  <option value="enterprise">الشركات (Enterprise)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> 2. منصات التداول والرسوم البيانية
              </h3>
              <button
                type="button"
                onClick={() => handleAddChannelClick('trading_platforms')}
                className="text-[10px] px-3 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3 h-3" /> إضافة قناة جديدة (يتطلب اشتراك)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>TradingView Webhook</span>
                  {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'trading_platforms' && <Lock className="w-3 h-3 text-amber-400" />}
                </label>
                <input 
                  type="text"
                  value={settings.tradingviewWebhook}
                  onChange={(e) => handleFieldChange('tradingviewWebhook', e.target.value, 'trading_platforms')}
                  placeholder="Webhook URL or Secret"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Binance Execution Hook</span>
                  {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'trading_platforms' && <Lock className="w-3 h-3 text-amber-400" />}
                </label>
                <input 
                  type="text"
                  value={settings.binanceWebhook}
                  onChange={(e) => handleFieldChange('binanceWebhook', e.target.value, 'trading_platforms')}
                  placeholder="Binance API key"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>MetaTrader Bridge Hook</span>
                  {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'trading_platforms' && <Lock className="w-3 h-3 text-amber-400" />}
                </label>
                <input 
                  type="text"
                  value={settings.metaTraderWebhook}
                  onChange={(e) => handleFieldChange('metaTraderWebhook', e.target.value, 'trading_platforms')}
                  placeholder="MT4/MT5 Endpoint ID"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" /> 3. قنوات الإشعارات والتواصل
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    تليجرام (Bot Token فقط)
                    {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'telegram' && <Lock className="w-3 h-3 text-amber-400" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddChannelClick('telegram')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3 h-3" /> إضافة قناة جديدة
                  </button>
                </div>
                
                <input 
                  type="text"
                  value={settings.telegramToken}
                  onChange={(e) => handleFieldChange('telegramToken', e.target.value, 'telegram')}
                  placeholder="Telegram Bot Token (e.g., 123456:ABC-DEF...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />

                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl space-y-1 text-[11px] text-slate-300">
                  <p className="font-bold text-blue-400">طرق الاستلام المتاحة:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    <li><strong>مباشر:</strong> تصل الإشارات لمحادثة البوت الخاصة.</li>
                    <li><strong>قناة/مجموعة:</strong> أضف البوت <strong>مشرفاً (Admin)</strong> في قناتك.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    ديسكورد (Discord Webhook)
                    {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'discord' && <Lock className="w-3 h-3 text-amber-400" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddChannelClick('discord')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3 h-3" /> إضافة قناة جديدة
                  </button>
                </div>
                <input 
                  type="text"
                  value={settings.discordWebhook}
                  onChange={(e) => handleFieldChange('discordWebhook', e.target.value, 'discord')}
                  placeholder="Discord Webhook URL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    خدمة واتساب (WhatsApp API)
                    {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'whatsapp' && <Lock className="w-3 h-3 text-amber-400" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddChannelClick('whatsapp')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3 h-3" /> إضافة قناة جديدة
                  </button>
                </div>
                <input 
                  type="text"
                  value={settings.whatsappApiUrl}
                  onChange={(e) => handleFieldChange('whatsappApiUrl', e.target.value, 'whatsapp')}
                  placeholder="WhatsApp API Endpoint"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    البريد الإلكتروني والرسائل
                    {settings.userPlan === 'free' && settings.lockedGlobalChannel.category && settings.lockedGlobalChannel.category !== 'email_sms' && <Lock className="w-3 h-3 text-amber-400" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddChannelClick('email_sms')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3 h-3" /> إضافة قناة جديدة
                  </button>
                </div>
                <input 
                  type="email"
                  value={settings.emailTo}
                  onChange={(e) => handleFieldChange('emailTo', e.target.value, 'email_sms')}
                  placeholder="alerts@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> 4. باقة الشركات والمؤسسات الكاملة (Enterprise)
              </h3>
              <button
                type="button"
                onClick={() => handleAddChannelClick('corporate')}
                className="text-[10px] px-3 py-1 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3 h-3" /> إضافة مؤسسة جديدة (يتطلب اشتراك)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-950/30 border border-slate-800/60 p-5 rounded-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">اسم الشركة أو المؤسسة</label>
                <input 
                  type="text"
                  value={settings.corporateName}
                  onChange={(e) => handleFieldChange('corporateName', e.target.value, 'corporate')}
                  placeholder="مثال: شركة سمو الأرقام للتقنية"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">مفتاح المصادقة (API Key)</label>
                <input 
                  type="text"
                  value={settings.corporateApiKey}
                  onChange={(e) => handleFieldChange('corporateApiKey', e.target.value, 'corporate')}
                  placeholder="corp_live_xxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">رابط السيرفر المخصص</label>
                <input 
                  type="text"
                  value={settings.corporateEndpoint}
                  onChange={(e) => handleFieldChange('corporateEndpoint', e.target.value, 'corporate')}
                  placeholder="https://api.yourcompany.com/v1/hook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-8 py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  جاري الحفظ في قاعدة البيانات <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  حفظ التعديلات <Save className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
