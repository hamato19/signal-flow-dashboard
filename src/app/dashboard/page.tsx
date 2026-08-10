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
  Trash2
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

  // هيكل البيانات الشامل لكل الأقسام مع دعم قنوات تليجرام المتعددة
  const [settings, setSettings] = useState({
    userPlan: 'free' as string,
    tradingviewWebhook: '',
    binanceWebhook: '',
    metaTraderWebhook: '',
    telegramChannels: [{ token: '', chatId: '' }] as { token: string; chatId: string }[],
    discordWebhook: '',
    whatsappApiUrl: '',
    emailTo: '',
    corporateName: '',
    corporateApiKey: '',
    corporateEndpoint: '',
    upgradedServices: [] as string[]
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
        
        // جلب القنوات المخزنة أو تهيئتهم بقناة افتراضية واحدة
        let tChannels = [{ token: data.telegram_token || '', chatId: data.telegram_chat_id || '' }];
        if (data.telegram_channels && Array.isArray(data.telegram_channels) && data.telegram_channels.length > 0) {
          tChannels = data.telegram_channels;
        }

        setSettings({
          userPlan: data.user_plan || 'free',
          tradingviewWebhook: data.tradingview_webhook || '',
          binanceWebhook: data.binance_webhook || '',
          metaTraderWebhook: data.metatrader_webhook || '',
          telegramChannels: tChannels,
          discordWebhook: data.discord_webhook || '',
          whatsappApiUrl: data.whatsapp_api_url || '',
          emailTo: data.email_to || '',
          corporateName: data.corporate_name || '',
          corporateApiKey: data.corporate_api_key || '',
          corporateEndpoint: data.corporate_endpoint || '',
          upgradedServices: data.upgraded_services || []
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setErrorMsg('فشل في جلب الإعدادات من قاعدة البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لإضافة صندوق قناة تليجرام جديد
  const handleAddTelegramChannel = () => {
    if (settings.userPlan === 'free' && settings.telegramChannels.length >= 1) {
      router.push('/upgrade?service=telegram');
      return;
    }
    setSettings({
      ...settings,
      telegramChannels: [...settings.telegramChannels, { token: '', chatId: '' }]
    });
  };

  // دالة لحذف صندوق قناة تليجرام
  const handleRemoveTelegramChannel = (index: number) => {
    if (settings.telegramChannels.length === 1) return; // الحفاظ على صندوق واحد على الأقل
    const updated = settings.telegramChannels.filter((_, i) => i !== index);
    setSettings({ ...settings, telegramChannels: updated });
  };

  const handleTelegramChange = (index: number, field: 'token' | 'chatId', value: string) => {
    const newChannels = [...settings.telegramChannels];
    newChannels[index][field] = value;
    setSettings({ ...settings, telegramChannels: newChannels });
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
        body: JSON.stringify({ 
          slug, 
          user_plan: settings.userPlan,
          telegramChannels: settings.telegramChannels,
          telegram_token: settings.telegramChannels[0]?.token || '',
          telegram_chat_id: settings.telegramChannels[0]?.chatId || '',
          discord_webhook: settings.discordWebhook,
          tradingview_webhook: settings.tradingviewWebhook,
          binance_webhook: settings.binanceWebhook,
          metatrader_webhook: settings.metaTraderWebhook,
          whatsapp_api_url: settings.whatsappApiUrl,
          email_to: settings.emailTo,
          corporate_name: settings.corporateName,
          corporate_api_key: settings.corporateApiKey,
          corporate_endpoint: settings.corporateEndpoint,
          upgraded_services: settings.upgradedServices
        }),
      });

      if (!res.ok) {
        throw new Error(`فشل الاتصال بالخادم برمز: ${res.status}`);
      }

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
      
      {/* الهيدر */}
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

        {/* رابط الويب هوك */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              رابط الويب هوك الموحد (Webhook Endpoint)
            </h2>
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
            <h2 className="text-sm font-bold text-slate-200">إعدادات قنوات الإرسال والتنبيهات</h2>
          </div>

          {/* 1. منصات التداول */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> 1. منصات التداول والرسوم البيانية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">TradingView Webhook</label>
                <input 
                  type="text"
                  value={settings.tradingviewWebhook}
                  onChange={(e) => setSettings({...settings, tradingviewWebhook: e.target.value})}
                  placeholder="Webhook URL or Secret"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Binance Execution Hook</label>
                <input 
                  type="text"
                  value={settings.binanceWebhook}
                  onChange={(e) => setSettings({...settings, binanceWebhook: e.target.value})}
                  placeholder="Binance API key"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
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
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* 2. قنوات الإشعارات (تليجرام الديناميكي المتعدد + البقية) */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" /> 2. قنوات الإشعارات والتواصل
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* قسم التليجرام الديناميكي */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-4 md:col-span-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    قنوات تليجرام (Telegram Bot & Chat ID)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddTelegramChannel}
                    className="text-[10px] px-3 py-1.5 rounded-xl border bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة قناة جديدة
                  </button>
                </div>

                <div className="space-y-3">
                  {settings.telegramChannels.map((channel, index) => (
                    <div key={index} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl relative space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-400">قناة التليجرام #{index + 1}</span>
                        {settings.telegramChannels.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTelegramChannel(index)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg cursor-pointer transition-all"
                            title="حذف هذه القناة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 mb-1 block">Bot Token</label>
                          <input 
                            type="text"
                            value={channel.token}
                            onChange={(e) => handleTelegramChange(index, 'token', e.target.value)}
                            placeholder="123456:ABC-DEF..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                            dir="ltr"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 mb-1 block">Chat ID (معرف القناة أو المستخدم)</label>
                          <input 
                            type="text"
                            value={channel.chatId}
                            onChange={(e) => handleTelegramChange(index, 'chatId', e.target.value)}
                            placeholder="-100xxxxxxxxxx أو @channel_name"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ديسكورد */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-200 block">ديسكورد (Discord Webhook)</span>
                <input 
                  type="text"
                  value={settings.discordWebhook}
                  onChange={(e) => setSettings({...settings, discordWebhook: e.target.value})}
                  placeholder="Discord Webhook URL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

              {/* واتساب */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-200 block">خدمة واتساب (WhatsApp API)</span>
                <input 
                  type="text"
                  value={settings.whatsappApiUrl}
                  onChange={(e) => setSettings({...settings, whatsappApiUrl: e.target.value})}
                  placeholder="WhatsApp API Endpoint"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  dir="ltr"
                />
              </div>

            </div>
          </div>

          {/* 3. باقة الشركات والمؤسسات */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> 3. باقة الشركات والمؤسسات الكاملة (Enterprise)
            </h3>
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
                <label className="text-xs font-medium text-slate-300">مفتاح المصادقة (API Key)</label>
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
                <label className="text-xs font-medium text-slate-300">رابط السيرفر المخصص</label>
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
