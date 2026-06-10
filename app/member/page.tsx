'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MemberPage() {
  const [discordId, setDiscordId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin() {
    if (!discordId.trim()) { setError('请输入 Discord 用户名'); return; }
    if (!pin.trim()) { setError('请输入 PIN 码'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/member/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discordId: discordId.trim(), pin: pin.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(`/member/${encodeURIComponent(discordId.trim())}`);
    } else {
      const data = await res.json();
      setError(data.error || '登录失败');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-3">🎮</p>
          <h1 className="text-white text-2xl font-bold">会员中心</h1>
          <p className="text-zinc-500 text-sm mt-1">输入 Discord 用户名和 PIN 码查看余额</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            placeholder="你的 Discord 用户名"
            autoCapitalize="none"
            className="w-full bg-zinc-900 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
          />
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="PIN 码"
            maxLength={6}
            className="w-full bg-zinc-900 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors"
          >
            {loading ? '验证中...' : '查看我的账户'}
          </button>
        </div>

        <div className="text-center">
          <Link href="/member/topup" className="text-zinc-500 hover:text-white text-sm transition-colors">
            还没有账户？点此充值开通 →
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
