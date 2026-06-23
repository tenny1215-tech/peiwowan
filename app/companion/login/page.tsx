'use client';
import { useState } from 'react';

export default function CompanionLogin() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/companion/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      localStorage.removeItem('peiniwan_member');
      window.location.href = '/companion/room';
    } else {
      const data = await res.json();
      setError(data.error || '登录失败');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">陪玩师登录</h1>
          <p className="text-zinc-500 text-sm mt-1">输入你的专属 Key 进入房间</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="例：pw-a3x9kz"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-zinc-500"
            required
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {loading ? '验证中...' : '进入房间'}
          </button>
        </form>
      </div>
    </main>
  );
}
