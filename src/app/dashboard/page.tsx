import React from 'react';
import { Activity, ShieldCheck, Zap, Database, ArrowUpRight, Server, Terminal, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">لوحة التحكم الذكية</h1>
          <p className="text-sm text-slate-400 mt-1">إدارة وتشغيل روبوتات الأتمتة وتتبع تدفق البيانات اللحظي</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            النظام يعمل بكفاءة
          </span>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/25">
            إضافة قاعدة جديدة
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400 font-medium">الروبوتات النشطة</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">12 / 14</div>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +2 روبوتات جديدة اليوم
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400 font-medium">العمليات المنفذة</span>
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold">48,290</div>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% عن الأسبوع الماضي
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400 font-medium">معدل النجاح</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold">99.8%</div>
          <span className="text-xs text-slate-400 mt-1 block">بدون أخطاء حرجة</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400 font-medium">زمن الاستجابة (Latency)</span>
            <Server className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">42ms</div>
          <span className="text-xs text-emerald-400 mt-1 block">مستقر تماماً</span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logs & Rules Section */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              سجل العمليات وقواعد التوجيه النشطة
            </h2>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">تحديث مباشر</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950/80 border border-slate-800/60 rounded-lg flex justify-between items-center">
              <span className="text-slate-300">قاعدة التوجيه #1 - webhook.source == &quot;tradingview&quot;</span>
              <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">نشط</span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800/60 rounded-lg flex justify-between items-center">
              <span className="text-slate-300">قاعدة التوجيه #2 - payload.amount {'>'} 1000</span>
              <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">نشط</span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800/60 rounded-lg flex justify-between items-center">
              <span className="text-slate-300">قاعدة التوجيه #3 - api.gateway.status == 200</span>
              <span className="text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">قيد المراجعة</span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800/60 rounded-lg flex justify-between items-center">
              <span className="text-slate-300">قاعدة التوجيه #4 - automation.task.completed == true</span>
              <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">نشط</span>
            </div>
          </div>
        </div>

        {/* Quick Actions / Control */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-400" />
            الإعدادات والتحكم السريع
          </h2>
          <div className="space-y-3">
            <button className="w-full text-right p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
              <span>إعادة تشغيل خادم Webhook</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </button>
            <button className="w-full text-right p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
              <span>مسح ذاكرة التخزين المؤقت</span>
              <Database className="w-4 h-4 text-blue-400" />
            </button>
            <button className="w-full text-right p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
              <span>تصدير تقرير العمليات (JSON)</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
