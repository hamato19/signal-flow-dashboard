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
    // تخزين اسم المستخدم والباقة المختارة في التخزين المحلي
    localStorage.setItem('signal_user', username.trim());
    localStorage.setItem('signal_plan', selectedPlan);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
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
          <p className="text-gray-400 text-xs">جرب النظام مجاناً أو اختر باقة الاشتراك المناسبة لاحتياجات تداولك وسجل دخولك فوراً</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* قسم اختيار الباقات (أصبح يعرض 4 خيارات بشكل متناسق) */}
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
