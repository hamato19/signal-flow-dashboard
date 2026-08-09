"use client";

import React,مع, { useState } from 'react';
import { Webhook, Lock, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // استبدل هذا الرابط برابط الـ API الفعلي الخاص بتسجيل الدخول في السيرفر لديك
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ رمز الجلسة أو الـ Token في localStorage
        localStorage.setItem('token', data.token || 'active_session');
        localStorage.setItem('user_slug', data.slug || 'mo');
        
        // التوجيه المباشر إلى لوحة التحكم
        router.push('/dashboard');
      } else {
        setErrorMsg(data.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      // في حال تجربة الواجهة محلياً بدون سيرفر حقيقي، يمكنك تفعيل التوجيه التجريبي المباشر:
      // router.push('/dashboard');
      setErrorMsg('حدث خطأ في الاتصال بالخادم. تأكد من تشغيل السيرفر.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
      
      {/* خلفية جمالية مضيئة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        {/* الهيدر والشعار */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-600/20 to-indigo-600/25 border border-blue-500/30 p-3.5 rounded-2xl">
              <Webhook className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            تسجيل الدخول إلى Hook Signal
          </h1>
          <p className="text-xs text-slate-400">
            أدخل بيانات حسابك للوصول إلى لوحة التحكم وإدارة التنبيهات
          </p>
        </div>

        {/* رسالة الخطأ إن وجدت */}
        {errorMsg && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* نموذج الإدخال */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">كلمة المرور</label>
              <a href="#forgot" className="text-[11px] text-blue-400 hover:underline">نسيت كلمة المرور؟</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                dir="ltr"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                جاري التحقق <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                تسجيل الدخول <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/60 pt-6">
          <p className="text-xs text-slate-500">
            ليس لديك حساب بعد؟{' '}
            <a href="/register" className="text-blue-400 font-medium hover:underline">إنشاء حساب جديد</a>
          </p>
        </div>

      </div>
    </div>
  );
}
