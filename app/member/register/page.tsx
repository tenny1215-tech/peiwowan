'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SESSION_KEY = 'peiniwan_member';

export default function RegisterPage() {
  const [discordId, setDiscordId] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin !== pinConfirm) { setError('两次密码不一致'); return; }
    if (pin.length < 6) { setError('密码至少6位'); return; }
    setLoading(true);
    setError('');

    const res = await fetch('/api/member/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discordId: discordId.trim(), pin: pin.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        discordId: data.discordId,
        name: data.name,
        balance: data.balance,
      }));
      window.location.href = '/member/topup';
    } else {
      setError(data.error || '注册失败');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-3">🎮</p>
          <h1 className="text-white text-2xl font-bold">创建账号</h1>
          <p className="text-zinc-500 text-sm mt-1">注册后即可充值预约陪玩</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            placeholder="Discord 用户名 *"
            autoCapitalize="none"
            required
            className="w-full bg-zinc-900 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
          />
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="设置密码（6-20位）"
            maxLength={20}
            required
            className="w-full bg-zinc-900 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
          />
          <input
            type="password"
            value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value)}
            placeholder="确认密码"
            maxLength={20}
            required
            className="w-full bg-zinc-900 text-white rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors"
          >
            {loading ? '注册中...' : '立即注册'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-zinc-500 text-sm">
            已有账号？
            <Link href="/member" className="text-pink-400 hover:text-pink-300 ml-1 transition-colors">
              直接登录 →
            </Link>
          </p>
          <Link href="/" className="block text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
