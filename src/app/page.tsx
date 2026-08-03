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
          <span className="font-bold text-lg tracking-tight">نظام إشارات التداول الآلي</span>
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

      {/* قسم المنصات المدعومة (أيقونات متجاورة) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">المنصات المدعومة للربط بشكل كامل</h2>
          <p className="text-gray-400 text-xs sm:text-sm">قم بربط قنواتك ومنصاتك المفضلة بضغطة زر واحدة بكل سهولة ومرونة</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          
          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-blue-500/50 hover:bg-blue-600/10 transition group">
            <span className="text-3xl group-hover:scale-110 transition duration-300">📢</span>
            <span className="text-xs font-semibold text-gray-300">Telegram</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-green-500/50 hover:bg-green-600/10 transition group">
            <span className="text-3xl group-hover:scale-110 transition duration-300">💬</span>
            <span className="text-xs font-semibold text-gray-300">WhatsApp</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-indigo-500/50 hover:bg-indigo-600/10 transition group">
            <span className="text-3xl group-hover:scale-110 transition duration-300">🤖</span>
            <span className="text-xs font-semibold text-gray-300">Discord</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-purple-500/50 hover:bg-purple-600/10 transition group">
            <span className="text-3xl group-hover:scale-110 transition duration-300">💼</span>
            <span className="text-xs font-semibold text-gray-300">Slack</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-blue-600/50 hover:bg-blue-700/10 transition group">
            <span className="text-3xl group-hover:scale-110 transition duration-300">👥</span>
            <span className="text-xs font-semibold text-gray-300">Teams</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 backdrop-blur hover:border-amber-500/50 hover:bg-amber-600/10 transition group">
            <span className="text-3xl group-hover:scale-110 transition duration-300">⚡</span>
            <span className="text-xs font-semibold text-gray-300">Custom Webhook</span>
          </div>

        </div>
      </section>

      {/* التذييل */}
      <footer className="relative z-10 border-t border-gray-800/60 mt-20 py-8 text-center text-xs text-gray-500">
        <p>جميع الحقوق محفوظة © 2026 - نظام إدارة إشارات الويب هوك والقنوات المذكورة</p>
      </footer>

    </div>
  );
}
