'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    // تخزين اسم المستخدم وتوجيهه للوحة التحكم
    localStorage.setItem('signal_user', username.trim());
    
    // محاكاة انتقال سلس وتأخير بسيط لتجربة مستخدم أفضل
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* تأثيرات خلفية مضيئة عصرية */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 bg-[#101726]/90 backdrop-blur-xl border border-gray-800/80 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-2xl shadow-black/50 space-y-6">
        
        {/* أيقونة العنوان والشعار */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 mb-2">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">نظام إشارات الوهابيكس</h1>
          <p className="text-gray-400 text-xs">سجل الدخول لإدارة روابط الويب هوك وتوجيه التنبيهات الفورية</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
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
                <span>جاري فتح لوحة التحكم...</span>
              </>
            ) : (
              <span>دخول للوحة التحكم 🚀</span>
            )}
          </button>
        </form>

        {/* تذييل البطاقة */}
        <div className="text-center pt-2 border-t border-gray-800/60">
          <p className="text-[11px] text-gray-500">نظام آمن ومحمي لتوجيه إشارات التداول الفورية</p>
        </div>

      </div>
    </div>
  );
}
