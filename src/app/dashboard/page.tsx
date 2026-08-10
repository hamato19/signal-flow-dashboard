"use client";

import React, { useState, useEffect } from 'react';
import { 
  Webhook, Copy, Check, LogOut, Save, Loader2, Settings, Database,
  ShieldCheck, MessageCircle, Globe, Sparkles, TrendingUp, Building2, Lock, Plus
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

  // هيكل البيانات المحدث: القنوات مصفوفة من الكائنات
  const [settings, setSettings] = useState({
    userPlan: 'free',
    tradingviewWebhook: '',
    binanceWebhook: '',
    metaTraderWebhook: '',
    telegramChannels: [{ token: '', chatId: '' }], // القنوات ككائنات مرتبطة
    discordWebhook: '',
    whatsappApiUrl: '',
    emailTo: '',
    corporateName: '',
    corporateApiKey: '',
    corporateEndpoint: '',
    upgradedServices: [] as string[],
    lockedGlobalChannel: { category: '', identifier: '' }
  });

  useEffect(() => {
    const userSlug = localStorage.getItem('user_slug');
    if (!userSlug) { router.push('/login'); return; }
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
          ...settings,
          userPlan: data.user_plan || 'free',
          tradingviewWebhook: data.tradingview_webhook || '',
          // استرجاع مصفوفة القنوات المرتبطة
          telegramChannels: (data.telegram_channels && data.telegram_channels.length > 0) 
            ? data.telegram_channels 
            : [{ token: data.telegram_token || '', chatId: data.telegram_chat_id || '' }],
          discordWebhook: data.discord_webhook || '',
          whatsappApiUrl: data.whatsapp_api_url || '',
          emailTo: data.email_to || '',
          corporateName: data.corporate_name || '',
          corporateApiKey: data.corporate_api_key || '',
          corporateEndpoint: data.corporate_endpoint || ''
        });
      }
    } catch (error) {
      setErrorMsg('فشل في جلب الإعدادات.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramChange = (index: number, field: 'token' | 'chatId', value: string) => {
    const newChannels = [...settings.telegramChannels];
    newChannels[index][field] = value;
    setSettings({ ...settings, telegramChannels: newChannels });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slug,
          ...settings,
          telegramChannels: settings.telegramChannels // إرسال المصفوفة المرتبطة للـ API
        }),
      });
      if ((await res.json()).success) {
        setSuccessMsg('تم الحفظ بنجاح!');
      }
    } catch (error) {
      setErrorMsg('خطأ أثناء الحفظ.');
    } finally {
      setIsSaving(false);
    }
  };

  // ... (بقية دوال الواجهة مثل Copy و Logout كما هي)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6" dir="rtl">
      {/* ... (الهيدر) */}
      
      <div className="space-y-6">
        {/* التليجرام: تكرار المصفوفة لضمان ربط التوكن والـ Chat ID كقناة واحدة */}
        {settings.telegramChannels.map((channel, index) => (
          <div key={index} className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 mb-3">قناة التليجرام #{index + 1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Bot Token"
                value={channel.token}
                onChange={(e) => handleTelegramChange(index, 'token', e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
              <input 
                placeholder="Chat ID"
                value={channel.chatId}
                onChange={(e) => handleTelegramChange(index, 'chatId', e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        ))}
        
        <button onClick={handleSave} className="bg-blue-600 px-6 py-2 rounded-xl text-xs">
          {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </div>
    </div>
  );
}
