'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const slug = "mohammed-mohammed-ytai4j";
  
  const [username, setUsername] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [channelId, setChannelId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // توليد رابط الويب هوك تلقائياً بناءً على النطاق الحالي
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setWebhookUrl(`${baseUrl}/api/webhook?slug=${slug}`);
    }
  }, [slug]);

  // جلب البيانات تلقائياً عند تحديث الصفحة
  useEffect(() => {
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
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات", err);
      }
    }
    loadSettings();
  }, [slug]);

  // حفظ الإعدادات
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
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert('تم حفظ البيانات بنجاح');
    } else {
      alert('خطأ: ' + (data.error || 'حدث خطأ غير معروف'));
    }
  };

  // حذف السجل
  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    const res = await fetch(`/api/settings?slug=${slug}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setUsername('');
      setTelegramToken('');
      setTelegramChatId('');
      setDiscordWebhook('');
      setChannelId('');
      alert('تم الحذف بنجاح');
    }
  };

  // نسخ رابط الويب هوك
  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert('تم نسخ رابط الويب هوك بنجاح!');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">لوحة تحكم إشارات الويب هوك</h1>
        
        {/* قسم عرض وتوليد رابط الويب هوك */}
        <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <label className="block text-sm mb-2 text-blue-400 font-semibold">🔗 رابط الويب هوك الخاص بك:</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={webhookUrl} 
              readOnly 
              className="w-full p-2 bg-black border border-gray-700 rounded text-gray-300 text-sm" 
            />
            <button 
              type="button" 
              onClick={copyWebhook} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition whitespace-nowrap"
            >
              نسخ
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">اسم المستخدم (Slug):</label>
            <input 
              type="text" 
              value={slug} 
              disabled 
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-400" 
            />
          </div>

          <div>
            <label className="block text-sm mb-1">الاسم الظاهري:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" 
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Telegram Bot Token:</label>
            <input 
              type="text" 
              value={telegramToken} 
              onChange={(e) => setTelegramToken(e.target.value)} 
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" 
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Telegram Chat ID:</label>
            <input 
              type="text" 
              value={telegramChatId} 
              onChange={(e) => setTelegramChatId(e.target.value)} 
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" 
            />
          </div>

          <div>
            <label className="block text-sm mb-1">معرف القناة المرتبطة (Channel ID):</label>
            <input 
              type="text" 
              value={channelId} 
              onChange={(e) => setChannelId(e.target.value)} 
              placeholder="-100xxxxxxxxxx"
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" 
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Discord Webhook URL:</label>
            <input 
              type="text" 
              value={discordWebhook} 
              onChange={(e) => setDiscordWebhook(e.target.value)} 
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
            >
              حفظ في قاعدة البيانات
            </button>
            <button 
              type="button" 
              onClick={handleDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition"
            >
              حذف السجل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
