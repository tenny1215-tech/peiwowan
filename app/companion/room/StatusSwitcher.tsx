'use client';
import { useState } from 'react';

const STATUSES = [
  { label: '在线', color: 'bg-green-500 hover:bg-green-400', dot: 'bg-green-400' },
  { label: '接单', color: 'bg-blue-500 hover:bg-blue-400', dot: 'bg-blue-400' },
  { label: '游戏中', color: 'bg-yellow-500 hover:bg-yellow-400', dot: 'bg-yellow-400' },
  { label: '离线', color: 'bg-zinc-600 hover:bg-zinc-500', dot: 'bg-zinc-400' },
];

export default function StatusSwitcher({ currentStatus }: { currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function updateStatus(s: string) {
    if (s === status || loading) return;
    setLoading(true);
    const res = await fetch('/api/companion/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
    if (res.ok) {
      setStatus(s);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  }

  async function logout() {
    await fetch('/api/companion/logout', { method: 'POST' });
    window.location.href = '/companion/login';
  }

  const current = STATUSES.find((s) => s.label === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${current?.dot || 'bg-zinc-400'}`} />
        <span className="text-white font-semibold text-lg">{status}</span>
        {saved && <span className="text-green-400 text-sm">已更新</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATUSES.map((s) => (
          <button
            key={s.label}
            onClick={() => updateStatus(s.label)}
            disabled={loading}
            className={`py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
              status === s.label
                ? `${s.color} text-white ring-2 ring-white/30`
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button
        onClick={logout}
        className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2 transition-colors"
      >
        退出登录
      </button>
    </div>
  );
}
