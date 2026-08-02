'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LogItem {
  id: string;
  time: string;
  endpoint: string;
  platform: 'Telegram' | 'WhatsApp' | 'Discord';
  status: 'نجاح' | 'فشل';
  details: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [currentPlan, setCurrentPlan] = useState('free');
  
  // إدارة الروابط المולّدة والحدود
  const [webhookUrls, setWebhookUrls] = useState<string[]>([]);
  const [activeWebhook, setActiveWebhook] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [limitError, setLimitError] = useState('');
  
  // حالات قنوات الإشعارات المختلفة
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  
  const [discordWebhook, setDiscordWebhook] = useState('');
  
  const [activeTab, setActiveTab] = useState<'telegram' | 'whatsapp' | 'discord'>('telegram');
  const [statusMessage, setStatusMessage] = useState('');

  // سجل العمليات (Logs)
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', time: 'منذ دقيقتين', endpoint: '/api/webhook/fahad', platform: 'Telegram', status: 'نجاح', details: 'إشارة شراء BTCUSDT - صفقات ناجحة' },
    { id: '2', time: 'منذ 15 دقيقة', endpoint: '/api/webhook/fahad', platform: 'Discord', status: 'نجاح', details: 'تنبيه اختراق مقاومة ETHUSDT' },
    { id: '3', time: 'منذ ساعة', endpoint: '/api/webhook/fahad-x1', platform: 'WhatsApp', status: 'فشل', details: 'خطأ في المصادقة (Invalid API Key)' },
  ]);

  const getPlanLimit = (plan: string) => {
    switch (plan) {
      case 'free': return 5;
      case '30': return 30;
      case '100': return 100;
      case 'unlimited': return Infinity;
      default: return 5;
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'الباقة التجريبية (5 روابط)';
      case '30': return 'الباقة المرنة (30 رابط)';
      case '100': return 'باقة المحترفين (100 رابط)';
      case 'unlimited': return 'الباقة المفتوحة (غير محدود)';
      default: return 'الباقة التجريبية';
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('signal_user');
    const plan = localStorage.getItem('signal_plan') || 'free';
    
    if (!user) {
      router.push('/');
      return;
    }
    
    setUsername(user);
    setCurrentPlan(plan);
    
    const savedUrls = localStorage.getItem(`webhook_list_${user}`);
    if (savedUrls) {
      const parsed = JSON.parse(savedUrls);
      setWebhookUrls(parsed);
      setActiveWebhook(parsed[0]);
    } else {
      const initialUrl = `${window.location.origin}/api/webhook/${user.toLowerCase()}`;
      setWebhookUrls([initialUrl]);
      setActiveWebhook(initialUrl);
      localStorage.setItem(`webhook_list_${user}`, JSON.stringify([initialUrl]));
    }

    setTelegramToken(localStorage.getItem('telegram_token') || '');
    setTelegramChatId(localStorage.getItem('telegram_chat_id') || '');
    setWhatsappPhone(localStorage.getItem('whatsapp_phone') || '');
    setWhatsappApiKey(localStorage.getItem('whatsapp_apikey') || '');
    setDiscordWebhook(localStorage.getItem('discord_webhook') || '');
  }, [router]);

  const generateNewWebhook = () => {
    setLimitError('');
    const limit = getPlanLimit(currentPlan);

    if (webhookUrls.length >= limit) {
      setLimitError(`لقد وصلت إلى الحد الأقصى للروابط المسموحة في باقتك الحالية (${limit} روابط).`);
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(7);
    const newUrl = `${window.location.origin}/api/webhook/${username.toLowerCase()}-${randomSuffix}`;
    
    const updatedUrls = [newUrl, ...webhookUrls];
    setWebhookUrls(updatedUrls);
    setActiveWebhook(newUrl);
    localStorage.setItem(`webhook_list_${username}`, JSON.stringify(updatedUrls));
  };

  const handleCopy = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
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

  const handleLogout = () => {
    localStorage.removeItem('signal_user');
    localStorage.removeItem('signal_plan');
    router.push('/');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const maxLimit = getPlanLimit(currentPlan);

  return (
    <main className="min-h-screen bg-[#07090e] text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* الهيدر العلوي */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/30">نظام نشط</span>
              <span className="bg-purple-600/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-500/30">
                {getPlanName(currentPlan)}
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">لوحة التحكم الذكية</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">مرحباً بك يا <span className="text-white font-semibold">{username}</span>، إدارة إشارات التداول وتوجيهها</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              متصل بالخدمة
            </span>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              {username ? username.slice(0, 2).toUpperCase() : 'US'}
            </div>
            
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>🚪</span> خروج
            </button>
          </div>
        </div>

        {/* شبكة الإحصائيات والأداء */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#101726] border border-gray-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>
            <p className="text-gray-400 text-xs font-medium mb-1">الروابط المستخدمة / الحد الأقصى</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold tracking-tight">{webhookUrls.length} / {maxLimit === Infinity ? '∞' : maxLimit}</span>
              <span className="text-blue-400 text-xs font-semibold">روابط نشطة</span>
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

        {/* قسم إدارة وعرض روابط الويب هوك */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>🔗</span> روابط الاستقبال (Webhook URLs)
              </h2>
              <p className="text-gray-400 text-xs mt-1">انسخ الرابط واستخدمه في منصات التداول (مثل TradingView)</p>
            </div>
            
            <button 
              onClick={generateNewWebhook}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium px-4 py-2.5 rounded-xl transition text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>➕</span> توليد رابط جديد
            </button>
          </div>

          {limitError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
              {limitError}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              readOnly 
              value={activeWebhook} 
              className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3 text-gray-300 text-xs focus:outline-none"
            />
            <button 
              onClick={() => handleCopy(activeWebhook)}
              className={`font-medium px-6 py-3 rounded-xl transition text-xs whitespace-nowrap shadow-md flex items-center justify-center gap-1.5 ${
                copyStatus 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
              }`}
            >
              <span>{copyStatus ? '✓ تم النسخ!' : '📋 نسخ الرابط'}</span>
            </button>
          </div>

          {webhookUrls.length > 1 && (
            <div className="pt-3 border-t border-gray-800/80 space-y-2">
              <p className="text-xs text-gray-400 font-medium">سجل الروابط المולّدة (اضغط للتفعيل):</p>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {webhookUrls.map((url, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveWebhook(url)}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer flex justify-between items-center transition ${
                      activeWebhook === url 
                        ? 'bg-blue-600/10 border border-blue-500/40 text-blue-300 font-mono' 
                        : 'bg-[#07090e]/60 border border-gray-800/60 text-gray-400 hover:text-gray-200 font-mono'
                    }`}
                  >
                    <span className="truncate">{url}</span>
                    <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-300 ml-2 shrink-0">
                      {activeWebhook === url ? 'الرابط النشط' : 'تبديل'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* مركز ربط قنوات الإشعارات (تليجرام، واتساب، ديسكورد) */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-6">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>🚀</span> قنوات توجيه وإرسال الإشارات
            </h2>
            <p className="text-gray-400 text-xs mt-1">اختر المنصة التي تريد توجيه التنبيهات الفورية إليها تلقائياً فور استلام الإشارة</p>
          </div>

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

          {activeTab === 'telegram' && (
            <form onSubmit={(e) => handleSaveSettings(e, 'telegram')} className="space-y-4">
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

          {activeTab === 'whatsapp' && (
            <form onSubmit={(e) => handleSaveSettings(e, 'whatsapp')} className="space-y-4">
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

          {activeTab === 'discord' && (
            <form onSubmit={(e) => handleSaveSettings(e, 'discord')} className="space-y-4">
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

        {/* قسم سجل العمليات (Webhook Activity Logs) في الأسفل */}
        <div className="bg-[#101726] border border-gray-800/80 p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>📋</span> سجل العمليات والطلبات الواردة (Webhook Logs)
              </h2>
              <p className="text-gray-400 text-xs mt-1">متابعة حالة استلام الإشارات وتوجيهها للمنصات لحظياً</p>
            </div>
            {logs.length > 0 && (
              <button 
                onClick={clearLogs}
                className="text-gray-400 hover:text-red-400 text-xs transition border border-gray-800 hover:border-red-500/30 px-3 py-1.5 rounded-xl bg-[#07090e]"
              >
                مسح السجل
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="pb-3 font-medium">الوقت</th>
                  <th className="pb-3 font-medium">الرابط المستهدف</th>
                  <th className="pb-3 font-medium">المنصة</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 font-sans">
                      لا توجد سجلات حالية.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#07090e]/40 transition">
                      <td className="py-3 text-gray-400 whitespace-nowrap">{log.time}</td>
                      <td className="py-3 text-blue-400 max-w-[150px] truncate">{log.endpoint}</td>
                      <td className="py-3 text-gray-300 font-sans">{log.platform}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                          log.status === 'نجاح' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300 font-sans">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
