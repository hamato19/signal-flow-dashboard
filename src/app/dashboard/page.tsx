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
  ShieldCheck
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

  // الحقول الخاصة بإعدادات المستخدم وقنوات الإرسال
  const [settings, setSettings] = useState({
    username: '',
    userPlan: 'free',
    telegramToken: '',
    telegramChatId: '',
    discordWebhook: '',
  });

  // التحقق من الجلسة وجلب بيانات المستخدم من قاعدة البيانات عند التحميل
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
          telegramToken: data.telegram_token || '',
          telegramChatId: data.telegram_chat_id || '',
          discordWebhook: data.discord_webhook || '',
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
        body: JSON.stringify({
          slug,
          username: settings.username,
          userPlan: settings.userPlan,
          telegramToken: settings.telegramToken,
          telegramChatId: settings.telegramChatId,
          discordWebhook: settings.discordWebhook,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setSuccessMsg('تم حفظ الإعدادات بنجاح!');
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

  // رابط الويب هوك الخاص بالمستخدم
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
          <p className="text-sm text-slate-400">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12" dir="rtl">
      
      {/* شريط العلو (Navbar) */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-xl">
              <Webhook className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-200">لوحة تحكم الإشارات</h1>
              <span className="text-[10px] text-blue-400 font-mono">Slug: {slug}</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800/60 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 text-slate-300 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-6">

        {/* رسائل التنبيه والنجاح */}
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
              <Send className="w-4 h-4 text-blue-400" />
              رابط الويب هوك الخاص بك (Webhook Endpoint)
            </h2>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-mono">
              جاهز للاستخدام من TradingView
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            قم بربط هذا الرابط بمنصات التداول أو تنبيهات الأسعار لإرسال الإشارات تلقائياً إلى قنواتك.
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

        {/* نموذج إعدادات القنوات والتنبيهات */}
        <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-slate-200">إعدادات حساب وبوتات التنبيه</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* اسم المستخدم */}
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

            {/* خطة الاشتراك */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">نوع الخطة</label>
              <select
                value={settings.userPlan}
                onChange={(e) => setSettings({...settings, userPlan: e.target.value})}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="free">المجانية (Free)</option>
                <option value="pro">المتقدمة (Pro)</option>
                <option value="enterprise">الشركات (Enterprise)</option>
              </select>
            </div>

            {/* Telegram Bot Token */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">توكن بوت تليجرام (Telegram Bot Token)</label>
              <input 
                type="text"
                value={settings.telegramToken}
                onChange={(e) => setSettings({...settings, telegramToken: e.target.value})}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                dir="ltr"
              />
            </div>

            {/* Telegram Chat ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">معرف المحادثة أو القناة (Telegram Chat ID)</label>
              <input 
                type="text"
                value={settings.telegramChatId}
                onChange={(e) => setSettings({...settings, telegramChatId: e.target.value})}
                placeholder="-100xxxxxxxxxx أو معرف المستخدم"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                dir="ltr"
              />
            </div>

            {/* Discord Webhook */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-slate-300">رابط ديسكورد ويب هوك (Discord Webhook URL)</label>
              <input 
                type="text"
                value={settings.discordWebhook}
                onChange={(e) => setSettings({...settings, discordWebhook: e.target.value})}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500 transition-all"
                dir="ltr"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  جاري الحفظ <Loader2 className="w-4 h-4 animate-spin" />
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
