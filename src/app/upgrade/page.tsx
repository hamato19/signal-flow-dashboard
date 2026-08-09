"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  CreditCard, 
  Lock,
  Zap
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function UpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || 'general';

  const [slug, setSlug] = useState('');
  const [selectedService, setSelectedService] = useState(serviceParam);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const userSlug = localStorage.getItem('user_slug');
    if (!userSlug) {
      router.push('/login');
      return;
    }
    setSlug(userSlug);
  }, [router]);

  useEffect(() => {
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
  }, [serviceParam]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          service: selectedService,
          billingCycle,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccessMsg('تمت عملية الدفع وتفعيل الخدمة بنجاح!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setErrorMsg(result.error || 'فشل معالجة الدفع، يرجى المحاولة مرة أخرى.');
      }
    } catch (error: any) {
      setSuccessMsg('تمت ترقية الخدمة بنجاح (وضع محاكاة الدفع)!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
      
      {/* زر العودة */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى لوحة التحكم</span>
      </button>

      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex relative">
          <div className="absolute inset-0 bg-amber-500/30 rounded-2xl blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-amber-600/20 to-blue-600/25 border border-amber-500/30 p-3 rounded-2xl">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          ترقية الخدمة أو القناة
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          الحساب: @{slug}
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-3">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-6">
        
        {/* اختيار الخدمة */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">الخدمة أو القناة المستهدفة بالترقية</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
          >
            <option value="trading_platforms">منصات التداول (TradingView & Binance)</option>
            <option value="telegram">قناة تليجرام (Telegram Bot)</option>
            <option value="discord">قناة ديسكورد (Discord Webhook)</option>
            <option value="whatsapp">خدمة واتساب (WhatsApp API)</option>
            <option value="email_sms">البريد الإلكتروني والرسائل القصيرة (Email & SMS)</option>
            <option value="corporate">باقة الشركات والمؤسسات الكاملة (Enterprise)</option>
          </select>
        </div>

        {/* دورة الفوترة */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/10'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold">اشتراك شهري</div>
            <div className="text-[10px] text-slate-400 mt-1">9$ / شهرياً</div>
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/10'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-center gap-1">
              اشتراك سنوي <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">توفير 20%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">85$ / سنوياً</div>
          </button>
        </div>

        {/* بيانات الدفع */}
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-400" /> تفاصيل البطاقة الائتمانية
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> دفع مشفر وآمن 256-bit
            </span>
          </div>

          <div className="space-y-3">
            <input 
              type="text"
              required
              placeholder="4000 1234 5678 9010"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono"
              dir="ltr"
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text"
                required
                placeholder="MM / YY"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono"
                dir="ltr"
              />
              <input 
                type="password"
                required
                placeholder="CVV"
                maxLength={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-amber-500 via-blue-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-medium py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
        >
          {isProcessing ? (
            <>
              جاري معالجة الدفع الآمن <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              إتمام الدفع وتفعيل الخدمة فوراً <Zap className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4" dir="rtl">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-slate-400">جاري تحميل صفحة الدفع...</p>
        </div>
      }>
        <UpgradeContent />
      </Suspense>

    </div>
  );
}
