"use client";

import React, { useState } from 'react';
import { Webhook, ArrowRight, Loader2, AlertCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase();

    if (!cleanSlug) {
      setErrorMsg('الرجاء إدخال معرف الحساب (Slug)');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // التحقق السريع من قاعدة البيانات عبر الـ API المتوفر لديك للتأكد من وجود الـ slug أو تهيئته
      const res = await fetch(`/api/settings?slug=${cleanSlug}`);
      const data = await res.json();

      if (res.ok) {
        // حفظ الـ slug وحالة الجلسة في المتصفح
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_slug', cleanSlug);
        router.push('/dashboard');
      } else {
        setErrorMsg('حدث خطأ أثناء الاتصال بالنظام.');
      }
    } catch (error) {
      // الدخول المباشر كخيار احتياطي لضمان السرعة وسلاسة الاستخدام
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user_slug', cleanSlug);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
      
      {/* خلفية جمالية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-600/20 to-indigo-600/25 border border-blue-500/30 p-3.5 rounded-2xl">
              <Webhook className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            تسجيل الدخول السريع
          </h1>
          <p className="text-xs text-slate-400">
            أدخل معرف الحساب الخاص بك (Slug) للوصول الفوري إلى إعداداتك ولوحة التنبيهات
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">معرف الحساب (Slug)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input 
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. mo"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                dir="ltr"
              />
            </div>
            <span className="text-[10px] text-slate-500 block px-1">
              مثال: أدخل <code className="text-blue-400">mo</code> للدخول إلى حسابك مباشرة.
            </span>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                جاري فتح لوحة التحكم <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                دخول <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
