"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Check, 
  Lock, Sparkles, MessageSquare, Send, Globe, ShoppingBag, 
  MessageCircle, Mail, Hash, Loader2, Smartphone, Briefcase, Cpu, ArrowUpCircle, TrendingUp
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
  
  // بيانات المستخدم المرتبطة بالـ Slug
  const [username, setUsername] = useState('');
  const [userPlan, setUserPlan] = useState('free'); // 'free' أو 'pro'
  
  // القنوات متعددة العناصر
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, token: '', chatId: '', name: 'قناة تليجرام الرئيسية' }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState([
    { id: 1, phoneNumberId: '', accessToken: '', recipientPhone: '', name: 'رقم واتساب الرسمي' }
  ]);

  const [discordChannels, setDiscordChannels] = useState([
    { id: 1, webhookUrl: '', serverName: 'سيرفر الديسكورد الرئيسي' }
  ]);

  // قسم منصات العملات الرقمية (Binance, OKX, Bybit, Coinbase وغيرها)
  const [cryptoExchanges, setCryptoExchanges] = useState([
    { id: 1, exchange: 'binance', accountName: '', apiKey: '', apiSecret: '', webhookIpWhitelist: '', status: 'disconnected' }
  ]);

  // قسم المتاجر الإلكترونية (سلة، زد، ووكومرس)
  const [stores, setStores] = useState([
    { id: 1, platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }
  ]);

  // قسم خدمات الشركات B2B
  const [b2bEndpoints, setB2bEndpoints] = useState([
    { id: 1, companyName: '', taxNumber: '', erpSystem: 'odoo', apiEndpoint: '', authToken: '', autoInvoice: true }
  ]);

  const [webhookUrl, setWebhookUrl] = useState('');

  // الحد الأقصى للقنوات حسب نوع الخطة (المجانية 1، برو 5)
  const maxChannelsAllowed = userPlan === 'pro' ? 5 : 1;

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

  const fetchUserData = async (currentSlug: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/settings?slug=${currentSlug}`);
      const data = await res.json();
      
      if (data.success && data.settings) {
        const s = data.settings;
        setUsername(s.username || '');
        setUserPlan(s.user_plan || 'free');
        
        if (s.telegram_channels && Array.isArray(s.telegram_channels)) setTelegramChannels(s.telegram_channels);
        if (s.whatsapp_channels && Array.isArray(s.whatsapp_channels)) setWhatsappChannels(s.whatsapp_channels);
        if (s.crypto_exchanges && Array.isArray(s.crypto_exchanges)) setCryptoExchanges(s.crypto_exchanges);
        if (s.stores && Array.isArray(s.stores)) setStores(s.stores);
        if (s.b2b_endpoints && Array.isArray(s.b2b_endpoints)) setB2bEndpoints(s.b2b_endpoints);

        showNotification('success', 'تم استرجاع بيانات الحساب بنجاح');
      } else {
        showNotification('info', 'حساب جديد، يتم تهيئة بيئة العمل الخاصة بك');
      }
    } catch (error) {
      showNotification('error', 'فشل في الاتصال بقاعدة البيانات لجلب البيانات');
    }
    setIsLoading(false);
  };

  const saveToDatabase = async () => {
    setIsSaving(true);
    try {
      const payload = {
        slug: slug,
        username: username,
        user_plan: userPlan,
        telegram_channels: telegramChannels,
        whatsapp_channels: whatsappChannels,
        crypto_exchanges: cryptoExchanges,
        stores: stores,
        b2b_endpoints: b2bEndpoints
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showNotification('success', 'تم حفظ وتحديث إعدادات الحساب في قاعدة البيانات بنجاح!');
      } else {
        showNotification('error', data.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      showNotification('error', 'خطأ في الشبكة، تعذر حفظ البيانات');
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-600/10 border border-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Webhook className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">منصة التوجيه الذكي (Webhook Hub)</h1>
            <p className="text-slate-400 text-sm mt-2">أدخل معرف الحساب (Slug) الخاص بك للدخول أو إنشاء حساب جديد تلقائياً</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">معرف الحساب المخصص (Slug)</label>
              <input 
                type="text" 
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                placeholder="e.g. trading-bot-fahad"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'دخول / إنشاء الحساب'}
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
                <h2 className="font-bold text-sm">Hook Hub</h2>
                <span className="text-xs text-blue-400 font-mono block max-w-[120px] truncate">Slug: {slug}</span>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
              { id: 'integrations', label: 'قنوات الإشعارات', icon: Webhook },
              { id: 'crypto', label: 'منصات العملات الرقمية', icon: TrendingUp },
              { id: 'stores', label: 'ربط المتاجر (سلة/زد)', icon: ShoppingBag },
              { id: 'b2b', label: 'ربط الشركات B2B & ERP', icon: Briefcase },
              { id: 'logs', label: 'سجل العمليات (Logs)', icon: Terminal },
              { id: 'settings', label: 'إعدادات الحساب والخطة', icon: Settings },
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
        
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">الخطة الحالية:</span>
              <span className={`uppercase font-bold ${userPlan === 'pro' ? 'text-amber-400' : 'text-blue-400'}`}>{userPlan}</span>
            </div>
            <p className="text-[10px] text-slate-500">حد القنوات: {maxChannelsAllowed} لكل خدمة</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-lg hidden md:block">لوحة تحكم الحساب: <span className="text-blue-400 font-mono">{slug}</span></h1>
          <div className="flex items-center gap-3">
            {isLoading && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> جاري المزامنة...</span>}
            <button 
              onClick={saveToDatabase}
              disabled={isSaving || isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ وتحديث في قاعدة البيانات
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-6 pb-20">
          
          {/* تبويب الرئيسية */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بحسابك</h3>
                  <p className="text-xs text-slate-500 mt-1">استخدم هذا الرابط لاستقبال إشارات المنصات (مثل TradingView أو منصات التداول) حصرياً لحسابك ({slug})</p>
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

          {/* تبويب قنوات الإشعارات */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400"><Send className="w-5 h-5" /></div>
                    <h3 className="font-bold text-sm text-slate-200">قنوات تليجرام المربوطة ({telegramChannels.length}/{maxChannelsAllowed})</h3>
                  </div>
                  <button 
                    onClick={() => {
                      if (telegramChannels.length >= maxChannelsAllowed) {
                        showNotification('error', `عذراً، خطتك الحالية تتيح حتى ${maxChannelsAllowed} قناة فقط.`);
                        return;
                      }
                      setTelegramChannels([...telegramChannels, { id: Date.now(), token: '', chatId: '', name: `قناة ${telegramChannels.length + 1}` }]);
                    }}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة قناة
                  </button>
                </div>
                
                <div className="space-y-3">
                  {telegramChannels.map((ch, idx) => (
                    <div key={ch.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl relative space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">قناة #{idx + 1}</span>
                        {telegramChannels.length > 1 && (
                          <button onClick={() => setTelegramChannels(telegramChannels.filter(item => item.id !== ch.id))} className="text-rose-400 text-xs flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5" /> حذف
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="password" 
                          value={ch.token} 
                          onChange={(e) => {
                            const updated = [...telegramChannels];
                            updated[idx].token = e.target.value;
                            setTelegramChannels(updated);
                          }} 
                          placeholder="Bot Token" 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-blue-500" 
                        />
                        <input 
                          type="text" 
                          value={ch.chatId} 
                          onChange={(e) => {
                            const updated = [...telegramChannels];
                            updated[idx].chatId = e.target.value;
                            setTelegramChannels(updated);
                          }} 
                          placeholder="Chat ID" 
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-blue-500" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب منصات العملات الرقمية الجديد */}
          {activeTab === 'crypto' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-600/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-400"><TrendingUp className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">ربط منصات العملات الرقمية (Crypto Exchanges Webhooks)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">ربط حسابات التداول لتلقي إشعارات الصفقات وتنفيذ الإشارات الآلية (Binance, OKX, Bybit, Coinbase)</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (cryptoExchanges.length >= maxChannelsAllowed) {
                      showNotification('error', `عذراً، حد منصات العملات الرقمية في خطتك هو ${maxChannelsAllowed}`);
                      return;
                    }
                    setCryptoExchanges([...cryptoExchanges, { id: Date.now(), exchange: 'binance', accountName: '', apiKey: '', apiSecret: '', webhookIpWhitelist: '', status: 'disconnected' }]);
                  }}
                  className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> ربط منصة جديدة
                </button>
              </div>

              <div className="space-y-4">
                {cryptoExchanges.map((item, index) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <select 
                          value={item.exchange} 
                          onChange={(e) => {
                            const updated = [...cryptoExchanges];
                            updated[index].exchange = e.target.value;
                            setCryptoExchanges(updated);
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-bold uppercase focus:outline-none"
                        >
                          <option value="binance">Binance</option>
                          <option value="okx">OKX</option>
                          <option value="bybit">Bybit</option>
                          <option value="coinbase">Coinbase Advanced</option>
                          <option value="other">منصة أخرى (Custom Webhook)</option>
                        </select>
                      </div>
                      {cryptoExchanges.length > 1 && (
                        <button onClick={() => setCryptoExchanges(cryptoExchanges.filter(c => c.id !== item.id))} className="text-rose-400 hover:text-rose-300 text-xs">حذف الربط</button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">اسم الحساب / الوصف</label>
                        <input 
                          type="text" 
                          value={item.accountName} 
                          onChange={(e) => {
                            const updated = [...cryptoExchanges];
                            updated[index].accountName = e.target.value;
                            setCryptoExchanges(updated);
                          }}
                          placeholder="حساب التداول الرئيسي" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-amber-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">API Key</label>
                        <input 
                          type="password" 
                          value={item.apiKey} 
                          onChange={(e) => {
                            const updated = [...cryptoExchanges];
                            updated[index].apiKey = e.target.value;
                            setCryptoExchanges(updated);
                          }}
                          placeholder="مفتاح الـ API..." 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-amber-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">API Secret</label>
                        <input 
                          type="password" 
                          value={item.apiSecret} 
                          onChange={(e) => {
                            const updated = [...cryptoExchanges];
                            updated[index].apiSecret = e.target.value;
                            setCryptoExchanges(updated);
                          }}
                          placeholder="الرمز السري..." 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-amber-500" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب ربط المتاجر */}
          {activeTab === 'stores' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400"><ShoppingBag className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">ربط المتاجر الإلكترونية (سلة، زد، ووكومرس)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">استقبال طلبات وتحديثات السلال والمتاجر الخاصة بك</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (stores.length >= maxChannelsAllowed) {
                      showNotification('error', `عذراً، حد المتاجر في خطتك هو ${maxChannelsAllowed}`);
                      return;
                    }
                    setStores([...stores, { id: Date.now(), platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }]);
                  }}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> ربط متجر جديد
                </button>
              </div>

              <div className="space-y-4">
                {stores.map((store, index) => (
                  <div key={store.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <select 
                        value={store.platform} 
                        onChange={(e) => {
                          const updated = [...stores];
                          updated[index].platform = e.target.value;
                          setStores(updated);
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-bold uppercase focus:outline-none"
                      >
                        <option value="salla">سلة (Salla)</option>
                        <option value="zid">زد (Zid)</option>
                        <option value="woocommerce">ووكومرس (WooCommerce)</option>
                      </select>
                      {stores.length > 1 && (
                        <button onClick={() => setStores(stores.filter(s => s.id !== store.id))} className="text-rose-400 text-xs">حذف</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        value={store.storeName} 
                        onChange={(e) => {
                          const updated = [...stores];
                          updated[index].storeName = e.target.value;
                          setStores(updated);
                        }}
                        placeholder="اسم المتجر" 
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" 
                      />
                      <input 
                        type="password" 
                        value={store.apiKey} 
                        onChange={(e) => {
                          const updated = [...stores];
                          updated[index].apiKey = e.target.value;
                          setStores(updated);
                        }}
                        placeholder="Webhook Secret / API Key" 
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب ربط الشركات B2B */}
          {activeTab === 'b2b' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400"><Briefcase className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">أنظمة الشركات والـ ERP (B2B Integrations)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">الربط الآلي مع الأنظمة المحاسبية وإصدار الفواتير ومزامنة العملاء</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (b2bEndpoints.length >= maxChannelsAllowed) {
                      showNotification('error', `حد ربط أنظمة B2B في خطتك هو ${maxChannelsAllowed}`);
                      return;
                    }
                    setB2bEndpoints([...b2bEndpoints, { id: Date.now(), companyName: '', taxNumber: '', erpSystem: 'odoo', apiEndpoint: '', authToken: '', autoInvoice: true }]);
                  }}
                  className="bg-blue-600/25 hover:bg-blue-600/35 text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> ربط نظام جديد
                </button>
              </div>

              <div className="space-y-4">
                {b2bEndpoints.map((b2b, index) => (
                  <div key={b2b.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">نظام الشركة #{index + 1}</span>
                      {b2bEndpoints.length > 1 && (
                        <button onClick={() => setB2bEndpoints(b2bEndpoints.filter(b => b.id !== b2b.id))} className="text-rose-400 text-xs">حذف</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input 
                        type="text" 
                        value={b2b.companyName} 
                        onChange={(e) => {
                          const updated = [...b2bEndpoints];
                          updated[index].companyName = e.target.value;
                          setB2bEndpoints(updated);
                        }}
                        placeholder="اسم الشركة" 
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-blue-500" 
                      />
                      <input 
                        type="text" 
                        value={b2b.taxNumber} 
                        onChange={(e) => {
                          const updated = [...b2bEndpoints];
                          updated[index].taxNumber = e.target.value;
                          setB2bEndpoints(updated);
                        }}
                        placeholder="الرقم الضريبي" 
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-blue-500" 
                      />
                      <select 
                        value={b2b.erpSystem} 
                        onChange={(e) => {
                          const updated = [...b2bEndpoints];
                          updated[index].erpSystem = e.target.value;
                          setB2bEndpoints(updated);
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-blue-500"
                      >
                        <option value="odoo">Odoo ERP</option>
                        <option value="sap">SAP</option>
                        <option value="netsuite">Oracle NetSuite</option>
                        <option value="custom">Custom Webhook API</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب إعدادات الحساب والخطة */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-bold text-sm text-slate-200">إعدادات الحساب وخطة الاشتراك</h3>
                <p className="text-xs text-slate-500 mt-1">إدارة اسم العرض وترقية خطتك للحصول على قنوات وربط غير محدود</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">اسم المستخدم (المعروض)</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="مثال: فهد محمد" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">معرف الحساب الثابت (Slug)</label>
                  <input 
                    type="text" 
                    value={slug} 
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed font-mono" 
                  />
                </div>
              </div>

              {/* نظام الترقية */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-slate-200">ترقية الحساب إلى خطة المحترفين (Pro Plan)</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">يتيح لك إضافة حتى 5 قنوات ومنصات تداول لكل خدمة مع أسبقية المعالجة وربط الأنظمة المالية.</p>
                </div>
                <button 
                  onClick={() => {
                    setUserPlan(userPlan === 'free' ? 'pro' : 'free');
                    showNotification('success', userPlan === 'free' ? 'تمت ترقية الحساب إلى Pro بنجاح!' : 'تم التبديل للخطة المجانية');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 ${
                    userPlan === 'pro' 
                      ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  {userPlan === 'pro' ? 'إلغاء الترقية (الرجوع للمجاني)' : 'ترقية إلى Pro فوراً'}
                </button>
              </div>
            </div>
          )}

          {/* تبويب سجلات العمليات */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-200">سجل الطلبات الواردة للحساب: {slug}</h3>
                <button className="text-xs flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                  <RefreshCw className="w-3 h-3" /> تحديث السجل
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-64 overflow-y-auto space-y-2">
                <div className="text-emerald-500">[{new Date().toLocaleTimeString()}] النظام جاهز لاستقبال إشارات التداول والـ Webhook للـ Slug المخصص: {slug}</div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
