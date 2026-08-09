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
  Send, 
  Database,
  ShieldCheck,
  MessageCircle,
  Mail,
  Smartphone,
  Globe,
  Sparkles,
  TrendingUp,
  Building2,
  Lock,
  ArrowUpRight
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

  // هيكل البيانات الشامل لجميع الخدمات ومنصات التداول والشركات
  const [settings, setSettings] = useState({
    username: '',
    userPlan: 'free',
    // منصات التداول والرسوم البيانية
    tradingviewWebhook: '',
    binanceWebhook: '',
    metaTraderWebhook: '',
    // قنوات التواصل
    telegramToken: '',
    telegramChatId: '',
    discordWebhook: '',
    slackWebhook: '',
    whatsappApiUrl: '',
    whatsappToken: '',
    emailTo: '',
    smsEndpoint: '',
    // قسم الشركات
    corporateName: '',
    corporateApiKey: '',
    corporateEndpoint: '',
    // تفعيل الخدمات الفردية (الخطة المجانية)
    upgradedServices: [] as string[],
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
  }, [router]);

  const fetchUserSettings = async (currentSlug: string) => {
    try {
      const res = await fetch(`/api/settings?slug=${currentSlug}`);
      const result = await res.json();
      
      if (result.success && result.data) {
        const data = result.data;
        setSettings({
          username: data.username || '',
          userPlan: data.user_plan || 'free',
          tradingviewWebhook: data.tradingview_webhook || '',
          binanceWebhook: data.binance_webhook || '',
          metaTraderWebhook: data.metatrader_webhook || '',
          telegramToken: data.telegram_token || '',
          telegramChatId: data.telegram_chat_id || '',
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
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setErrorMsg('فشل في جلب الإعدادات من قاعدة البيانات');
    } finally {
      setIsLoading(false);
    }
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

      const result = await res.json();

      if (result.success) {
        setSuccessMsg('تم حفظ وتحديث الإعدادات بنجاح في قاعدة البيانات!');
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

  // التوجيه إلى صفحة الترقية والدفع عند الضغط على زر الترقية الخاص بأي خدمة
  const handleUpgradeService = (serviceKey: string) => {
    router.push(`/upgrade?service=${serviceKey}`);
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
          <p className="text-sm text-slate-400">جاري تحميل لوحة التحكم الذكية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16" dir="rtl">
      
      {/* شريط التنقل العلوي */}
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

      {/* المحتوى الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-6">

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-3">
            <Database className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* صندوق رابط الويب هوك */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              رابط الويب هوك الموحد (Webhook Endpoint)
            </h2>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-mono">
              متوافق مع TradingView، Binance وغيرها
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

        {/* نموذج الإعدادات الشامل */}
        <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-8">
          
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-slate-200">إعدادات المنصات، الخدمات، وقسم الشركات</h2>
          </div>

          {/* 1. معلومات الحساب الأساسية */}
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
                  <option value="free">المجانية (Free) مع إمكانية ترقية خدمات منفردة</option>
                  <option value="pro">المتقدمة (Pro - شاملة)</option>
                  <option value="enterprise">الشركات (Enterprise)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. منصات التداول والرسوم البيانية (TradingView, Binance, MetaTrader) */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> 2. منصات التداول والرسوم البيانية (TradingView & Binance)
              </h3>
              <button
                type="button"
                onClick={() => handleUpgradeService('trading_platforms')}
                className="text-[10px] px-3 py-1 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                ترقية هذه الخدمة فقط <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">TradingView Alert Webhook</label>
                <input 
                  type="text"
                  value={settings.tradingviewWebhook}
                  onChange={(e) => setSettings({...settings, tradingviewWebhook: e.target.value})}
                  placeholder="Custom secret or token"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Binance Execution Hook</label>
                <input 
                  type="text"
                  value={settings.binanceWebhook}
                  onChange={(e) => setSettings({...settings, binanceWebhook: e.target.value})}
                  placeholder="Binance API key/secret ID"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">MetaTrader Bridge Hook</label>
                <input 
                  type="text"
                  value={settings.metaTraderWebhook}
                  onChange={(e) => setSettings({...settings, metaTraderWebhook: e.target.value})}
                  placeholder="MT4/MT5 Endpoint ID"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* 3. قنوات التواصل (تليجرام، ديسكورد، سلاك، واتساب، البريد، SMS) مع زر ترقية لكل خدمة */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" /> 3. قنوات الإشعارات (مع خيار ترقية قناة واحدة ضمن الخطة المجانية)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Telegram */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">تليجرام (Telegram)</span>
                  <button
                    type="button"
                    onClick={() => handleUpgradeService('telegram')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    ترقية هذه القناة فقط <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <input 
                  type="text"
                  value={settings.telegramToken}
                  onChange={(e) => setSettings({...settings, telegramToken: e.target.value})}
                  placeholder="Telegram Bot Token"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
                <input 
                  type="text"
                  value={settings.telegramChatId}
                  onChange={(e) => setSettings({...settings, telegramChatId: e.target.value})}
                  placeholder="Chat ID (-100...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              {/* Discord */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">ديسكورد (Discord)</span>
                  <button
                    type="button"
                    onClick={() => handleUpgradeService('discord')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    ترقية هذه القناة فقط <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <input 
                  type="text"
                  value={settings.discordWebhook}
                  onChange={(e) => setSettings({...settings, discordWebhook: e.target.value})}
                  placeholder="Discord Webhook URL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              {/* WhatsApp */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">واتساب (WhatsApp API)</span>
                  <button
                    type="button"
                    onClick={() => handleUpgradeService('whatsapp')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    ترقية هذه القناة فقط <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <input 
                  type="text"
                  value={settings.whatsappApiUrl}
                  onChange={(e) => setSettings({...settings, whatsappApiUrl: e.target.value})}
                  placeholder="WhatsApp API Endpoint"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              {/* Email & SMS */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">البريد و SMS</span>
                  <button
                    type="button"
                    onClick={() => handleUpgradeService('email_sms')}
                    className="text-[10px] px-2.5 py-1 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    ترقية هذه الخدمة فقط <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <input 
                  type="email"
                  value={settings.emailTo}
                  onChange={(e) => setSettings({...settings, emailTo: e.target.value})}
                  placeholder="alerts@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

            </div>
          </div>

          {/* 4. قسم الشركات (Corporate Webhooks & Enterprise Settings) */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> 4. قسم الشركات والمؤسسات (Corporate & Enterprise)
              </h3>
              <button
                type="button"
                onClick={() => handleUpgradeService('corporate')}
                className="text-[10px] px-3 py-1 rounded-lg border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                ترقية باقة الشركات <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-950/30 border border-slate-800/60 p-5 rounded-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">اسم الشركة أو المؤسسة</label>
                <input 
                  type="text"
                  value={settings.corporateName}
                  onChange={(e) => setSettings({...settings, corporateName: e.target.value})}
                  placeholder="مثال: شركة سمو الأرقام للتقنية"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">مفتاح المصادقة (Corporate API Key)</label>
                <input 
                  type="text"
                  value={settings.corporateApiKey}
                  onChange={(e) => setSettings({...settings, corporateApiKey: e.target.value})}
                  placeholder="corp_live_xxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">رابط السيرفر المخصص (Enterprise URL)</label>
                <input 
                  type="text"
                  value={settings.corporateEndpoint}
                  onChange={(e) => setSettings({...settings, corporateEndpoint: e.target.value})}
                  placeholder="https://api.yourcompany.com/v1/hook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* زر الحفظ النهائي */}
          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-8 py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  جاري الحفظ وتحديث قاعدة البيانات <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  حفظ جميع التعديلات <Save className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
