'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('signal_user') || 'Mohammed';
    setUsername(user);
    // توليد رابط الويب هوك بناءً على النطاق الحالي واسم المستخدم
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhook/${user.toLowerCase()}`);
    }
  }, []);

  const generateNewWebhook = () => {
    const randomSuffix = Math.random().toString(36).substring(7);
    setWebhookUrl(`${window.location.origin}/api/webhook/${username.toLowerCase()}-${randomSuffix}`);
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* الهيدر */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#131b2e] border border-gray-800 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم الذكية</h1>
            <p className="text-gray-400 text-sm mt-1">مرحباً بك مجدداً، نظرة عامة على أداء نظام الوهابيكس</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 px-4 py-1.5 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              النظام يعمل بكفاءة
            </span>
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
              {username.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#131b2e] border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
            <p className="text-gray-400 text-sm mb-2">إجمالي الوهابيكس (اليوم)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">3,421</span>
              <span className="text-emerald-400 text-sm font-semibold">+14% عن أمس</span>
            </div>
          </div>

          <div className="bg-[#131b2e] border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
            <p className="text-gray-400 text-sm mb-2">العمليات الناجحة</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">99.8%</span>
              <span className="text-emerald-400 text-sm font-semibold">مستقر تماماً</span>
            </div>
          </div>

          <div className="bg-[#131b2e] border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
            <p className="text-gray-400 text-sm mb-2">وقت الاستجابة (Latency)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">45ms</span>
              <span className="text-purple-400 text-sm font-semibold">سرعة فائقة</span>
            </div>
          </div>
        </div>

        {/* قسم الويب هوك */}
        <div className="bg-[#131b2e] border border-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
          <div>
            <h2 className="text-lg font-bold">رابط الاستقبال الخاص بك (Webhook URL)</h2>
            <p className="text-gray-400 text-sm mt-1">استخدم هذا الرابط في منصات التداول أو المتاجر لإرسال التنبيهات الفورية</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              readOnly 
              value={webhookUrl} 
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none"
            />
            <button 
              onClick={generateNewWebhook}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-lg"
            >
              توليد رابط جديد +
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
