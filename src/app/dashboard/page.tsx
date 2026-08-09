"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Lock, 
  Sparkles, MessageSquare, Send, Globe, ShoppingBag, 
  MessageCircle, Mail, Hash, Building2, TrendingUp, 
  PhoneCall, Smartphone, Check, Menu, X, Zap, Cpu, Key, 
  Layers, Users, Activity, Link2, Radio, Bot, Cloud,
  Gift, Star, Crown, Award, Rocket, BarChart3, 
  Wallet, Store, LineChart, Briefcase, HardDrive,
  ChevronLeft, ChevronRight, CircleDot, Dot, 
  RadioReceiver, Network, Satellite, Wifi, 
  Signal, Waves, Antenna
} from 'lucide-react';

export default function ControlPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userPlan, setUserPlan] = useState('free');
  const [slug, setSlug] = useState('mo');
  const [showWizard, setShowWizard] = useState(false);

  const goToPricing = () => {
    // الانتقال لصفحة الترقية
  };

  const saveUserDataToDB = () => {
    // حفظ البيانات
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // --- Sidebar Navigation Structure (محسّن) ---
  const navSections = [
    {
      title: 'الرئيسية',
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, badge: 'Live' },
        { id: 'analytics', label: 'الإحصائيات المتقدمة', icon: BarChart3, badge: 'Beta' },
      ]
    },
    {
      title: 'قنوات الإشعارات',
      icon: <Bell className="w-4 h-4" />,
      items: [
        { id: 'integrations', label: 'جميع القنوات', icon: Webhook },
        { id: 'telegram', label: 'تلجرام', icon: Send, badge: '2' },
        { id: 'whatsapp', label: 'واتساب', icon: MessageCircle, badge: '1' },
        { id: 'sms', label: 'SMS & Pushover', icon: Smartphone },
      ]
    },
    {
      title: 'التكاملات',
      icon: <Link2 className="w-4 h-4" />,
      items: [
        { id: 'trading', label: 'منصات التداول', icon: TrendingUp },
        { id: 'stores', label: 'المتاجر الإلكترونية', icon: ShoppingBag },
        { id: 'enterprise', label: 'الشركات والأقسام', icon: Building2, pro: true },
      ]
    },
    {
      title: 'الإدارة',
      icon: <Settings className="w-4 h-4" />,
      items: [
        { id: 'rules', label: 'قواعد التوجيه', icon: Database },
        { id: 'logs', label: 'سجل العمليات', icon: Terminal },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
      ]
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white" dir="rtl">
        <p>تم تسجيل الخروج. يرجى إعادة تسجيل الدخول.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex font-sans relative" dir="rtl">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-md"
        />
      )}

      {/* ====== القائمة الجانبية المحسّنة ====== */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 
        bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-slate-900/98
        border-l border-slate-800/60 
        flex flex-col transition-all duration-300 ease-in-out
        shadow-2xl shadow-black/50
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header - محسّن */}
        <div className="relative p-5 border-b border-slate-800/60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-2.5 rounded-xl">
                  <Webhook className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-base bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Hook Signal
                </h2>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/50 px-2 py-0.5 rounded-md">
                  @{slug}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Card - محسّن */}
          <div className="relative mt-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm" />
                <div className="relative w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">الحساب</span>
                <p className="text-xs font-bold capitalize text-slate-200">
                  {userPlan === 'free' ? 'الخطة المجانية' : '⭐ باقة PRO'}
                </p>
              </div>
            </div>
            {userPlan === 'free' && (
              <button 
                onClick={goToPricing}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center gap-1.5 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> ترقية
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation - محسّن مع أقسام */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-1.5">
              {/* عنوان القسم */}
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent" />
              </div>

              {/* عناصر القسم */}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isPro = item.pro === true;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl 
                      text-sm font-medium transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-600/5' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    {/* حالة نشط - شريط جانبي */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-l-full" />
                    )}

                    {/* أيقونة */}
                    <div className={`
                      relative flex-shrink-0 transition-all duration-300
                      ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* النص */}
                    <span className="flex-1 text-right truncate">
                      {item.label}
                    </span>

                    {/* الشارات */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isPro && (
                        <span className="text-[8px] font-bold bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          PRO
                        </span>
                      )}
                      {item.badge && (
                        <span className={`
                          text-[9px] font-bold px-2 py-0.5 rounded-full
                          ${item.badge === 'Live' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : item.badge === 'Beta'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer - محسّن */}
        <div className="p-4 border-t border-slate-800/60 space-y-2.5 bg-slate-900/50">
          {/* مؤشر حالة النظام */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/30 rounded-xl border border-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm" />
                <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-400">النظام يعمل</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">v2.4.1</span>
          </div>

          <button
            onClick={() => saveUserDataToDB()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 hover:from-emerald-600/30 hover:to-emerald-500/30 text-emerald-300 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 shadow-lg shadow-emerald-600/5 cursor-pointer group"
          >
            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>حفظ البيانات</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ====== المحتوى الرئيسي ====== */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full md:mr-72">
        {/* Header - محسّن */}
        <header className="h-16 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden bg-slate-800/60 border border-slate-700/50 p-2 rounded-xl text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-sm md:text-lg truncate max-w-[200px] md:max-w-none text-slate-100">
              {activeTab === 'dashboard' && 'لوحة التحكم'}
              {activeTab === 'analytics' && 'الإحصائيات المتقدمة'}
              {activeTab === 'integrations' && 'قنوات الإشعارات'}
              {activeTab === 'telegram' && 'قنوات تلجرام'}
              {activeTab === 'whatsapp' && 'ربط واتساب'}
              {activeTab === 'sms' && 'بوابة الرسائل'}
              {activeTab === 'trading' && 'منصات التداول'}
              {activeTab === 'stores' && 'المتاجر الإلكترونية'}
              {activeTab === 'enterprise' && 'الشركات والأقسام'}
              {activeTab === 'rules' && 'قواعد التوجيه'}
              {activeTab === 'logs' && 'سجل العمليات'}
              {activeTab === 'settings' && 'الإعدادات'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowWizard(true)}
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-blue-600/15 to-indigo-600/15 hover:from-blue-600/25 hover:to-indigo-600/25 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-xl transition-all duration-300 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" /> الدليل السريع
            </button>
            <span className="text-[11px] md:text-xs px-3 py-1 rounded-full border flex items-center gap-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 whitespace-nowrap">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-sm" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
              </div>
              {slug}
            </span>
          </div>
        </header>

        {/* محتوى الصفحة بناءً على التبويب النشط */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-slate-200 mb-2">محتوى قسم: {activeTab}</h3>
            <p className="text-sm text-slate-400">
              هذه هي المساحة المخصصة لعرض تفاصيل القسم المحدد من القائمة الجانبية. يمكنك ربط مكوناتك البرمجية والبيانات هنا بكل سهولة.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
