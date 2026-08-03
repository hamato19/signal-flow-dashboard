'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // الحقول الأساسية
  const [username, setUsername] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [channelId, setChannelId] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // الحقول الجديدة للمنصات الإضافية
  const [slackWebhook, setSlackWebhook] = useState('');
  const [teamsWebhook, setTeamsWebhook] = useState('');
  const [customWebhook, setCustomWebhook] = useState('');

  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug) {
      setSlug(savedSlug);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (slug && typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setWebhookUrl(`${baseUrl}/api/webhook/${slug}`);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    async function loadSettings() {
      try {
        const res = await fetch(`/api/settings?slug=${slug}`);
        const data = await res.json();
        if (data.success && data.settings) {
          setUsername(data.settings.username || '');
          setTelegramToken(data.settings.telegram_token || '');
          setTelegramChatId(data.settings.telegram_chat_id || '');
          setDiscordWebhook(data.settings.discord_webhook || '');
          setChannelId(data.settings.channel_id || '');
          setWhatsappToken(data.settings.whatsapp_token || '');
          setWhatsappPhoneId(data.settings.whatsapp_phone_id || '');
          // تحميل بيانات المنصات الجديدة إذا وجدت في قاعدة البيانات
          setSlackWebhook(data.settings.slack_webhook || '');
          setTeamsWebhook(data.settings.teams_webhook || '');
          setCustomWebhook(data.settings.custom_webhook || '');
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات", err);
      }
    }
    loadSettings();
  }, [slug]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = inputSlug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanSlug) {
      alert('الرجاء إدخال اسم مستخدم (Slug) صحيح');
      return;
    }
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    setUsername('');
    setTelegramToken('');
    setTelegramChatId('');
    setDiscordWebhook('');
    setChannelId('');
    setWhatsappToken('');
    setWhatsappPhoneId('');
    setSlackWebhook('');
    setTeamsWebhook('');
    setCustomWebhook('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        username,
        telegram_token: telegramToken,
        telegram_chat_id: telegramChatId,
        discord_webhook: discordWebhook,
        channel_id: channelId,
        whatsapp_token: whatsappToken,
        whatsapp_phone_id: whatsappPhoneId,
        slack_webhook: slackWebhook,
        teams_webhook: teamsWebhook,
        custom_webhook: customWebhook,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert('✨ تم حفظ إعدادات المنصات بنجاح في قاعدة البيانات');
    } else {
      alert('خطأ: ' + (data.error || 'حدث خطأ غير معروف'));
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟')) return;
    const res = await fetch(`/api/settings?slug=${slug}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      alert('تم حذف الحساب بنجاح');
      handleLogout();
    }
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('📋 تم نسخ رابط الويب هوك بنجاح!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">منصة  Hook
Signal</h1>
            <p className="text-sm text-gray-400 mt-2">أدخل اسم المستخدم (Slug) الخاص بك للوصول أو إنشاء لوحة التحكم</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">اسم المستخدم (Slug):</label>
              <input 
                type="text" 
                value={inputSlug} 
                onChange={(e) => setInputSlug(e.target.value)} 
                placeholder="my-custom-signal"
                required
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition text-sm" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-blue-600/20"
            >
              دخول / إنشاء لوحة التحكم
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        <div className="flex justify-between items-center mb-8 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
          <div>
            <h1 className="text-xl font-bold">لوحة تحكم  Hook
Signal</h1>
            <p className="text-xs text-blue-400 mt-0.5">المعرف: <span className="font-mono text-gray-300">{slug}</span></p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-medium transition"
          >
            تسجيل الخروج
          </button>
        </div>
        
        <div className="mb-6 p-5 bg-gray-900/80 border border-gray-800 rounded-2xl shadow-xl">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-blue-400">🔗 رابط الويب هوك الخاص بك:</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={webhookUrl} 
              readOnly 
              className="w-full p-2.5 bg-black/60 border border-gray-700 rounded-xl text-gray-300 text-xs font-mono select-all" 
            />
            <button 
              type="button" 
              onClick={copyWebhook} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition whitespace-nowrap shadow-md shadow-blue-600/20"
            >
              نسخ الرابط
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 bg-gray-900/50 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-3 mb-4">⚙️ إعدادات المنصات وقنوات التنبيه</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">الاسم الظاهري:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="اسمك أو اسم قناتك"
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">معرف القناة المرتبطة (Channel ID):</label>
              <input 
                type="text" 
                value={channelId} 
                onChange={(e) => setChannelId(e.target.value)} 
                placeholder="-100xxxxxxxxxx"
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Telegram Bot Token:</label>
              <input 
                type="text" 
                value={telegramToken} 
                onChange={(e) => setTelegramToken(e.target.value)} 
                placeholder="123456789:ABC..."
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Telegram Chat ID:</label>
              <input 
                type="text" 
                value={telegramChatId} 
                onChange={(e) => setTelegramChatId(e.target.value)} 
                placeholder="معرف الشات أو المجموعة"
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">WhatsApp Token:</label>
              <input 
                type="text" 
                value={whatsappToken} 
                onChange={(e) => setWhatsappToken(e.target.value)} 
                placeholder="توكن ميتا للواتساب"
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">WhatsApp Phone ID:</label>
              <input 
                type="text" 
                value={whatsappPhoneId} 
                onChange={(e) => setWhatsappPhoneId(e.target.value)} 
                placeholder="معرف رقم الهاتف"
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Discord Webhook URL:</label>
            <input 
              type="text" 
              value={discordWebhook} 
              onChange={(e) => setDiscordWebhook(e.target.value)} 
              placeholder="https://discord.com/api/webhooks/..."
              className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
            />
          </div>

          {/* قسم المنصات الجديدة الإضافية */}
          <div className="pt-2 border-t border-gray-800 space-y-4">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">🌐 منصات إضافية لتوسيع الربط</h3>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slack Webhook URL:</label>
              <input 
                type="text" 
                value={slackWebhook} 
                onChange={(e) => setSlackWebhook(e.target.value)} 
                placeholder="https://hooks.slack.com/services/..."
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Microsoft Teams Webhook URL:</label>
              <input 
                type="text" 
                value={teamsWebhook} 
                onChange={(e) => setTeamsWebhook(e.target.value)} 
                placeholder="https://outlook.office.com/webhook/..."
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Custom Webhook (إعادة توجيه لسيرفر خارجي):</label>
              <input 
                type="text" 
                value={customWebhook} 
                onChange={(e) => setCustomWebhook(e.target.value)} 
                placeholder="https://your-external-server.com/receiver"
                className="w-full p-2.5 bg-black/50 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition font-mono" 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-blue-600/20 text-sm"
            >
              حفظ الإعدادات في قاعدة البيانات
            </button>
            <button 
              type="button" 
              onClick={handleDelete} 
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-medium transition text-sm"
            >
              حذف الحساب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
