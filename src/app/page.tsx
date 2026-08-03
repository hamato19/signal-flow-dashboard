'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('100');
  const [slugInput, setSlugInput] = useState('');

  const plans = [
    { id: 'free', name: 'الباقة المجانية', channels: 'قناة واحدة مجاناً', price: '0 ر.س', color: 'border-gray-700/60 bg-gray-900/40' },
    { id: '30', name: 'الباقة المرنة', channels: 'حتى 5 قنوات', price: '30 ر.س', color: 'border-blue-500/50 bg-blue-600/10' },
    { id: '100', name: 'باقة المحترفين', channels: 'حتى 10 قنوات (واتساب وتليجرام)', price: '100 ر.س', color: 'border-emerald-500/50 bg-emerald-600/10', popular: true },
    { id: 'unlimited', name: 'الباقة المفتوحة', channels: 'حتى 20 قناة مختلفة', price: '250 ر.س', color: 'border-purple-500/50 bg-purple-600/10' },
  ];

  const features = [
    { icon: '⚡', title: 'إرسال فوري ولحظي', desc: 'استقبال وتوجيه إشارات التداول والويب هوك في أجزاء من الثانية دون تأخير.' },
    { icon: '💬', title: 'تعدد القنوات (واتساب وتليجرام)', desc: 'ربط متزامن مع تيليجرام، ديسكورد، وواتساب بروابط مخصصة لكل مستخدم.' },
    { icon: '🛡️', title: 'استقلالية وأمان تام', desc: 'كل مستخدم يمتلك معرف (Slug) ورابط ويب هوك خاص به مع حماية كاملة من التعارض.' },
    { icon: '📊', title: 'لوحة تحكم مرنة', desc: 'إدارة وتعديل إعدادات البوتات وحفظها مباشرة في قاعدة بيانات سحابية مستقرة.' }
  ];

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slugInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanSlug) return;
    
    // حفظ الـ Slug والباقة المختارة مؤقتاً والانتقال للوحة التحكم
    localStorage.setItem('user_slug', cleanSlug);
    localStorage.setItem('user_plan', selectedPlan);
    router.push('/dashboard'); // أو مسار صفحة اللوحة لديك
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-blue-600 selection:text-white">
      
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
          onClick={() => {
            const el = document.getElementById('login-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition shadow-lg shadow-blue-600/25"
        >
          دخول لوحة التحكم 🚀
        </button>
      </header>

      {/* القسم الرئيسي (Hero Section) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
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
      </section>

      {/* مميزات النظام */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">لماذا تختار نظامنا؟</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">مميزات هندسية صُممت لتناسب المتداولين والمطورين المحترفين</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-gray-900/50 border border-gray-800/80 p-6 rounded-2xl backdrop-blur space-y-3 hover:border-gray-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-xl">
                {feat.icon}
              </div>
              <h3 className="font-semibold text-sm text-white">{feat.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* قسم الباقات والدخول */}
      <section id="login-section" className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">اختر باقتك وابدأ بمعرفك الخاص (Slug)</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">باقات مرنة تدعم ربط قنوات متعددة من واتساب وتليجرام</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`cursor-pointer border rounded-2xl p-5 transition relative flex flex-col justify-between ${
                selectedPlan === plan.id 
                  ? `${plan.color} ring-2 ring-blue-500 shadow-xl shadow-blue-500/10` 
                  : 'border-gray-800/80 bg-gray-900/30 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold px-3 py-0.5 rounded-full text-white shadow">
                  الأكثر طلباً
                </span>
              )}
              <div>
                <h3 className="text-xs font-semibold text-gray-300 mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold text-white mb-2">{plan.price}</p>
              </div>
              <div className="border-t border-gray-800/80 pt-3 mt-3">
                <span className="text-xs text-blue-400 font-medium block">{plan.channels}</span>
              </div>
            </div>
          ))}
        </div>

        {/* نموذج إدخال المعرف والانتقال للوحة التحكم */}
        <div className="max-w-md mx-auto bg-gray-900/80 border border-gray-800 p-6 rounded-2xl shadow-2xl backdrop-blur">
          <form onSubmit={handleQuickLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">أدخل اسم المستخدم (Slug) المفضل:</label>
              <input 
                type="text" 
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="مثال: my-trading-bot"
                required
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white py-3.5 rounded-xl font-medium transition shadow-lg shadow-blue-600/30 text-sm"
            >
              انتقل إلى لوحة التحكم 🚀
            </button>
          </form>
        </div>
      </section>

      {/* التذييل */}
      <footer className="relative z-10 border-t border-gray-800/60 mt-16 py-8 text-center text-xs text-gray-500">
        <p>جميع الحقوق محفوظة © 2026 - نظام إدارة إشارات الويب هوك والقنوات المذكورة</p>
      </footer>

    </div>
  );
}
