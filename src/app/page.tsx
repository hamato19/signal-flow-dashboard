'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    // تخزين اسم المستخدم وتوجيهه للوحة التحكم الخاصة به
    localStorage.setItem('signal_user', username.trim());
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">لوحة إشارات التداول</h1>
        <p className="text-gray-400 text-sm text-center mb-6">تسجيل الدخول للحصول على رابط الويب هوك الخاص بك</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">اسم المستخدم أو المعرف</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="مثال: fahad"
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition"
          >
            دخول للوحة التحكم
          </button>
        </form>
      </div>
    </div>
  );
}

