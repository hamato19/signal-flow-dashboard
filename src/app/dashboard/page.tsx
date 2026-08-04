import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Check 
} from 'lucide-react';

export default function ControlPanel() {
  // --- States ---
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });

  // Account & General Settings
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('Asia/Riyadh');
  const [language, setLanguage] = useState('ar');

  // Integrations Config
  const [telegramConfig, setTelegramConfig] = useState({
    token: '',
    chatId: '',
    parseMode: 'HTML',
    disableNotification: false,
    protectContent: false
  });

  const [discordConfig, setDiscordConfig] = useState({
    webhook: '',
    username: 'Hook Signal Bot',
    avatarUrl: '',
    embedColor: '#5865F2'
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    token: '',
    phoneId: '',
    fromNumber: '',
    businessAccountId: ''
  });

  const [slackConfig, setSlackConfig] = useState({
    webhook: '',
    channel: '#signals',
    username: 'Hook Signal',
    iconEmoji: ':signal:'
  });

  const [teamsConfig, setTeamsConfig] = useState({
    webhook: '',
    themeColor: '#6264A7',
    summary: 'Signal Alert'
  });

  // Advanced Webhook & Routing
  const [customWebhook, setCustomWebhook] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [routingRules, setRoutingRules] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    successRate: 0,
    averageResponseTime: 0,
    dailyRequests: [],
    platformUsage: [],
    errorRates: []
  });

  const [webhookSecret, setWebhookSecret] = useState({
    key: '',
    createdAt: '',
    expiresAt: '',
    lastUsed: ''
  });

  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState('inactive');

  // --- Initialize Slug from LocalStorage ---
  useEffect(() => {
    const savedSlug = localStorage.getItem('user_slug');
    if (savedSlug) {
      setSlug(savedSlug);
      setInputSlug(savedSlug);
      setIsLoggedIn(true);
    }
  }, []);

  // --- Load Data on Slug Change ---
  useEffect(() => {
    if (!slug) return;
    loadData();
  }, [slug]);

  const loadData = () => {
    setIsLoading(true);
    // محاكاة جلب البيانات الخاصة بالـ Slug
    setTimeout(() => {
      setWebhookUrl(`https://api.hooksignal.com/v1/webhook/${slug}`);
      setWebhookStatus('active');
      setAnalytics({
        totalRequests: 1420,
        successRate: 99.4,
        averageResponseTime: 125,
        dailyRequests: [],
        platformUsage: [],
        errorRates: []
      });
      setIsLoading(false);
    }, 500);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'info', message: '' });
    }, 3500);
  };

  const handleLogin = (e) => {
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
    
    // تصفير بيانات المستخدم والإعدادات لمنع تداخل البيانات بين الحسابات
    setUsername('');
    setEmail('');
    setTimezone('Asia/Riyadh');
    setLanguage('ar');
    
    setTelegramConfig({
      token: '',
      chatId: '',
      parseMode: 'HTML',
      disableNotification: false,
      protectContent: false
    });
    
    setDiscordConfig({
      webhook: '',
      username: 'Hook Signal Bot',
      avatarUrl: '',
      embedColor: '#5865F2'
    });
    
    setWhatsappConfig({
      token: '',
      phoneId: '',
      fromNumber: '',
      businessAccountId: ''
    });
    
    setSlackConfig({
      webhook: '',
      channel: '#signals',
      username: 'Hook Signal',
      iconEmoji: ':signal:'
    });
    
    setTeamsConfig({
      webhook: '',
      themeColor: '#6264A7',
      summary: 'Signal Alert'
    });
    
    setCustomWebhook('');
    setMessageTemplate('');
    setTemplates([]);
    setRoutingRules([]);
    setLogs([]);
    setAnalytics({
      totalRequests: 0,
      successRate: 0,
      averageResponseTime: 0,
      dailyRequests: [],
      platformUsage: [],
      errorRates: []
    });
    setWebhookSecret({
      key: '',
      createdAt: '',
      expiresAt: '',
      lastUsed: ''
    });
    setWebhookUrl('');
    setWebhookStatus('inactive');

    showNotification('info', 'تم تسجيل الخروج');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // شاشة تسجيل الدخول في حال لم يكن المستخدم مسجلاً
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
                placeholder="e.g. my-trading-bot"
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
      
      {/* إشعارات النظام العائمة */}
      {notification.show && (
        <div className="fixed top-5 left-5 z-50 bg-slate-900 border border-slate-800 shadow-2xl px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* الشريط الجانبي (Sidebar) */}
      <aside className="w-64 bg-slate-900/50 border-l border-slate-800/80 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-xl text-blue-400">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Hook Signal</h2>
              <span className="text-xs text-slate-500 truncate block max-w-[120px]">slug: {slug}</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
              { id: 'integrations', label: 'قنوات الربط', icon: Webhook },
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

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-lg capitalize">
            {activeTab === 'dashboard' && 'الرئيسية وإحصائيات النظام'}
            {activeTab === 'integrations' && 'تخصيص قنوات الربط'}
            {activeTab === 'rules' && 'محرك قواعد التوجيه الذكي'}
            {activeTab === 'logs' && 'سجل المعاملات والطلبات الحي'}
            {activeTab === 'settings' && 'إعدادات الحساب والمتغيرات'}
          </h1>

          <div className="flex items-center gap-4">
            <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              webhookStatus === 'active' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${webhookStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              الويب هوك {webhookStatus === 'active' ? 'يعمل' : 'متوقف'}
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* تبويب الرئيسية */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* رابط الويب هوك السريع */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300">رابط الويب هوك الخاص بك</h3>
                      <p className="text-xs text-slate-500 mt-1">قم بإرسال إشاراتك البرمجية أو إشارات TradingView إلى هذا الرابط</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                      <code className="text-xs text-blue-400 truncate max-w-xs">{webhookUrl}</code>
                      <button 
                        onClick={() => copyToClipboard(webhookUrl)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                      </button>
                    </div>
                  </div>

                  {/* بطاقات الإحصائيات */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs text-slate-400 font-medium">إجمالي الطلبات المُستلمة</p>
                      <h4 className="text-3xl font-bold mt-2 text-slate-100">{analytics.totalRequests}</h4>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs text-slate-400 font-medium">نسبة نجاح التوصيل</p>
                      <h4 className="text-3xl font-bold mt-2 text-emerald-400">{analytics.successRate}%</h4>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <p className="text-xs text-slate-400 font-medium">متوسط سرعة الاستجابة</p>
                      <h4 className="text-3xl font-bold mt-2 text-blue-400">{analytics.averageResponseTime} ms</h4>
                    </div>
                  </div>
                </div>
              )}

              {/* تبويب قنوات الربط */}
              {activeTab === 'integrations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Telegram */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-200">تكامل Telegram</h3>
                      <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">نشط</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Bot Token</label>
                        <input 
                          type="password" 
                          value={telegramConfig.token}
                          onChange={(e) => setTelegramConfig({...telegramConfig, token: e.target.value})}
                          placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Chat ID</label>
                        <input 
                          type="text" 
                          value={telegramConfig.chatId}
                          onChange={(e) => setTelegramConfig({...telegramConfig, chatId: e.target.value})}
                          placeholder="-100xxxxxxxxxx"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Discord */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-200">تكامل Discord Webhook</h3>
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20">نشط</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Webhook URL</label>
                        <input 
                          type="text" 
                          value={discordConfig.webhook}
                          onChange={(e) => setDiscordConfig({...discordConfig, webhook: e.target.value})}
                          placeholder="https://discord.com/api/webhooks/..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Embed Color</label>
                        <input 
                          type="color" 
                          value={discordConfig.embedColor}
                          onChange={(e) => setDiscordConfig({...discordConfig, embedColor: e.target.value})}
                          className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl px-1 py-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* تبويب قواعد التوجيه */}
              {activeTab === 'rules' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">قواعد توجيه الإشارات الذكية</h3>
                      <p className="text-xs text-slate-500 mt-1">توجيه الرسائل بناءً على محتوى الـ Payload أو شروط الـ JSON</p>
                    </div>
                    <button 
                      onClick={() => setRoutingRules([...routingRules, { id: Date.now(), condition: '', action: 'telegram' }])}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> إضافة قاعدة جديدة
                    </button>
                  </div>

                  <div className="space-y-3">
                    {routingRules.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-8">لا توجد قواعد مضافة حالياً.</p>
                    ) : (
                      routingRules.map((rule, idx) => (
                        <div key={rule.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                          <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                          <input 
                            type="text" 
                            placeholder="الشرط (مثال: action == 'buy')" 
                            value={rule.condition}
                            onChange={(e) => {
                              const updated = [...routingRules];
                              updated[idx].condition = e.target.value;
                              setRoutingRules(updated);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                          />
                          <button 
                            onClick={() => setRoutingRules(routingRules.filter(r => r.id !== rule.id))}
                            className="text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* تبويب سجل العمليات */}
              {activeTab === 'logs' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-sm text-slate-200">السجل الحي للطلبات (Live Logs)</h3>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 space-y-2 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-slate-600 text-center py-6">في انتظار استقبال طلبات على الويب هوك...</p>
                    ) : (
                      logs.map((log, index) => <div key={index}>{log}</div>)
                    )}
                  </div>
                </div>
              )}

              {/* تبويب الإعدادات العامة */}
              {activeTab === 'settings' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <h3 className="font-bold text-sm text-slate-200">إعدادات الحساب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">اسم المستخدم</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Fahad bin Mohammed"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => showNotification('success', 'تم حفظ الإعدادات بنجاح')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <Save className="w-4 h-4" /> حفظ التغييرات
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
