'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free'); // الباقة التجريبية الافتراضية
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // تفاصيل الباقات المتاحة بما فيها الباقة المجانية
  const plans = [
    { id: 'free', name: 'الباقة التجريبية', links: '5 روابط مجاناً', price: '0 ر.س', color: 'border-gray-600/50 bg-gray-800/20' },
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

  // دالة موحدة للتعامل مع تسجيل الدخول عبر منصات الطرف الثالث (Google, Apple, GitHub)
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    localStorage.setItem('signal_user', `${provider}_user`);
    localStorage.setItem('signal_plan', selectedPlan);
    
    // محاكاة الاتصال بالمصادقة ثم التوجيه للوحة التحكم
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans py-10">
      
      {/* تأثيرات خلفية مضيئة عصرية */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 bg-[#101726]/90 backdrop-blur-xl border border-gray-800/80 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl shadow-black/50 space-y-6">
        
        {/* أيقونة العنوان والشعار */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 mb-1">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">نظام إشارات الوهابيكس</h1>
          <p className="text-gray-400 text-xs">جرب النظام مجاناً أو اختر باقة الاشتراك المناسبة وسجل دخولك فوراً</p>
        </div>

        {/* أسرع خيارات تسجيل الدخول عبر المنصات الاجتماعية */}
        <div className="space-y-3">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-[11px]">التسجيل السريع عبر المنصات</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* زر Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-[#07090e] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 py-2.5 px-4 rounded-xl text-xs font-medium transition active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.4l4.09-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* زر Apple */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-[#07090e] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 py-2.5 px-4 rounded-xl text-xs font-medium transition active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.95 5.74c.57-.69 1.02-1.65.91-2.61-.91.04-2.01.61-2.66 1.3-.53.56-.99 1.54-.86 2.48 1.02.08 2.04-.51 2.61-1.17z"/>
              </svg>
              <span>Apple</span>
            </button>

            {/* زر GitHub */}
            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-[#07090e] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 py-2.5 px-4 rounded-xl text-xs font-medium transition active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[11px]">أو الدخول التقليدي</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* قسم اختيار الباقات */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-gray-300">اختر باقة الاشتراك:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`cursor-pointer border rounded-2xl p-3.5 transition relative flex flex-col justify-between ${
                    selectedPlan === plan.id 
                      ? `${plan.color} ring-2 ring-blue-500 shadow-lg shadow-blue-500/10` 
                      : 'border-gray-800 bg-[#07090e]/60 hover:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow whitespace-nowrap">
                      الأكثر طلباً
                    </span>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-300 mb-1">{plan.name}</h3>
                    <p className="text-base font-bold text-white mb-2">{plan.price}</p>
                  </div>
                  <div className="border-t border-gray-800/80 pt-2 mt-2">
                    <span className="text-[11px] text-gray-400 block">{plan.links}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* حقل اسم المستخدم */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">اسم المستخدم أو المعرف</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 text-sm">👤</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: fahad"
                className="w-full bg-[#07090e] border border-gray-800 rounded-xl px-4 py-3.5 pr-11 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 active:scale-[0.99] text-white font-medium py-3.5 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
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

        {/* تذييل البطاقة */}
        <div className="text-center pt-2 border-t border-gray-800/60">
          <p className="text-[11px] text-gray-500">تمتع بمرونة التوليد الفوري ومراقبة الروابط بكل سهولة وأمان</p>
        </div>

      </div>
    </div>
  );
}

