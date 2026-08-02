'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // حالات قنوات الإشعارات المختلفة
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  
  const [discordWebhook, setDiscordWebhook] = useState('');
  
  const [activeTab, setActiveTab] = useState<'telegram' | 'whatsapp' | 'discord'>('telegram');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('signal_user');
    // إذا لم يكن هناك مستخدم مسجل، قم بإعادته فوراً لصفحة الدخول لمنع الدخول غير المرخص
    if (!user) {
      router.push('/');
      return;
    }
    
    setUsername(user);
    
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhook/${user.toLowerCase()}`);
    }

    // استرجاع الإعدادات المحفوظة
    setTelegramToken(localStorage.getItem('telegram_token') || '');
    setTelegramChatId(localStorage.getItem('telegram_chat_id') || '');
    setWhatsappPhone(localStorage.getItem('whatsapp_phone') || '');
    setWhatsappApiKey(localStorage.getItem('whatsapp_apikey') || '');
    setDiscordWebhook(localStorage.getItem('discord_webhook') || '');
  }, [router]);

  const generateNewWebhook = () => {
    const randomSuffix = Math.random().toString(36).substring(7);
    setWebhookUrl(`${window.location.origin}/api/webhook/${username.toLowerCase()}-${randomSuffix}`);
  };

  const handleSaveSettings = (e: React.FormEvent, channel: string) => {
    e.preventDefault();
    if (channel === 'telegram') {
      localStorage.setItem('telegram_token', telegramToken);
      localStorage.setItem('telegram_chat_id', telegramChatId);
    } else if (channel === 'whatsapp') {
      localStorage.setItem('whatsapp_phone', whatsappPhone);
      localStorage.setItem('whatsapp_apikey', whatsappApiKey);
    } else if (channel === 'discord') {
      localStorage.setItem('discord_webhook', discordWebhook);
    }

    setStatusMessage(`تم حفظ إعدادات ${channel === 'telegram' ? 'تليجرام' : channel === 'whatsapp' ? 'واتساب' : 'ديسكورد'} بنجاح!`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // دالة إنهاء الجلسة وتسجيل الخروج لمنع التداخل
  const handleLogout = () => {
    localStorage.removeItem('signal_user');
    router.push('/');
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
            <p className="text-gray-400 text-sm mt-1">مرحباً بك مجدداً، إدارة إشارات التداول وتوجيهها للمنصات المختلفة</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              متصل بالخدمة
            </span>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              {username ? username.slice(0, 2).toUpperCase() : 'US'}
            </div>
            
            {/* زر تسجيل الخروج لإنهاء الجلسة */}
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>🚪</span> تسجيل خروج
            </button>
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

        {/* قسم رابط الاستقبال الأساسي (Webhook URL) */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>🔗</span> رابط الاستقبال الأساسي (Webhook URL)
            </h2>
            <p className="text-gray-400 text-xs mt-1">استخدم هذا الرابط في منصات التداول (مثل TradingView) لاستقبال الإشارات</p>
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

        {/* مركز ربط قنوات الإشعارات (تليجرام، واتساب، ديسكورد) */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-6">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>🚀</span> قنوات توجيه وإرسال الإشارات
            </h2>
            <p className="text-gray-400 text-xs mt-1">اختر المنصة التي تريد توجيه التنبيهات الفورية إليها تلقائياً فور استلام الإشارة</p>
          </div>

          {/* تبويبات التنقل بين المنصات */}
          <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
            <button
              onClick={() => setActiveTab('telegram')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${activeTab === 'telegram' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#07090e] text-gray-400 hover:text-white border border-gray-800'}`}
            >
              <span>🤖</span> تليجرام (Telegram)
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-[#07090e] text-gray-400 hover:text-white border border-gray-800'}`}
            >
              <span>💬</span> واتساب (WhatsApp)
            </button>
            <button
              onClick={() => setActiveTab('discord')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${activeTab === 'discord' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[#07090e] text-gray-400 hover:text-white border border-gray-800'}`}
            >
              <span>🎧</span> ديسكورد (Discord)
            </button>
          </div>

          {/* محتوى تبويب تليجرام */}
          {activeTab === 'telegram' && (
            <form onSubmit={(e) => handleSaveSettings(e, 'telegram')} className="space-y-4 animate-fade-in">
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
                {statusMessage ? <span className="text-emerald-400 text-xs font-semibold">{statusMessage}</span> : <span></span>}
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl transition text-xs shadow-md ml-auto">
                  حفظ إعدادات تليجرام
                </button>
              </div>
            </form>
          )}

          {/* محتوى تبويب واتساب */}
          {activeTab === 'whatsapp' && (
            <form onSubmit={(e) => handleSaveSettings(e, 'whatsapp')} className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-1.5">رقم الهاتف (مع رمز الدولة)</label>
                  <input 
                    type="text" 
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+966500000000"
                    className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1.5">مفتاح API الخاص بالخدمة (Instance/Token)</label>
                  <input 
                    type="password" 
                    value={whatsappApiKey}
                    onChange={(e) => setWhatsappApiKey(e.target.value)}
                    placeholder="التوكن الخاص ببرمجة الواتساب"
                    className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                {statusMessage ? <span className="text-emerald-400 text-xs font-semibold">{statusMessage}</span> : <span></span>}
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-xl transition text-xs shadow-md ml-auto">
                  حفظ إعدادات واتساب
                </button>
              </div>
            </form>
          )}

          {/* محتوى تبويب ديسكورد */}
          {activeTab === 'discord' && (
            <form onSubmit={(e) => handleSaveSettings(e, 'discord')} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs text-gray-300 mb-1.5">رابط ويب هوك سيرفر ديسكورد (Discord Webhook URL)</label>
                <input 
                  type="text" 
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                {statusMessage ? <span className="text-emerald-400 text-xs font-semibold">{statusMessage}</span> : <span></span>}
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition text-xs shadow-md ml-auto">
                  حفظ إعدادات ديسكورد
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </main>
  );
}
