"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Check, 
  Lock, Sparkles, MessageSquare, Send, Globe, ShoppingBag, 
  MessageCircle, Mail, Hash, Loader2
} from 'lucide-react';

export default function ControlPanel() {
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  
  // States للمتغيرات المرتبطة بقاعدة البيانات
  const [username, setUsername] = useState('');
  const [userPlan, setUserPlan] = useState('free');
  
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, token: '', chatId: '', name: 'قناة تليجرام الرئيسية' }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState([
    { id: 1, phoneNumberId: '', accessToken: '', recipientPhone: '', name: 'رقم واتساب الرسمي' }
  ]);

  const [discordChannels, setDiscordChannels] = useState([
    { id: 1, webhookUrl: '', serverName: 'سيرفر الديسكورد' }
  ]);

  // أقسام إضافية (يمكنك لاحقاً إضافة أعمدة لها في قاعدة البيانات)
  const [slackChannels, setSlackChannels] = useState([{ id: 1, webhookUrl: '', channelName: '#alerts' }]);
  const [emailChannels, setEmailChannels] = useState([{ id: 1, smtpHost: '', smtpUser: '', smtpPass: '', recipientEmail: '' }]);
  const [stores, setStores] = useState([{ id: 1, platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }]);
  const [routingRules, setRoutingRules] = useState<any[]>([]);
  
  const [analytics, setAnalytics] = useState({ totalRequests: 0, successRate: 100, averageResponseTime: 0 });
  const [webhookUrl, setWebhookUrl] = useState('');

  // 1. التحقق من وجود تسجيل دخول مسبق
  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug) {
      setSlug(savedSlug);
      setInputSlug(savedSlug);
      setIsLoggedIn(true);
      fetchUserData(savedSlug);
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

  // 2. دالة جلب البيانات من قاعدة البيانات
  const fetchUserData = async (currentSlug: string) => {
    setIsLoading(true);
    try {
      // افترض أن ملف الـ API الخاص بقاعدة البيانات موجود في المسار /api/settings
      const res = await fetch(`/api/settings?slug=${currentSlug}`);
      const data = await res.json();
      
      if (data.success && data.settings) {
        const s = data.settings;
        setUsername(s.username || '');
        
        if (s.telegram_token || s.telegram_chat_id) {
          setTelegramChannels([{ id: 1, token: s.telegram_token || '', chatId: s.telegram_chat_id || '', name: 'قناة تليجرام الرئيسية' }]);
        }
        if (s.whatsapp_token || s.whatsapp_phone_id) {
          setWhatsappChannels([{ id: 1, phoneNumberId: s.whatsapp_phone_id || '', accessToken: s.whatsapp_token || '', recipientPhone: '', name: 'رقم واتساب الرسمي' }]);
        }
        if (s.discord_webhook) {
          setDiscordChannels([{ id: 1, webhookUrl: s.discord_webhook || '', serverName: 'سيرفر الديسكورد' }]);
        }
        showNotification('success', 'تم مزامنة البيانات من قاعدة البيانات');
      } else if (data.settings === null) {
        showNotification('info', 'حساب جديد، يرجى إعداد بياناتك وحفظها');
      }
    } catch (error) {
      showNotification('error', 'فشل في الاتصال بقاعدة البيانات');
    }
    setIsLoading(false);
  };

  // 3. دالة الحفظ المباشر في قاعدة البيانات
  const saveToDatabase = async () => {
    setIsSaving(true);
    try {
      const payload = {
        slug: slug,
        original_slug: slug,
        username: username,
        // نأخذ القناة الأولى لأن قاعدة البيانات الحالية مصممة لاستقبال حساب واحد لكل منصة
        telegram_token: telegramChannels[0]?.token || '',
        telegram_chat_id: telegramChannels[0]?.chatId || '',
        whatsapp_token: whatsappChannels[0]?.accessToken || '',
        whatsapp_phone_id: whatsappChannels[0]?.phoneNumberId || '',
        discord_webhook: discordChannels[0]?.webhookUrl || '',
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showNotification('success', 'تم حفظ جميع التعديلات في قاعدة البيانات بنجاح!');
      } else {
        showNotification('error', data.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      showNotification('error', 'خطأ في الشبكة، لم يتم الحفظ');
    }
    setIsSaving(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) return;
    const cleanSlug = inputSlug.trim().toLowerCase();
    localStorage.setItem('user_slug', cleanSlug);
    setSlug(cleanSlug);
    setIsLoggedIn(true);
    fetchUserData(cleanSlug);
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

  // وظائف إضافة/حذف القنوات (نفس الكود الخاص بك)
  const addChannel = (type: string) => {
    if (userPlan === 'free') {
      showNotification('error', 'الخطة المجانية تتيح قناة واحدة فقط. يرجى الترقية!');
      return;
    }
    // ... باقي لوجيك الإضافة ...
  };
  const removeChannel = (type: string, id: number) => {
    // ... لوجيك الحذف ...
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-600/10 border border-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Webhook className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">لوحة تحكم المنصة الشاملة</h1>
            <p className="text-slate-400 text-sm mt-2">أدخل معرف الحساب (Slug) للوصول أو إنشاء حساب</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">معرف الحساب (Slug)</label>
              <input 
                type="text" 
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                placeholder="e.g. fahad"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'الدخول للوحة التحكم'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans" dir="rtl">
      {notification.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-l border-slate-800/80 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-xl text-blue-400">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Hook Signal</h2>
                <span className="text-xs text-slate-500 block max-w-[100px]">Slug: {slug}</span>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
              { id: 'integrations', label: 'قنوات الإشعارات', icon: Webhook },
              { id: 'stores', label: 'ربط المتاجر', icon: ShoppingBag },
              { id: 'rules', label: 'قواعد التوجيه', icon: Database },
              { id: 'logs', label: 'سجل العمليات', icon: Terminal },
              { id: 'settings', label: 'الإعدادات العامة', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/80">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-lg hidden md:block">لوحة التحكم</h1>
          
          {/* زر الحفظ الرئيسي لقاعدة البيانات */}
          <div className="flex items-center gap-3">
            {isLoading && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> جاري الجلب...</span>}
            <button 
              onClick={saveToDatabase}
              disabled={isSaving || isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ التعديلات في القاعدة
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-6 pb-20">
          
          {/* تبويب الرئيسية */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بك</h3>
                  <p className="text-xs text-slate-500 mt-1">استخدم هذا الرابط في TradingView أو المتاجر لاستقبال الإشارات</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs">{webhookUrl}</code>
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs hover:bg-slate-700 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* تبويب القنوات (الربط بقاعدة البيانات) */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-fade-in">
              {/* Telegram */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400"><Send className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">إعدادات تليجرام (Telegram)</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Bot Token</label>
                    <input type="password" value={telegramChannels[0].token} onChange={(e) => setTelegramChannels([{...telegramChannels[0], token: e.target.value}])} placeholder="123456789:ABC..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Chat ID</label>
                    <input type="text" value={telegramChannels[0].chatId} onChange={(e) => setTelegramChannels([{...telegramChannels[0], chatId: e.target.value}])} placeholder="-100xxxxxxxxxx" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-blue-500" />
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-600/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400"><MessageCircle className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">إعدادات واتساب (WhatsApp API)</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone Number ID</label>
                    <input type="text" value={whatsappChannels[0].phoneNumberId} onChange={(e) => setWhatsappChannels([{...whatsappChannels[0], phoneNumberId: e.target.value}])} placeholder="10394858..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Access Token</label>
                    <input type="password" value={whatsappChannels[0].accessToken} onChange={(e) => setWhatsappChannels([{...whatsappChannels[0], accessToken: e.target.value}])} placeholder="EAAG..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Discord */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-600/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400"><MessageSquare className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">إعدادات ديسكورد (Discord Webhook)</h3>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Webhook URL</label>
                  <input type="text" value={discordChannels[0].webhookUrl} onChange={(e) => setDiscordChannels([{...discordChannels[0], webhookUrl: e.target.value}])} placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {/* تبويب الإعدادات العامة */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-bold text-sm text-slate-200">إعدادات الحساب وقاعدة البيانات</h3>
                <p className="text-xs text-slate-500 mt-1">المتغيرات الأساسية الخاصة بك في النظام</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">اسم المستخدم (الاسم المعروض)</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="مثال: فهد محمد" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">معرف الـ Slug الحالي (غير قابل للتعديل هنا)</label>
                  <input 
                    type="text" 
                    value={slug} 
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* تبويب السجلات (Logs) */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-200">سجل العمليات والطلبات (Live Logs)</h3>
                <button className="text-xs flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                  <RefreshCw className="w-3 h-3" /> تحديث السجل
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-64 overflow-y-auto">
                <div className="text-emerald-500 mb-2">[{new Date().toLocaleTimeString()}] النظام جاهز لاستقبال طلبات Webhook للـ Slug: {slug}...</div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
