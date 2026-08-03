'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const slug = "mohammed-mohammed-ytai4j"; // أو اجعله متغيراً ديناميكياً حسب المستخدم المسجل
  
  const [username, setUsername] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');

  // 1. جلب البيانات تلقائياً عند فتح أو تحديث الصفحة
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
          setWhatsappToken(data.settings.whatsapp_token || '');
          setWhatsappPhoneId(data.settings.whatsapp_phone_id || '');
        }
      } catch (err) {
        console.error("خطأ في الاتصال بقاعدة البيانات", err);
      }
    }
    loadSettings();
  }, [slug])

  // 2. حفظ الإعدادات في قاعدة البيانات
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
        whatsapp_token: whatsappToken,
        whatsapp_phone_id: whatsappPhoneId,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert('تم حفظ البيانات في قاعدة البيانات بنجاح!');
    } else {
      alert('خطأ: ' + data.error);
    }
  };

  // 3. حذف السجل نهائياً من قاعدة البيانات
  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف كافة البيانات والسجل نهائياً؟')) return;

    const res = await fetch(`/api/settings?slug=${slug}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      setUsername('');
      setTelegramToken('');
      setTelegramChatId('');
      setDiscordWebhook('');
      setWhatsappToken('');
      setWhatsappPhoneId('');
      alert('تم حذف السجل نهائياً من قاعدة البيانات');
    } else {
      alert('خطأ أثناء الحذف: ' + data.error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم إشارات الويب هوك</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium">اسم المستخدم (Slug):</label>
          <input type="text" value={slug} disabled className="w-full p-2 border rounded bg-gray-100" />
        </div>
        <div>
          <label className="block font-medium">الاسم الظاهري:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium">Telegram Bot Token:</label>
          <input type="text" value={telegramToken} onChange={(e) => setTelegramToken(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium">Telegram Chat ID:</label>
          <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium">Discord Webhook URL:</label>
          <input type="text" value={discordWebhook} onChange={(e) => setDiscordWebhook(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="flex gap-4 pt-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">حفظ في قاعدة البيانات</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">حذف السجل</button>
        </div>
      </form>
    </div>
  );
}
