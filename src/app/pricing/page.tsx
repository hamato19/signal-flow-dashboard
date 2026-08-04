"use client";

import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Shield, Zap, ArrowRight, Webhook } from 'lucide-react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // يمكنك ربطها ببوابة دفع مثل Stripe, MyFatoorah, أو Tap هنا
    setTimeout(() => {
      alert("تم توجيهك إلى صفحة الدفع الآمن بنجاح!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="text-center max-w-2xl mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> عرض لفترة محدودة
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">استمتع بكافة قنوات الربط بلا حدود</h1>
        <p className="text-slate-400 text-sm">ادفع لمرة واحدة فقط، واحصل على صلاحية دائمة ومفتوحة لكل قنوات الإشعارات والتنبيهات المتقدمة.</p>
      </div>

      {/* Pricing Card */}
      <div className="w-full max-w-md bg-slate-900 border border-blue-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-2xl text-blue-400">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold bg-blue-500 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-500/30">مدى الحياة</span>
        </div>

        <h3 className="text-xl font-bold text-slate-100">باقة Pro الشاملة</h3>
        <p className="text-xs text-slate-400 mt-1">وصول كامل لجميع الخدمات بدون اشتراكات شهرية متكررة.</p>

        <div className="my-8 flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-100">$99</span>
          <span className="text-xs text-slate-400">/ دفعة واحدة فقط (مدى الحياة)</span>
        </div>

        <div className="space-y-3 mb-8 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>قنوات ربط غير محدودة (Discord, WhatsApp, Slack, Teams)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>قواعد توجيه البيانات الذكية (Routing Rules)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>سجل المعاملات الحي والطلبات المتقدمة</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تحديثات مستقبلية مجانية مدى الحياة</span>
          </div>
        </div>

        <button 
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? 'جاري التحويل...' : 'فتح كافة الخدمات الآن'}
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>عملية دفع آمنة ومشفرة بالكامل</span>
        </div>
      </div>

    </div>
  );
}
