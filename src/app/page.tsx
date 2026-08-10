'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Webhook, ArrowRight, ShieldCheck, Zap, Cpu, Terminal, MessageSquare, Send, Radio, CheckCircle2, Activity, Globe, Lock, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tradingview' | 'webhook' | 'alert'>('tradingview');

  const handleStartFree = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden" dir="rtl">
      
      {/* خلفية تفاعلية بصرية متقدمة بنظام الشبكة المتوهجة */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0d_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0d_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* الهيدر العلوي */}
      <header className="sticky top-0 z-50 max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-800/60 bg-[#07090e]/80 backdrop-blur-xl">
        
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
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">المنظومة الذكية لإدارة الويب هوك</span>
          </div>
        </div>

        {/* الروابط الوسطى */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition">المميزات</a>
          <a href="#how-it-works" className="hover:text-blue-400 transition">آلية العمل</a>
          <a href="#demo" className="hover:text-blue-400 transition">المحاكي</a>
          <a href="#cta-section" className="hover:text-blue-400 transition">البدء الفوري</a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/login')}
            className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={handleStartFree}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition shadow-lg shadow-blue-600/25 border border-blue-500/30 flex items-center gap-2 cursor-pointer"
          >
            <span>لوحة التحكم</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </header>

      {/* القسم الرئيسي (Hero Section) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 bg-blue-950/60 border border-blue-800/50 px-4 py-1.5 rounded-full text-blue-400 text-xs font-medium shadow-inner backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>المعيار الجديد لمعالجة وتوجيه إشارات التداول والويب هوك اللحظية</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
          حوّل تنبيهات منصاتك المالية إلى <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            إجراءات فورية عبر قنواتك
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          اربط منصات الرسوم البيانية مثل TradingView بأحدث قنوات واتساب، تليجرام، وديسكورد عبر بوابات ويب هوك عالية الأداء، مؤمنة بالكامل، وبزمن استجابة يقدر بجزء من الألف من الثانية.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartFree}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 border border-blue-400/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>ابدأ مجاناً الآن</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-6 py-4 rounded-2xl font-semibold text-sm transition text-center"
          >
            اكتشف البنية التحتية
          </a>
        </div>

        {/* مؤشرات حية للإحصائيات */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/60 mt-12">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-1">99.99%</div>
            <div className="text-xs text-slate-400">معدل الاستقرار (Uptime)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mb-1">&lt; 15ms</div>
            <div className="text-xs text-slate-400">سرعة المعالجة والإرسال</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1">10M+</div>
            <div className="text-xs text-slate-400">إشارة مُعالجة بنجاح</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 backdrop-blur">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">24/7</div>
            <div className="text-xs text-slate-400">مراقبة وتأمين مستمر</div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* قسم الميزات بنظام Bento Grid الحديث */}
      {/* ========================================== */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/40">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">لماذا يختار المحترفون HookSignal؟</h2>
          <p className="text-slate-400 text-xs sm:text-sm">مصمم خصيصاً ليتناسب مع احتياجات المطورين والمتداولين الذين لا يقبلون بأقل من الكمال</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ميزة 1: السرعة الفائقة */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 p-8 rounded-3xl backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/25 transition duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">معالجة لحظية بدون أي تأخير زمني</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                بنية تحتية موزعة عالمياً تضمن استقبال وتنفيذ وتوجيه إشارات الويب هوك فور صدورها من المنصات المصدرية لتصلك في أجزاء من الثانية.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-blue-400 font-semibold relative z-10">
              <Activity className="w-4 h-4" />
              <span>أداء فائق الاستقرار في أوقات الذروة</span>
            </div>
          </div>

          {/* ميزة 2: الأمان العالي */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 p-8 rounded-3xl backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">تشفير وأمان مطلق</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                حماية كاملة للروابط والبيانات المنقولة عبر شهادات SSL متقدمة وأنظمة مصادقة صارمة تمنع أي وصول غير مرغوب فيه.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-indigo-400 font-semibold">
              <Lock className="w-4 h-4" />
              <span>بياناتك محمية بالكامل</span>
            </div>
          </div>

          {/* ميزة 3: التوافقية الواسعة */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 p-8 rounded-3xl backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-inner">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ربط شامل متعدد المنصات</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                تكامل تام مع تليجرام، واتساب، ديسكورد، سلاك، وباقي خدمات الويب هوك المخصصة بنقرة زر واحدة.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-cyan-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>جاهز للربط الفوري</span>
            </div>
          </div>

          {/* ميزة 4: التنسيق الذكي */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 p-8 rounded-3xl backdrop-blur flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/25 transition duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">محرك قوالب وقواعد مخصص</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                تحكم كامل في صياغة شكل الرسائل المستقبلية باستخدام متغيرات مخصصة تضمن عرض المعلومات بشكل احترافي ومنسق حسب رغبتك.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-purple-400 font-semibold relative z-10">
              <Cpu className="w-4 h-4" />
              <span>مرونة عالية في التخصيص</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* قسم طريقة العمل */}
      {/* ========================================== */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/40">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">آلية العمل بثلاث خطوات بسيطة</h2>
          <p className="text-slate-400 text-xs sm:text-sm">ابدأ بإرسال أول تنبيه ناجح خلال أقل من دقيقتين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur flex flex-col justify-between hover:border-blue-500/50 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base mb-5 shadow-inner">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-3">إنشاء رابط Webhook</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                قم بتوليد رابط ويب هوك فريد من لوحة التحكم الخاصة بك واستخدمه مباشرة في تنبيهات TradingView أو منصتك.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur flex flex-col justify-between hover:border-indigo-500/50 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-base mb-5 shadow-inner">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-3">المعالجة الفورية</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                يتلقى النظام حزمة البيانات، ويقوم بتحليلها وتنسيقها تلقائياً بالصيغة المطلوبة وتمريرها نحو الوجهة المحددة.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur flex flex-col justify-between hover:border-cyan-500/50 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base mb-5 shadow-inner">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-3">الاستلام على قناتك</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                تصلك الرسالة منسقة وجاهزة على بوت تيليجرام أو رسائل واتساب الشخصية أو مجموعتك المفضلة بدون تأخير.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* محاكي النظام التفاعلي */}
      {/* ========================================== */}
      <section id="demo" className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">المحاكي المباشر لتدفق الإشارات</h2>
          <p className="text-slate-400 text-xs sm:text-sm">شاهد بالتفصيل رحلة تحول الإشارة من المنصة المصدرية حتى وصولها لرسائل واتساب وتليجرام</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-2xl shadow-blue-600/10 backdrop-blur-xl">
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
                1. المصدر
              </button>
              <button 
                onClick={() => setActiveTab('webhook')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${activeTab === 'webhook' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'}`}
              >
                2. المعالجة
              </button>
              <button 
                onClick={() => setActiveTab('alert')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${activeTab === 'alert' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800'}`}
              >
                3. المستقبل
              </button>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 font-mono text-xs sm:text-sm min-h-[200px] flex items-center justify-center text-center">
            {activeTab === 'tradingview' && (
              <div className="space-y-3 text-right w-full">
                <span className="text-xs text-blue-400 font-sans font-semibold block mb-1">📌 إعداد التنبيه في TradingView:</span>
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
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-slate-800/40">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">تكامل تام مع أهم التطبيقات والمنصات</h2>
          <p className="text-slate-400 text-xs sm:text-sm">ربط مرن يتيح لك توجيه رسائلك لأي وجهة تفضلها بكل سهولة</p>
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
            <span className="text-xs font-semibold text-slate-300">Custom API</span>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* قسم ابدأ الآن مجاناً (Call to Action البديل) */}
      {/* ========================================== */}
      <section id="cta-section" className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-slate-800/40 text-center">
        <div className="bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-slate-950 border border-blue-500/30 p-10 sm:p-14 rounded-3xl backdrop-blur-xl shadow-2xl shadow-blue-600/20 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1 rounded-full text-blue-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>انضم إلى آلاف المتداولين والمطورين الناجحين</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              جاهز لتجربة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">السرعة المطلقة</span> في إدارة تنبيهاتك؟
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              لا تكاليف خفية، لا بطاقة ائتمانية مطلوبة. أنشئ حسابك المجاني الآن وابدأ بتوجيه أول إشارة تداول أو ويب هوك خلال أقل من دقيقتين.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStartFree}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 border border-blue-400/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ابدأ مجاناً الآن 🚀</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> إعداد فوري بدون تعقيد</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> دعم فني مباشر متواجد دائماً</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> مجاني تماماً للبدء</span>
            </div>
          </div>

        </div>
      </section>

      {/* التذييل */}
      <footer className="relative z-10 border-t border-slate-800/60 mt-20 py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>جميع الحقوق محفوظة © 2026 - نظام HookSignal لإدارة الويب هوك والإشارات اللحظية</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition">شروط الاستخدام</a>
            <a href="#" className="hover:text-white transition">الدعم الفني</a>
          </div>
        </div>
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
