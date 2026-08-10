'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Webhook, ArrowRight, ShieldCheck, Zap, Cpu, Terminal, MessageSquare, Send, Radio } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tradingview' | 'webhook' | 'alert'>('tradingview');

  const handleStartFree = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden" dir="rtl">
      
      {/* خلفية تفاعلية بصرية متقدمة (Webhooks Grid Network) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* الهيدر العلوي */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-800/60 backdrop-blur-xl">
        
        {/* الشعار المدمج */}
        <div onClick={handleStartFree} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30 group-hover:scale-105 transition duration-300">
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition duration-300" />
            <Webhook className="w-6 h-6 text-white relative z-10 drop-shadow" />
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              Hook<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Signal</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">إشارات فورية مدى الحياة</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleStartFree}
            className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={handleStartFree}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition shadow-lg shadow-blue-600/25 border border-blue-500/30 flex items-center gap-2 cursor-pointer"
          >
            <span>دخول لوحة التحكم</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </header>

      {/* القسم الرئيسي (Hero Section) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 px-4 py-1.5 rounded-full text-blue-400 text-xs font-medium shadow-inner backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span>المنظومة الأقوى لإدارة وتوجيه إشارات الويب هوك وتنبيهات واتساب وتليجرام</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
          اربط منصات التداول الخاصة بك <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            بقنوات التواصل اللحظية فوراً
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          نظام متكامل يتيح لك استقبال تنبيهات TradingView وغيرها، ومعالجتها بدقة وتوجيهها مباشرة إلى بوتات تيليجرام وديسكورد ورسائل واتساب الشخصية أو القنوات بكفاءة عالية.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartFree}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 border border-blue-400/20 cursor-pointer"
          >
            ابدأ مجاناً الآن 🚀
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-6 py-4 rounded-2xl font-semibold text-sm transition"
          >
            تعرف على آلية العمل ↓
          </a>
        </div>
      </section>

      {/* ========================================== */}
      {/* قسم طريقة العمل */}
      {/* ========================================== */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/40">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">كيف تعمل المنظومة؟</h2>
          <p className="text-slate-400 text-xs sm:text-sm">3 خطوات بسيطة ومصفوفة لربط تنبيهاتك واستلامها فوراً بدون تعقيد</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* المربع الأول */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur flex flex-col justify-between hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base mb-5 group-hover:scale-110 transition duration-300 shadow-inner">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-3">استقبال التنبيه (Webhook)</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                أنشئ رابط ويب هوك مخصص لك في ثوانٍ معدودة، وقم بربطه مباشرة مع منصات الرسوم البيانية مثل TradingView أو أي مصدر تداول آخر.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-blue-400 font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>اتصال فوري وآمن 100%</span>
            </div>
          </div>

          {/* المربع الثاني */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-base mb-5 group-hover:scale-110 transition duration-300 shadow-inner">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-3">المعالجة والتنسيق الذكي</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                يقوم النظام بتحليل البيانات الواردة تلقائياً وترتيبها بالشكل الاحترافي الذي تفضله لتكون واضحة وجاهزة للتوجيه السريع.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Cpu className="w-3.5 h-3.5" />
              <span>معالجة في جزء من الألف من الثانية</span>
            </div>
          </div>

          {/* المربع الثالث */}
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur flex flex-col justify-between hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base mb-5 group-hover:scale-110 transition duration-300 shadow-inner">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-3">التوجيه اللحظي للوجهة</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                توجيه الإشارة فوراً إلى تطبيقك المفضل (تليجرام، واتساب، ديسكورد، أو سلاك) لتصلك أينما كنت بدون أي تأخير زمني.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <Radio className="w-3.5 h-3.5" />
              <span>وصول لحظي ومستقر 24/7</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* محاكي النظام التفاعلي */}
      {/* ========================================== */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">معاينة حية لطريقة عمل الإشارات</h2>
          <p className="text-slate-400 text-xs sm:text-sm">شاهد كيف يتحول التنبيه الخام إلى رسالة منسقة واحترافية في وجهتك المفضلة</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-2xl shadow-blue-600/10 backdrop-blur-xl">
          {/* شريط علوي للمحاكي */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('tradingview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${activeTab === 'tradingview' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'}`}
              >
                1. مصدر التنبيه
              </button>
              <button 
                onClick={() => setActiveTab('webhook')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${activeTab === 'webhook' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'}`}
              >
                2. الويب هوك
              </button>
              <button 
                onClick={() => setActiveTab('alert')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${activeTab === 'alert' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'}`}
              >
                3. النتيجة (الوجهة)
              </button>
            </div>
          </div>

          {/* محتوى التبويبات التفاعلية */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 font-mono text-xs sm:text-sm min-h-[200px] flex items-center justify-center text-center">
            {activeTab === 'tradingview' && (
              <div className="space-y-3 text-right w-full">
                <span className="text-xs text-blue-400 font-sans font-semibold block mb-1">📌 إعداد التنبيه في TradingView (مثال):</span>
                <p className="text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div><span className="text-amber-400 font-bold">Alert Name:</span> BTCUSDT Breakout</div>
                  <div><span className="text-emerald-400 font-bold">Condition:</span> RSI Oversold & EMA Cross</div>
                  <div><span className="text-purple-400 font-bold">Action:</span> Send Webhook to HookSignal URL</div>
                </p>
              </div>
            )}

            {activeTab === 'webhook' && (
              <div className="space-y-3 text-left w-full" dir="ltr">
                <span className="text-xs text-indigo-400 font-sans font-semibold block mb-1 text-right">⚙️ حزمة البيانات المرسلة (JSON Payload):</span>
                <pre className="text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 overflow-x-auto text-left text-xs leading-relaxed">
{`{
  "symbol": "BTCUSDT",
  "price": "67,450.00",
  "signal": "STRONG_BUY",
  "time": "2026-08-10 05:00:00"
}`}
                </pre>
              </div>
            )}

            {activeTab === 'alert' && (
              <div className="space-y-3 text-right w-full bg-emerald-950/10 border border-emerald-500/30 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-2 font-sans font-medium">
                  <span>✨ شكل الإشارة فور وصولها إلى تيليجرام / واتساب:</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> الآن</span>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 text-slate-200 text-right space-y-1.5 text-xs">
                  <p className="font-bold text-emerald-400 text-sm">🚨 تنبيه تداول جديد [BTCUSDT]</p>
                  <p>🟢 نوع الإشارة: <span className="text-white font-bold">شراء قوي (BUY)</span></p>
                  <p>💰 السعر الحالي: <span className="text-cyan-400 font-bold">67,450.00$</span></p>
                  <p className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800">تم الإرسال عبر نظام HookSignal اللحظي ⚡</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* قسم المنصات المدعومة */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">المنصات المدعومة للربط بشكل كامل</h2>
          <p className="text-slate-400 text-xs sm:text-sm">قم بربط قنواتك ومنصاتك المفضلة بضغطة زر واحدة بكل سهولة ومرونة</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-sky-500/50 hover:bg-sky-500/10 transition group">
            <Send className="w-8 h-8 text-sky-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-semibold text-slate-300">Telegram</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-emerald-500/50 hover:bg-emerald-500/10 transition group">
            <MessageSquare className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-semibold text-slate-300">WhatsApp</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-indigo-500/50 hover:bg-indigo-500/10 transition group">
            <Webhook className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-semibold text-slate-300">Discord</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-purple-500/50 hover:bg-purple-500/10 transition group">
            <Terminal className="w-8 h-8 text-purple-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-semibold text-slate-300">Slack</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-blue-500/50 hover:bg-blue-500/10 transition group">
            <Cpu className="w-8 h-8 text-blue-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-semibold text-slate-300">Teams</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-amber-500/50 hover:bg-amber-500/10 transition group">
            <Zap className="w-8 h-8 text-amber-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-semibold text-slate-300">Custom Webhook</span>
          </div>
        </div>
      </section>

      {/* التذييل */}
      <footer className="relative z-10 border-t border-slate-800/60 mt-20 py-8 text-center text-xs text-slate-500">
        <p>جميع الحقوق محفوظة © 2026 - نظام إدارة إشارات الويب هوك والقنوات المذكورة</p>
      </footer>

      {/* ========================================== */}
      {/* أزرار التواصل العائمة (WhatsApp & Telegram) */}
      {/* ========================================== */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 items-end">
        
        {isChatOpen && (
          <div className="flex flex-col gap-2.5 mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            
            {/* زر واتساب */}
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-600/30 text-xs font-semibold transition group cursor-pointer"
            >
              <span>تواصل عبر واتساب</span>
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
            </a>

            {/* زر تليجرام */}
            <a
              href="https://t.me/YourUsername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-full shadow-lg shadow-sky-600/30 text-xs font-semibold transition group cursor-pointer"
            >
              <span>محادثة تليجرام</span>
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
            </a>
          </div>
        )}

        {/* الزر الرئيسي العائم */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 border border-white/20 transition-all duration-300 hover:scale-110 relative group cursor-pointer"
          title="الدعم الفني السريع"
        >
          <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-25 pointer-events-none" />

          {isChatOpen ? (
            <span className="font-bold text-lg">✕</span>
          ) : (
            <MessageSquare className="w-6 h-6 text-white" />
          )}
        </button>

      </div>

    </div>
  );
}
