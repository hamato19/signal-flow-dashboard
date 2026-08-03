'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const plans = [
    { id: 'free', name: 'الباقة التجريبية', links: '5 روابط مجاناً', price: '0 ر.س', color: 'border-gray-700/60 bg-gray-900/40' },
    { id: '30', name: 'الباقة المرنة', links: '30 رابط / شهرياً', price: '30 ر.س', color: 'border-blue-500/50 bg-blue-600/10' },
    { id: '100', name: 'باقة المحترفين', links: '100 رابط / شهرياً', price: '100 ر.س', color: 'border-emerald-500/50 bg-emerald-600/10', popular: true },
    { id: 'unlimited', name: 'الباقة المفتوحة', links: 'روابط غير محدودة', price: '250 ر.س', color: 'border-purple-500/50 bg-purple-600/10' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    localStorage.setItem('signal_user', username.trim());
    localStorage.setItem('signal_plan', selectedPlan);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  // تسجيل الدخول السريع عبر Google (محاكاة سلسة بدون Supabase)
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    localStorage.setItem('signal_plan', selectedPlan);

    setTimeout(() => {
      localStorage.setItem('signal_user', 'مستخدم جوجل');
      router.push('/dashboard');
    }, 600);
  };

  // الدخول السريع الفوري للزوار
  const handleQuickAccess = () => {
    setIsLoading(true);
    localStorage.setItem('signal_user', 'زائر سريع');
    localStorage.setItem('signal_plan', selectedPlan);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans py-8">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      <div className="relative z-10 bg-[#0b101d]/95 backdrop-blur-2xl border border-gray-800/90 p-5 sm:p-8 rounded-[2rem] w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 mb-1 border border-blue-400/20">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">نظام إشارات الوهابيكس</h1>
          <p className="text-gray-400 text-xs">جرب النظام مجاناً أو اختر باقة الاشتراك المناسبة وسجل دخولك فوراً</p>
        </div>

        <div className="space-y-3">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-800/80"></div>
            <span className="flex-shrink mx-3 text-gray-500 text-[11px]">طرق الدخول السريع</span>
            <div className="flex-grow border-t border-gray-800/80"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-[#131b2e] border border-gray-800 hover:border-blue-500/50 hover:bg-[#1a243d] py-3 px-4 rounded-xl text-xs font-medium transition active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.4l4.09-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>متابعة باستخدام Google</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAccess}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-[#131b2e] border border-gray-800 hover:border-indigo-500/50 hover:bg-[#1a243d] py-3 px-4 rounded-xl text-xs font-medium transition active:scale-[0.98] disabled:opacity-50 shadow-sm text-indigo-300"
            >
              <span>⚡</span>
              <span>دخول سريع كزائر (تجربة فورية)</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-800/80"></div>
          <span className="flex-shrink mx-3 text-gray-500 text-[11px]">أو الدخول بمعرف المستخدم</span>
          <div className="flex-grow border-t border-gray-800/80"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-2.5">
            <label className="block text-xs font-medium text-gray-300">اختر باقة الاشتراك:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`cursor-pointer border rounded-2xl p-3 transition relative flex flex-col justify-between ${
                    selectedPlan === plan.id 
                      ? `${plan.color} ring-2 ring-blue-500 shadow-md shadow-blue-500/15` 
                      : 'border-gray-800/80 bg-[#131b2e]/50 hover:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow whitespace-nowrap">
                      الأكثر طلباً
                    </span>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-300 mb-1">{plan.name}</h3>
                    <p className="text-sm sm:text-base font-bold text-white mb-1.5">{plan.price}</p>
                  </div>
                  <div className="border-t border-gray-800/60 pt-1.5 mt-1">
                    <span className="text-[10px] text-gray-400 block">{plan.links}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">اسم المستخدم أو المعرف</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 text-sm">👤</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: fahad"
                className="w-full bg-[#131b2e] border border-gray-800 rounded-xl px-4 py-3.5 pr-11 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 active:scale-[0.99] text-white font-medium py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>جاري إعداد الحساب وفتح اللوحة...</span>
              </>
            ) : (
              <span>دخول للوحة التحكم 🚀</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-800/60">
          <p className="text-[11px] text-gray-500">تمتع بمرونة التوليد الفوري ومراقبة الروابط بكل سهولة وأمان</p>
        </div>

      </div>
    </div>
  );
}
