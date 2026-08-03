'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleStartFree = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* خلفية تفاعلية */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* الهيدر العلوي */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/20">
            <span className="text-xl">⚡</span>
          </div>
          <span className="font-bold text-lg tracking-tight">نظام ويب هوك الآلي</span>
        </div>
        <button
          onClick={handleStartFree}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition shadow-lg shadow-blue-600/25"
        >
          دخول لوحة التحكم 🚀
        </button>
      </header>

      {/* القسم الرئيسي (Hero Section) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 px-4 py-1.5 rounded-full text-blue-400 text-xs font-medium shadow-inner">
          <span>✨</span>
          <span>المنظومة الأقوى لإدارة وتوجيه إشارات الويب هوك وتنبيهات واتساب وتليجرام</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          اربط منصات التداول الخاصة بك <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            بقنوات التواصل اللحظية فوراً
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          نظام متكامل يتيح لك استقبال تنبيهات TradingView وغيرها، ومعالجتها بدقة وتوجيهها مباشرة إلى بوتات تيليجرام وديسكورد ورسائل واتساب الشخصية أو القنوات بكفاءة عالية.
        </p>

        {/* زر ابدأ مجاناً البارز */}
        <div className="pt-6">
          <button
            onClick={handleStartFree}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white px-10 py-4 rounded-2xl font-bold text-base transition shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5"
          >
            ابدأ مجاناً الآن 🚀
          </button>
        </div>
      </section>

      {/* قسم المنصات المدعومة بالشعارات الأصلية */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">المنصات المدعومة للربط بشكل كامل</h2>
          <p className="text-gray-400 text-xs sm:text-sm">قم بربط قنواتك ومنصاتك المفضلة بضغطة زر واحدة بكل سهولة ومرونة</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          
          {/* Telegram */}
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-sky-500/50 hover:bg-sky-500/10 transition group">
            <svg className="w-8 h-8 text-sky-400 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m5.26 6.78-1.92 9.06c-.14.65-.52.81-1.05.5l-2.91-2.14-1.4 1.35c-.16.16-.29.3-.59.3l.21-2.97 5.4-4.88c.23-.21-.05-.33-.35-.12l-6.67 4.2-2.88-.9c-.63-.2-.64-.63.13-.93l11.25-4.34c.52-.2 1.01.12.83.84z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-300">Telegram</span>
          </div>

          {/* WhatsApp */}
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-emerald-500/50 hover:bg-emerald-500/10 transition group">
            <svg className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-300">WhatsApp</span>
          </div>

          {/* Discord */}
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-indigo-500/50 hover:bg-indigo-500/10 transition group">
            <svg className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.011c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-300">Discord</span>
          </div>

          {/* Slack */}
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-purple-500/50 hover:bg-purple-500/10 transition group">
            <svg className="w-8 h-8 text-purple-400 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.52c0-1.393 1.127-2.52 2.52-2.52h2.52v2.52a2.528 2.528 0 0 1-2.52 2.52m0 1.26a2.528 2.528 0 0 1 2.52 2.52v2.52a2.528 2.528 0 1 1-5.04 0v-2.52a2.528 2.528 0 0 1 2.52-2.52m2.52-6.3a2.528 2.528 0 0 1-2.52-2.52C5.042 5.212 6.169 4.085 7.562 4.085h2.52v2.52a2.528 2.528 0 0 1-2.52 2.52m1.26 0a2.528 2.528 0 0 1 2.52-2.52h2.52v2.52a2.528 2.528 0 0 1-2.52 2.52h-2.52m6.3 3.78a2.528 2.528 0 0 1 2.52 2.52c0 1.393-1.127 2.52-2.52 2.52h-2.52v-2.52a2.528 2.528 0 0 1 2.52-2.52m0-1.26a2.528 2.528 0 0 1-2.52-2.52V7.605a2.528 2.528 0 1 1 5.04 0v2.52a2.528 2.528 0 0 1-2.52 2.52m-2.52 6.3a2.528 2.528 0 0 1 2.52 2.52c1.393 0 2.52-1.127 2.52-2.52v-2.52h-2.52a2.528 2.528 0 0 1-2.52 2.52m-1.26 0a2.528 2.528 0 0 1-2.52 2.52v-5.04a2.528 2.528 0 0 1 2.52-2.52h2.52v2.52a2.528 2.528 0 0 1-2.52 2.52z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-300">Slack</span>
          </div>

          {/* Microsoft Teams */}
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-blue-500/50 hover:bg-blue-500/10 transition group">
            <svg className="w-8 h-8 text-blue-400 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.625 8.25h-3.375V6.375a1.125 1.125 0 0 0-1.125-1.125h-6.75A1.125 1.125 0 0 0 8.25 6.375V8.25H4.875A1.125 1.125 0 0 0 3.75 9.375v8.25c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125v-8.25a1.125 1.125 0 0 0-1.125-1.125zM9.375 6.375h5.25V8.25h-5.25V6.375zm10.125 10.5H4.875v-7.5h15.75v7.5z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-300">Teams</span>
          </div>

          {/* Custom Webhook */}
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-amber-500/50 hover:bg-amber-500/10 transition group">
            <svg className="w-8 h-8 text-amber-400 group-hover:scale-110 transition duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span className="text-xs font-semibold text-gray-300">Custom Webhook</span>
          </div>

        </div>
      </section>

      {/* قسم شرح طريقة الاستخدام والربط (UI Previews) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/50">خطوات بسيطة وسريعة</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 mb-2">كيف تستخدم النظام وتربط إشاراتك؟</h2>
          <p className="text-gray-400 text-xs sm:text-sm">من خلال لوحة التحكم الخاصة بك، يمكنك تفعيل الربط الكامل في 3 خطوات عملية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* الخطوة الأولى */}
          <div className="bg-gray-900/40 border border-gray-800/80 p-6 rounded-2xl space-y-4 backdrop-blur flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">أنشئ مسار الويب هوك (Slug)</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                من لوحة التحكم، انقر على زر إنشاء مسار جديد لتوليد رابط ويب هوك فريد وخاص بك لاستقبال التنبيهات.
              </p>
            </div>
            {/* واجهة تجريبية مبسطة للوحة التحكم */}
            <div className="bg-black/50 border border-gray-800 p-3 rounded-xl font-mono text-[10px] text-gray-400">
              <div className="text-blue-400 mb-1 font-semibold">/api/v1/webhook/your-slug</div>
              <div className="text-emerald-400">Status: Active & Listening...</div>
            </div>
          </div>

          {/* الخطوة الثانية */}
          <div className="bg-gray-900/40 border border-gray-800/80 p-6 rounded-2xl space-y-4 backdrop-blur flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">اربط منصة التداول (TradingView)</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                انسخ رابط الويب هوك وضعه في إعدادات التنبيه (Alert) داخل منصة TradingView أو أي منصة تحليل أخرى.
              </p>
            </div>
            {/* واجهة تجريبية مبسطة للإعدادات */}
            <div className="bg-black/50 border border-gray-800 p-3 rounded-xl font-mono text-[10px] text-gray-400 space-y-1">
              <div className="text-gray-300">Alert Name: EURUSD Buy</div>
              <div className="text-indigo-400 truncate">Webhook URL: [Paste Link Here]</div>
            </div>
          </div>

          {/* الخطوة الثالثة */}
          <div className="bg-gray-900/40 border border-gray-800/80 p-6 rounded-2xl space-y-4 backdrop-blur flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">استقبل الإشارات لحظياً</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                بمجرد صدور التنبيه، سيقوم النظام بمعالجته وتوجيهه فوراً إلى قناتك على تليجرام أو رسالة واتساب الخاصة بك.
              </p>
            </div>
            {/* واجهة تجريبية مبسطة للإشعار */}
            <div className="bg-black/50 border border-gray-800 p-3 rounded-xl text-[10px] space-y-1">
              <div className="text-emerald-400 font-bold">🟢 إشارة تداول جديدة</div>
              <div className="text-gray-300">BUY EURUSD @ 1.0850</div>
            </div>
          </div>

        </div>
      </section>

      {/* التذييل */}
      <footer className="footer relative z-10 border-t border-gray-800/60 mt-20 py-8 text-center text-xs text-gray-500">
        <p>جميع الحقوق محفوظة © 2026 - نظام إدارة إشارات الويب هوك والقنوات المذكورة</p>
      </footer>

    </div>
  );
}

