"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Bell, Webhook, Settings, Database, 
  Terminal, Shield, LogOut, CheckCircle2, AlertTriangle, 
  Plus, Trash2, Edit, Save, RefreshCw, Code, Copy, Check, Lock, Sparkles, MessageSquare, Send, Globe, ShoppingBag, MessageCircle, Mail, Hash
} from 'lucide-react';

export default function ControlPanel() {
  const [slug, setSlug] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  
  const [notification, setNotification] = useState({ show: false, type: 'info', message: '' });
  const [username, setUsername] = useState('');

  // Subscription & Plan State (Free / Pro)
  const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
  
  // Channels State (Telegram, WhatsApp, Slack, Discord, Email)
  const [telegramChannels, setTelegramChannels] = useState([
    { id: 1, token: '', chatId: '', name: 'ظ‚ظ†ط§ط© طھظ„ظٹط¬ط±ط§ظ… ط§ظ„ط±ط¦ظٹط³ظٹط©' }
  ]);

  const [whatsappChannels, setWhatsappChannels] = useState([
    { id: 1, phoneNumberId: '', accessToken: '', recipientPhone: '', name: 'ط±ظ‚ظ… ظˆط§طھط³ط§ط¨ ط§ظ„ط±ط³ظ…ظٹ' }
  ]);

  const [slackChannels, setSlackChannels] = useState([
    { id: 1, webhookUrl: '', channelName: '#alerts' }
  ]);

  const [discordChannels, setDiscordChannels] = useState([
    { id: 1, webhookUrl: '', serverName: 'ط³ظٹط±ظپط± ط§ظ„ط¯ظٹط³ظƒظˆط±ط¯' }
  ]);

  const [emailChannels, setEmailChannels] = useState([
    { id: 1, smtpHost: '', smtpUser: '', smtpPass: '', recipientEmail: '' }
  ]);

  // Stores Integration State (Salla, Zid, WooCommerce)
  const [stores, setStores] = useState([
    { id: 1, platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }
  ]);

  const [routingRules, setRoutingRules] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRequests: 1420,
    successRate: 99.4,
    averageResponseTime: 125,
  });

  const [webhookUrl, setWebhookUrl] = useState('');

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
    showNotification('success', 'طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_slug');
    setSlug('');
    setIsLoggedIn(false);
    setInputSlug('');
    showNotification('info', 'طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generic Add/Remove Handlers for Omnichannel
  const addChannel = (type: string) => {
    if (userPlan === 'free') {
      showNotification('error', 'ط§ظ„ط®ط·ط© ط§ظ„ظ…ط¬ط§ظ†ظٹط© طھطھظٹط­ ظ‚ظ†ط§ط© ظˆط§ط­ط¯ط© ظپظ‚ط· ظ„ظƒظ„ ظ†ظˆط¹. ظ‚ظ… ط¨ط§ظ„طھط±ظ‚ظٹط© ظ„ظ„ط¨ط§ظ‚ط© ط§ظ„ط´ط§ظ…ظ„ط© ظ„ط¥ط¶ط§ظپط© ظ‚ظ†ظˆط§طھ ظ…طھط¹ط¯ط¯ط© ط¨ظ„ط§ ط­ط¯ظˆط¯!');
      return;
    }

    if (type === 'telegram') {
      setTelegramChannels([...telegramChannels, { id: Date.now(), token: '', chatId: '', name: `ظ‚ظ†ط§ط© طھظ„ظٹط¬ط±ط§ظ… ${telegramChannels.length + 1}` }]);
    } else if (type === 'whatsapp') {
      setWhatsappChannels([...whatsappChannels, { id: Date.now(), phoneNumberId: '', accessToken: '', recipientPhone: '', name: `ط±ظ‚ظ… ظˆط§طھط³ط§ط¨ ${whatsappChannels.length + 1}` }]);
    } else if (type === 'slack') {
      setSlackChannels([...slackChannels, { id: Date.now(), webhookUrl: '', channelName: `#channel-${slackChannels.length + 1}` }]);
    } else if (type === 'discord') {
      setDiscordChannels([...discordChannels, { id: Date.now(), webhookUrl: '', serverName: `ط³ظٹط±ظپط± ط¯ظٹط³ظƒظˆط±ط¯ ${discordChannels.length + 1}` }]);
    } else if (type === 'email') {
      setEmailChannels([...emailChannels, { id: Date.now(), smtpHost: '', smtpUser: '', smtpPass: '', recipientEmail: '' }]);
    }
    showNotification('success', 'طھظ…طھ ط¥ط¶ط§ظپط© ط§ظ„ظ‚ظ†ط§ط© ط¨ظ†ط¬ط§ط­');
  };

  const removeChannel = (type: string, id: number) => {
    if (type === 'telegram' && telegramChannels.length > 1) setTelegramChannels(telegramChannels.filter(c => c.id !== id));
    else if (type === 'whatsapp' && whatsappChannels.length > 1) setWhatsappChannels(whatsappChannels.filter(c => c.id !== id));
    else if (type === 'slack' && slackChannels.length > 1) setSlackChannels(slackChannels.filter(c => c.id !== id));
    else if (type === 'discord' && discordChannels.length > 1) setDiscordChannels(discordChannels.filter(c => c.id !== id));
    else if (type === 'email' && emailChannels.length > 1) setEmailChannels(emailChannels.filter(c => c.id !== id));
    else {
      showNotification('error', 'ظٹط¬ط¨ ط§ظ„ط§ط­طھظپط§ط¸ ط¨ظ‚ظ†ط§ط© ظˆط§ط­ط¯ط© ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„ ظ†ط´ط·ط©.');
    }
  };

  const addStoreIntegration = () => {
    if (userPlan === 'free' && stores.length >= 1) {
      showNotification('error', 'ط§ظ„ط®ط·ط© ط§ظ„ظ…ط¬ط§ظ†ظٹط© طھطھظٹط­ ط±ط¨ط· ظ…طھط¬ط± ظˆط§ط­ط¯ ظپظ‚ط·. ظ‚ظ… ط¨ط§ظ„طھط±ظ‚ظٹط© ظ„ط±ط¨ط· ظ…طھط§ط¬ط± ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©!');
      return;
    }
    setStores([...stores, { id: Date.now(), platform: 'salla', storeName: '', apiKey: '', webhookSecret: '', status: 'disconnected' }]);
    showNotification('success', 'طھظ…طھ ط¥ط¶ط§ظپط© ظ†ظ…ظˆط°ط¬ ط±ط¨ط· ظ…طھط¬ط± ط¬ط¯ظٹط¯');
  };

  const removeStoreIntegration = (id: number) => {
    setStores(stores.filter(s => s.id !== id));
    showNotification('info', 'طھظ… ط­ط°ظپ ط§ظ„ظ…طھط¬ط± ط¨ظ†ط¬ط§ط­');
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
            <h1 className="text-2xl font-bold tracking-tight">ظ„ظˆط­ط© طھط­ظƒظ… ط§ظ„ظ…ظ†طµط© ط§ظ„ط´ط§ظ…ظ„ط©</h1>
            <p className="text-slate-400 text-sm mt-2">ط£ط¯ط®ظ„ ظ…ط¹ط±ظپ ط§ظ„ط­ط³ط§ط¨ (Slug) ظ„ظ„ظˆطµظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">ظ…ط¹ط±ظپ ط§ظ„ط­ط³ط§ط¨ (Slug)</label>
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
              ط§ظ„ط¯ط®ظˆظ„ ظ„ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…
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

      {/* Sidebar ط§ظ„ط§ط­طھط±ط§ظپظٹ */}
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
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">ط§ظ„ط¨ط§ظ‚ط© ط§ظ„ط­ط§ظ„ظٹط©</span>
                <p className="text-xs font-bold capitalize">{userPlan === 'free' ? 'ط§ظ„ط®ط·ط© ط§ظ„ظ…ط¬ط§ظ†ظٹط©' : 'ط¨ط§ظ‚ط© PRO ط§ظ„ط´ط§ظ…ظ„ط©'}</p>
              </div>
              {userPlan === 'free' && (
                <button 
                  onClick={goToPricing}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shadow cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> طھط±ظ‚ظٹط©
                </button>
              )}
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'ط§ظ„ط±ط¦ظٹط³ظٹط© ظˆط§ظ„ط¥ط­طµط§ط¦ظٹط§طھ', icon: LayoutDashboard },
              { id: 'integrations', label: 'ظ‚ظ†ظˆط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظˆط§ظ„ط±ط¨ط·', icon: Webhook },
              { id: 'stores', label: 'ط¥ط¯ط§ط±ط© ظˆط±ط¨ط· ط§ظ„ظ…طھط§ط¬ط±', icon: ShoppingBag },
              { id: 'rules', label: 'ظ‚ظˆط§ط¹ط¯ ط§ظ„طھظˆط¬ظٹظ‡ ط§ظ„ط°ظƒظٹط©', icon: Database },
              { id: 'logs', label: 'ط³ط¬ظ„ ط§ظ„ط¹ظ…ظ„ظٹط§طھ ط§ظ„ط­ظٹ', icon: Terminal },
              { id: 'settings', label: 'ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¹ط§ظ…ط©', icon: Settings },
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
            طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬
          </button>
        </div>
      </aside>

      {/* ط§ظ„ظ…ط­طھظˆظ‰ ط§ظ„ط±ط¦ظٹط³ظٹ */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-bold text-lg">
            {activeTab === 'dashboard' && 'ط§ظ„ط±ط¦ظٹط³ظٹط© ظˆط§ظ„ط¥ط­طµط§ط¦ظٹط§طھ'}
            {activeTab === 'integrations' && 'ظ…ظ†طµط© ظ‚ظ†ظˆط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط´ط§ظ…ظ„ط© (طھظ„ظٹط¬ط±ط§ظ…طŒ ظˆط§طھط³ط§ط¨طŒ ط³ظ„ط§ظƒطŒ ط¯ظٹط³ظƒظˆط±ط¯طŒ ط¨ط±ظٹط¯)'}
            {activeTab === 'stores' && 'ط®ط¯ظ…ط© ط±ط¨ط· ط§ظ„ظ…طھط§ط¬ط± ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹط© (Salla, Zid, WooCommerce)'}
            {activeTab === 'rules' && 'ظ…ط­ط±ظƒ ظ‚ظˆط§ط¹ط¯ ط§ظ„طھظˆط¬ظٹظ‡ ط§ظ„ط°ظƒظٹ'}
            {activeTab === 'logs' && 'ط³ط¬ظ„ ط§ظ„ظ…ط¹ط§ظ…ظ„ط§طھ ظˆط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ط­ظٹ'}
            {activeTab === 'settings' && 'ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط­ط³ط§ط¨ ظˆط§ظ„ظ…طھط؛ظٹط±ط§طھ'}
          </h1>
          <span className="text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> ط§ظ„ظ†ط¸ط§ظ… ظٹط¹ظ…ظ„ ط¨ظƒظپط§ط،ط©
          </span>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">ط±ط§ط¨ط· ط§ظ„ظˆظٹط¨ ظ‡ظˆظƒ ط§ظ„ط´ط§ظ…ظ„ ط§ظ„ط®ط§طµ ط¨ظƒ</h3>
                  <p className="text-xs text-slate-500 mt-1">ط§ط³طھظ‚ط¨ظ„ ط§ظ„ط¥ط´ط§ط±ط§طھ ظ…ظ† TradingView ظˆط§ظ„ظ…طھط§ط¬ط± ظˆظˆط¬ظ‡ظ‡ط§ ظ„ط¬ظ…ظٹط¹ ظ‚ظ†ظˆط§طھظƒ ط¨ظ…ط±ظˆظ†ط© طھط§ظ…ط©</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
                  <code className="text-xs text-blue-400 truncate max-w-xs">{webhookUrl}</code>
                  <button onClick={() => copyToClipboard(webhookUrl)} className="bg-slate-800 text-slate-200 p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'طھظ…' : 'ظ†ط³ط®'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظ…ظڈط³طھظ„ظ…ط©</p>
                  <h4 className="text-3xl font-bold mt-2 text-slate-100">{analytics.totalRequests}</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">ظ†ط³ط¨ط© ط§ظ„ظ†ط¬ط§ط­</p>
                  <h4 className="text-3xl font-bold mt-2 text-emerald-400">{analytics.successRate}%</h4>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                  <p className="text-xs text-slate-400 font-medium">ط³ط±ط¹ط© ط§ظ„ط§ط³طھط¬ط§ط¨ط©</p>
                  <h4 className="text-3xl font-bold mt-2 text-blue-400">{analytics.averageResponseTime} ms</h4>
                </div>
              </div>
            </div>
          )}

          {/* طھط¨ظˆظٹط¨ ظ‚ظ†ظˆط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط´ط§ظ…ظ„ط© (Omnichannel Hub) */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              
              {/* 1. Telegram Channels */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ظ‚ظ†ظˆط§طھ طھظ„ظٹط¬ط±ط§ظ… (Telegram Channels)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ط£ط±ط³ظ„ ط¥ط´ط¹ط§ط±ط§طھظƒ ط§ظ„ظپظˆط±ظٹط© ط¥ظ„ظ‰ ط¹ط¯ط© ظ‚ظ†ظˆط§طھ ط£ظˆ ظ…ط¬ظ…ظˆط¹ط§طھ طھظ„ظٹط¬ط±ط§ظ… ط¨ط§ظ„طھظˆط§ط²ظٹ</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('telegram')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> ط¥ط¶ط§ظپط© ظ‚ظ†ط§ط© طھظ„ظٹط¬ط±ط§ظ…
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {telegramChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-xs font-bold text-blue-400">ظ‚ظ†ط§ط© طھظ„ظٹط¬ط±ط§ظ… #{index + 1}</span>
                        <button onClick={() => removeChannel('telegram', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Bot Token</label>
                          <input type="password" value={channel.token} onChange={(e) => {
                            const updated = [...telegramChannels];
                            updated[index].token = e.target.value;
                            setTelegramChannels(updated);
                          }} placeholder="123456789:ABC..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Chat ID</label>
                          <input type="text" value={channel.chatId} onChange={(e) => {
                            const updated = [...telegramChannels];
                            updated[index].chatId = e.target.value;
                            setTelegramChannels(updated);
                          }} placeholder="-100xxxxxxxxxx" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. WhatsApp Channels */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ط±ط¨ط· ظˆط§طھط³ط§ط¨ (WhatsApp Cloud API)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ط¥ط±ط³ط§ظ„ ط§ظ„طھظ†ط¨ظٹظ‡ط§طھ ظˆط±ط³ط§ط¦ظ„ ط§ظ„ط¹ظ…ظ„ط§ط، ط¹ط¨ط± ط­ط³ط§ط¨ ظˆط§طھط³ط§ط¨ ط¨ط²ظ†ط³ ط§ظ„ط±ط³ظ…ظٹ</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('whatsapp')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> ط¥ط¶ط§ظپط© ط­ط³ط§ط¨ ظˆط§طھط³ط§ط¨
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {whatsappChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-xs font-bold text-emerald-400">ظ‚ظ†ط§ط© ظˆط§طھط³ط§ط¨ #{index + 1}</span>
                        <button onClick={() => removeChannel('whatsapp', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Phone Number ID</label>
                          <input type="text" value={channel.phoneNumberId} onChange={(e) => {
                            const updated = [...whatsappChannels];
                            updated[index].phoneNumberId = e.target.value;
                            setWhatsappChannels(updated);
                          }} placeholder="10394858..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Access Token</label>
                          <input type="password" value={channel.accessToken} onChange={(e) => {
                            const updated = [...whatsappChannels];
                            updated[index].accessToken = e.target.value;
                            setWhatsappChannels(updated);
                          }} placeholder="EAAG..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">ط±ظ‚ظ… ط§ظ„ظ…ط³طھظ„ظ… / ط§ظ„ظ…ط¬ظ…ظˆط¹ط§طھ</label>
                          <input type="text" value={channel.recipientPhone} onChange={(e) => {
                            const updated = [...whatsappChannels];
                            updated[index].recipientPhone = e.target.value;
                            setWhatsappChannels(updated);
                          }} placeholder="+9665xxxxxxxx" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Slack Channels */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-600/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-400">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ظ‚ظ†ظˆط§طھ ط³ظ„ط§ظƒ (Slack Webhooks)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">طھظˆط¬ظٹظ‡ ط§ظ„طھظ†ط¨ظٹظ‡ط§طھ ظ…ط¨ط§ط´ط±ط© ط¥ظ„ظ‰ ظ‚ظ†ظˆط§طھ ظپط±ظٹظ‚ ط§ظ„ط¹ظ…ظ„ ظپظٹ طھط·ط¨ظٹظ‚ Slack</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('slack')} className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> ط¥ط¶ط§ظپط© ظ‚ظ†ط§ط© ط³ظ„ط§ظƒ
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {slackChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-xs font-bold text-amber-400">ظ‚ظ†ط§ط© ط³ظ„ط§ظƒ #{index + 1}</span>
                        <button onClick={() => removeChannel('slack', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Slack Webhook URL</label>
                        <input type="text" value={channel.webhookUrl} onChange={(e) => {
                          const updated = [...slackChannels];
                          updated[index].webhookUrl = e.target.value;
                          setSlackChannels(updated);
                        }} placeholder="https://hooks.slack.com/services/..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Discord Channels */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ظ‚ظ†ظˆط§طھ ط¯ظٹط³ظƒظˆط±ط¯ (Discord Webhooks)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ظ†ط´ط± ط§ظ„ط¥ط´ط§ط±ط§طھ ظˆط§ظ„طھظ‚ط§ط±ظٹط± ط§ظ„ط¢ظ„ظٹط© ظپظٹ ط³ظٹط±ظپط±ط§طھ Discord</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('discord')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> ط¥ط¶ط§ظپط© ظ‚ظ†ط§ط© ط¯ظٹط³ظƒظˆط±ط¯
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {discordChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-xs font-bold text-indigo-400">ظ‚ظ†ط§ط© ط¯ظٹط³ظƒظˆط±ط¯ #{index + 1}</span>
                        <button onClick={() => removeChannel('discord', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Discord Webhook URL</label>
                        <input type="text" value={channel.webhookUrl} onChange={(e) => {
                          const updated = [...discordChannels];
                          updated[index].webhookUrl = e.target.value;
                          setDiscordChannels(updated);
                        }} placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Email Channels */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-600/10 border border-rose-500/20 p-2.5 rounded-xl text-rose-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ (SMTP / Email Alerts)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ط§ط³طھظ„ط§ظ… ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„طھظ†ط¨ظٹظ‡ ظˆط§ظ„طھظ‚ط§ط±ظٹط± ط§ظ„ط¨ط±ظٹط¯ظٹط© ط¹ظ†ط¯ ط­ط¯ظˆط« ط£ظٹ ط­ط¯ط«</p>
                    </div>
                  </div>
                  <button onClick={() => addChannel('email')} className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> ط¥ط¶ط§ظپط© ط¨ط±ظٹط¯ ط¥ظ„ظƒطھط±ظˆظ†ظٹ
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {emailChannels.map((channel, index) => (
                    <div key={channel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-xs font-bold text-rose-400">ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¨ط±ظٹط¯ #{index + 1}</span>
                        <button onClick={() => removeChannel('email', channel.id)} className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">SMTP Host & Port</label>
                          <input type="text" value={channel.smtpHost} onChange={(e) => {
                            const updated = [...emailChannels];
                            updated[index].smtpHost = e.target.value;
                            setEmailChannels(updated);
                          }} placeholder="smtp.mailgun.org:587" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ظ…ط³طھظ‚ط¨ظ„ ظ„ظ„طھظ‚ط§ط±ظٹط±</label>
                          <input type="email" value={channel.recipientEmail} onChange={(e) => {
                            const updated = [...emailChannels];
                            updated[index].recipientEmail = e.target.value;
                            setEmailChannels(updated);
                          }} placeholder="admin@example.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* طھط¨ظˆظٹط¨ ط±ط¨ط· ط§ظ„ظ…طھط§ط¬ط± */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-600/10 border border-purple-500/20 p-2.5 rounded-xl text-purple-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">ط¥ط¯ط§ط±ط© ظˆط±ط¨ط· ط§ظ„ظ…طھط§ط¬ط± ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹط©</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ط±ط¨ط· ظ…ظ†طµط§طھ ط³ظ„ط© (Salla)طŒ ط²ط¯ (Zid)طŒ ظˆظˆظˆظƒظˆظ…ط±ط³ (WooCommerce) ظˆط§ط³طھظ„ط§ظ… Webhooks ط§ظ„ط·ظ„ط¨ط§طھ طھظ„ظ‚ط§ط¦ظٹط§ظ‹</p>
                    </div>
                  </div>
                  <button 
                    onClick={addStoreIntegration}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/20"
                  >
                    <Plus className="w-4 h-4" /> ط±ط¨ط· ظ…طھط¬ط± ط¬ط¯ظٹط¯
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {stores.map((store, index) => (
                    <div key={store.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-400">ظ…طھط¬ط± #{index + 1}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                            {store.status === 'connected' ? 'ظ…طھطµظ„ ط¨ظ†ط¬ط§ط­' : 'ظپظٹ ط§ظ†طھط¸ط§ط± ط§ظ„طھظپط¹ظٹظ„'}
                          </span>
                        </div>
                        {stores.length > 1 && (
                          <button 
                            onClick={() => removeStoreIntegration(store.id)}
                            className="text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">ظ…ظ†طµط© ط§ظ„ظ…طھط¬ط±</label>
                          <select 
                            value={store.platform}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].platform = e.target.value;
                              setStores(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          >
                            <option value="salla">ط³ظ„ط© (Salla)</option>
                            <option value="zid">ط²ط¯ (Zid)</option>
                            <option value="woocommerce">ظˆظˆظƒظˆظ…ط±ط³ (WooCommerce)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">ط§ط³ظ… ط§ظ„ظ…طھط¬ط±</label>
                          <input 
                            type="text" 
                            value={store.storeName}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].storeName = e.target.value;
                              setStores(updated);
                            }}
                            placeholder="ظ…ط«ط§ظ„: ظ…طھط¬ط± ط§ظ„ط¹ط·ظˆط± ط§ظ„ط±ط§ظ‚ظٹ"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">ظ…ظپطھط§ط­ API / Token</label>
                          <input 
                            type="password" 
                            value={store.apiKey}
                            onChange={(e) => {
                              const updated = [...stores];
                              updated[index].apiKey = e.target.value;
                              setStores(updated);
                            }}
                            placeholder="api_token_xxxxxxxx"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">ط±ط§ط¨ط· Webhook ط§ظ„ظ…ط®طµطµ ظ„ظ„ظ…طھط¬ط±:</span> 
                          <code className="text-purple-400 mr-2">{webhookUrl}/store/{store.id}</code>
                        </div>
                        <button 
                          onClick={() => {
                            const updated = [...stores];
                            updated[index].status = 'connected';
                            setStores(updated);
                            showNotification('success', 'طھظ… ط­ظپط¸ ظˆط§ط®طھط¨ط§ط± ط§طھطµط§ظ„ ط§ظ„ظ…طھط¬ط± ط¨ظ†ط¬ط§ط­');
                          }}
                          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap"
                        >
                          ط§ط®طھط¨ط§ط± ظˆط­ظپط¸ ط§ظ„ط±ط¨ط·
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">ظ‚ظˆط§ط¹ط¯ طھظˆط¬ظٹظ‡ ط§ظ„ط¥ط´ط§ط±ط§طھ ط§ظ„ط°ظƒظٹط©</h3>
                  <p className="text-xs text-slate-500 mt-1">طھظˆط¬ظٹظ‡ ط§ظ„ط±ط³ط§ط¦ظ„ ظˆط§ظ„ط·ظ„ط¨ط§طھ ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط§ظ„ظ€ Payload ظˆط§ظ„ط´ط±ظˆط· ط§ظ„ظ…ط®طµطµط©</p>
                </div>
                <button onClick={() => setRoutingRules([...routingRules, { id: Date.now(), condition: '' }])} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-1">
                  <Plus className="w-4 h-4" /> ط¥ط¶ط§ظپط© ظ‚ط§ط¹ط¯ط© طھظˆط¬ظٹظ‡
                </button>
              </div>
              {routingRules.length === 0 ? <p className="text-xs text-slate-500 text-center py-6">ظ„ط§ طھظˆط¬ط¯ ظ‚ظˆط§ط¹ط¯ ظ…ط¶ط§ظپط© ط­طھظ‰ ط§ظ„ط¢ظ†.</p> : null}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">ط³ط¬ظ„ ط§ظ„ظ…ط¹ط§ظ…ظ„ط§طھ ظˆط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ط­ظٹ</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 h-48 overflow-y-auto">
                ظپظٹ ط§ظ†طھط¸ط§ط± ط§ط³طھظ‚ط¨ط§ظ„ ط§ظ„ط·ظ„ط¨ط§طھ...
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <h3 className="font-bold text-sm text-slate-200">ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¹ط§ظ…ط© ظˆط§ظ„ظ…طھط؛ظٹط±ط§طھ</h3>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs" />
              <button onClick={() => showNotification('success', 'طھظ… ط§ظ„ط­ظپط¸ ط¨ظ†ط¬ط§ط­')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs">ط­ظپط¸ ط§ظ„طھط؛ظٹظٹط±ط§طھ</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
