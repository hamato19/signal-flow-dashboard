"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Check, Lock, Sparkles, MessageSquare, Send, Globe
} from 'lucide-react';

export default function ControlPanel() {
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Subscription & Plan State (Free / Pro)
  const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
  
  // Telegram Channels List (Free: max 1 channel, Pro: up to 5+ channels)
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, token: '', chatId: '', name: 'القناة الرئيسية' }
  ]);

  const [discordConfig, setDiscordConfig] = useState({ webhook: '' });
  const [whatsappConfig, setWhatsappConfig] = useState({ token: '', phoneId: '' });
  const [customConfig, setCustomConfig] = useState({ url: '' });

  const [routingRules, setRoutingRules] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRequests: 1420,
    successRate: 99.4,
    averageResponseTime: 125,
  });

  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState('active');

  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug) {
      setSlug(savedSlug);
      setInputSlug(savedSlug);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    setWebhookUrl(`https://api.hooksignal.com/v1/webhook/${slug}`);
  }, [slug]);

  const showNotification = (type: string, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '' });
    }, 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) return;
    const cleanSlug = inputSlug.trim().toLowerCase();
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
    showNotification('success', 'تم تسجيل الدخول بنجاح');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    showNotification('info', 'تم تسجيل الخروج');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTelegramChannel = () => {
    if (userPlan === 'free' && telegramChannels.length >= 1) {
      showNotification('error', 'الخطة المجانية تتيح قناة تليجرام واحدة فقط. قم بالترقية لإضافة حتى 5 قنوات وأكثر!');
      return;
    }
    if (userPlan === 'pro' && telegramChannels.length >= 5) {
      showNotification('error', 'الحد الأقصى المسموح به هو 5 قنوات تليجرام في الباقة الحالية.');
      return;
    }
    setTelegramChannels([...telegramChannels, { id: Date.now(), token: '', chatId: '', name: `قناة جديدة ${telegramChannels.length + 1}` }]);
    showNotification('success', 'تمت إضافة حقل قناة تليجرام جديدة بنجاح');
  };

  const removeTelegramChannel = (id: number) => {
    if (telegramChannels.length === 1) {
      showNotification('error', 'يجب أن تملك قناة تليجرام واحدة على الأقل.');
      return;
    }
    setTelegramChannels(telegramChannels.filter(ch => ch.id !== id));
  };

  const goToPricing = () => {
    window.location.href = '/pricing';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-600/10 border border-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Webhook className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">لوحة تحكم الإشارات</h1>
            <p className="text-slate-400 text-sm mt-2">أدخل معرف الحساب (Slug) للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">معرف الحساب (Slug)</label>
              <input 
                type="text" 
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                placeholder="e.g. mm"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              الدخول للوحة التحكم
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans" dir="rtl">
      
      {notification.show && (
        <div className="fixed top-5 left-5 z-50 bg-slate-900 border border-slate-800 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <aside className="w-64 bg-slate-900/50 border-l border-slate-800/80 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-xl text-blue-400">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Hook Signal</h2>
                <span className="text-xs text-slate-500 truncate block max-w-[100px]">slug: {slug}</span>
              </div>
            </div>
          </div>

          <div className="px-4 pt-4">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">الباقة الحالية</span>
                <p className="text-xs font-bold capitalize">{userPlan === 'free' ? 'الخطة المجانية (قناة 1)' : 'باقة PRO الشاملة'}</p>
              </div>
              {userPlan === 'free' && (
                <button 
                  onClick={goToPricing}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shadow cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> ترقية
                </button>
              )}
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
              { id: 'integrations', label: 'قنوات الربط الشاملة', icon: Webhook },
              { id: 'rules', label: 'قواعد التوجيه الذكية', icon: Database },
              { id: 'logs', label: 'سجل العمليات', icon: Terminal },
              { id: 'settings', label: 'الإعدادات العامة', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-lg">
            {activeTab === 'dashboard' && 'الرئيسية والإحصائيات'}
            {activeTab === 'integrations' && 'قنوات الربط الشاملة (تليجرام: قناة مجانية / حتى 5 قنوات للبريميم)'}
            {activeTab === 'rules' && 'محرك قواعد التوجيه الذكي'}
            {activeTab === 'logs' && 'سجل المعاملات والطلبات الحي'}
            {activeTab === 'settings' && 'إعدادات الحساب والمتغيرات'}
          </h1>
          <span className="text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> الويب هوك يعمل
          </span>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بك</h3>
                  <p className="text-xs text-slate-500 mt-1">استقبل إشارات TradingView أو برمجياتك على هذا الرابط</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs">{webhookUrl}</code>
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium">الطلبات المُستلمة</p>
                  <h4 className="text-3xl font-bold mt-2 text-slate-100">{analytics.totalRequests}</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium">نسبة النجاح</p>
                  <h4 className="text-3xl font-bold mt-2 text-emerald-400">{analytics.successRate}%</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium">سرعة الاستجابة</p>
                  <h4 className="text-3xl font-bold mt-2 text-blue-400">{analytics.averageResponseTime} ms</h4>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* Telegram Multiple Channels Section */}
              <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">تكامل Telegram (قنوات متعددة)</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {userPlan === 'free' ? 'الخطة المجانية تتيح قناة واحدة. قم بالترقية لإضافة حتى 5 قنوات.' : 'باقة Pro مفعلة: تتيح لك حتى 5 قنوات تليجرام.'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={addTelegramChannel}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> إضافة قناة تليجرام
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {telegramChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400">قناة تليجرام #{index + 1}</span>
                        {telegramChannels.length > 1 && (
                          <button 
                            onClick={() => removeTelegramChannel(channel.id)}
                            className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Bot Token</label>
                          <input 
                            type="password" 
                            value={channel.token}
                            onChange={(e) => {
                              const updated = [...telegramChannels];
                              updated[index].token = e.target.value;
                              setTelegramChannels(updated);
                            }}
                            placeholder="123456789:ABC..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Chat ID</label>
                          <input 
                            type="text" 
                            value={channel.chatId}
                            onChange={(e) => {
                              const updated = [...telegramChannels];
                              updated[index].chatId = e.target.value;
                              setTelegramChannels(updated);
                            }}
                            placeholder="-100xxxxxxxxxx"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Integrations (Discord, WhatsApp, etc. requiring Pro) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-bold text-sm text-slate-200">تكامل Discord Webhook</h3>
                    </div>
                    {userPlan !== 'pro' && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 cursor-pointer" onClick={goToPricing}>
                        <Lock className="w-3 h-3" /> يتطلب ترقية
                      </span>
                    )}
                  </div>
                  {userPlan !== 'pro' ? (
                    <div className="py-4 text-center space-y-2">
                      <p className="text-xs text-slate-400">هذه القناة متاحة حصرياً في باقة Pro الشاملة.</p>
                      <button onClick={goToPricing} className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-xl font-medium">ترقية الحساب الآن</button>
                    </div>
                  ) : (
                    <input type="text" placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Webhook className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-bold text-sm text-slate-200">تكامل WhatsApp API</h3>
                    </div>
                    {userPlan !== 'pro' && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 cursor-pointer" onClick={goToPricing}>
                        <Lock className="w-3 h-3" /> يتطلب ترقية
                      </span>
                    )}
                  </div>
                  {userPlan !== 'pro' ? (
                    <div className="py-4 text-center space-y-2">
                      <p className="text-xs text-slate-400">هذه القناة متاحة حصرياً في باقة Pro الشاملة.</p>
                      <button onClick={goToPricing} className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2 rounded-xl font-medium">ترقية الحساب الآن</button>
                    </div>
                  ) : (
                    <input type="text" placeholder="WhatsApp Token" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">قواعد توجيه الإشارات الذكية</h3>
                  <p className="text-xs text-slate-500 mt-1">توجيه الرسائل بناءً على الـ Payload</p>
                </div>
                <button onClick={() => setRoutingRules([...routingRules, { id: Date.now(), condition: '' }])} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1">
                  <Plus className="w-4 h-4" /> إضافة قاعدة
                </button>
              </div>
              {routingRules.length === 0 ? <p className="text-xs text-slate-500 text-center py-6">لا توجد قواعد مضافة.</p> : null}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-200">سجل المعاملات الحي</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-48 overflow-y-auto">
                في انتظار استقبال الطلبات...
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-bold text-sm text-slate-200">الإعدادات العامة</h3>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
              <button onClick={() => showNotification('success', 'تم الحفظ')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs">حفظ</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
