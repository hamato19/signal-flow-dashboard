'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // حالات خاصة بربط قناة تلجرام
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isTelegramSaved, setIsTelegramSaved] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('signal_user') || 'Mohammed';
    setUsername(user);
    
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhook/${user.toLowerCase()}`);
    }

    // استرجاع إعدادات تلجرام المحفوظة مسبقاً إن وجدت
    const savedToken = localStorage.getItem('telegram_token') || '';
    const savedChatId = localStorage.getItem('telegram_chat_id') || '';
    if (savedToken) setTelegramToken(savedToken);
    if (savedChatId) setTelegramChatId(savedChatId);
  }, []);

  const generateNewWebhook = () => {
    const randomSuffix = Math.random().toString(36).substring(7);
    setWebhookUrl(`${window.location.origin}/api/webhook/${username.toLowerCase()}-${randomSuffix}`);
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('telegram_token', telegramToken);
    localStorage.setItem('telegram_chat_id', telegramChatId);
    setIsTelegramSaved(true);
    setTimeout(() => setIsTelegramSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* الهيدر العلوي */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/30">نظام نشط</span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">لوحة التحكم الذكية</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">مرحباً بك مجدداً، نظرة عامة على أداء نظام الوهابيكس وإشارات التداول</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              متصل بالخدمة
            </span>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              {username.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* شبكة الإحصائيات والأداء */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#101726] border border-gray-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>
            <p className="text-gray-400 text-xs font-medium mb-1">إجمالي الوهابيكس (اليوم)</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold tracking-tight">3,421</span>
              <span className="text-emerald-400 text-xs font-semibold">+14% عن أمس</span>
            </div>
          </div>

          <div className="bg-[#101726] border border-gray-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500"></div>
            <p className="text-gray-400 text-xs font-medium mb-1">العمليات الناجحة</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold tracking-tight">99.8%</span>
              <span className="text-emerald-400 text-xs font-semibold">مستقر تماماً</span>
            </div>
          </div>

          <div className="bg-[#101726] border border-gray-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-purple-500"></div>
            <p className="text-gray-400 text-xs font-medium mb-1">وقت الاستجابة (Latency)</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold tracking-tight">45ms</span>
              <span className="text-purple-400 text-xs font-semibold">سرعة فائقة</span>
            </div>
          </div>
        </div>

        {/* قسم رابط الاستقبال (Webhook URL) */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>🔗</span> رابط الاستقبال الخاص بك (Webhook URL)
            </h2>
            <p className="text-gray-400 text-xs mt-1">استخدم هذا الرابط في منصات التداول أو المتاجر لإرسال التنبيهات الفورية</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              readOnly 
              value={webhookUrl} 
              className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 text-xs focus:outline-none"
            />
            <button 
              onClick={generateNewWebhook}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium px-5 py-3 rounded-xl transition text-xs whitespace-nowrap shadow-md"
            >
              توليد رابط جديد +
            </button>
          </div>
        </div>

        {/* قسم ربط قناة تليجرام الجديد */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>🤖</span> ربط قناة تليجرام للإشعارات الفورية
            </h2>
            <p className="text-gray-400 text-xs mt-1">قم بإدخال بيانات بوت تليجرام ومعرف القناة ليصلك كل تنبيه جديد مباشرة على القناة</p>
          </div>

          <form onSubmit={handleSaveTelegram} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1.5">توكن البوت (Bot Token)</label>
                <input 
                  type="password" 
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1.5">معرف القناة أو المستخدم (Chat ID)</label>
                <input 
                  type="text" 
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="@MyChannel یا -100xxxxxxxxx"
                  className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isTelegramSaved ? (
                <span className="text-emerald-400 text-xs font-semibold animate-fade-in">
                  ✓ تم حفظ إعدادات تليجرام بنجاح!
                </span>
              ) : <span></span>}
              
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-xl transition text-xs shadow-md ml-auto"
              >
                حفظ إعدادات تليجرام
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
