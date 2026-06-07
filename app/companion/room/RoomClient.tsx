'use client';
import { useState } from 'react';
import { Person } from '@/lib/notion';

const STATUSES = [
  { label: '在线', color: 'bg-green-500 hover:bg-green-400', dot: 'bg-green-400' },
  { label: '可接单', color: 'bg-green-500 hover:bg-green-400', dot: 'bg-green-400' },
  { label: '游戏中', color: 'bg-yellow-500 hover:bg-yellow-400', dot: 'bg-yellow-400' },
  { label: '离线', color: 'bg-zinc-600 hover:bg-zinc-500', dot: 'bg-zinc-400' },
];

export default function RoomClient({ person }: { person: Person }) {
  const [status, setStatus] = useState(person.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function updateStatus(s: string) {
    if (s === status || saving) return;
    setSaving(true);
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
    setSaving(false);
  }

  async function logout() {
    await fetch('/api/companion/logout', { method: 'POST' });
    window.location.href = '/companion/login';
  }

  const current = STATUSES.find((s) => s.label === status);

  return (
    <div className="max-w-sm mx-auto px-4 pb-16">
      {/* 头像 + 名字 */}
      <div className="flex items-center gap-4 pt-10 pb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
          {person.image ? (
            <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
          )}
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">{person.name}</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${current?.dot || 'bg-zinc-400'}`} />
            <span className="text-zinc-400 text-sm">{status}</span>
            {saved && <span className="text-green-400 text-xs">已更新 ✓</span>}
          </div>
        </div>
      </div>

      {/* 状态切换 */}
      <div className="bg-zinc-900 rounded-2xl p-6">
        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-5">切换状态</p>
        <div className="grid grid-cols-2 gap-3">
          {STATUSES.map((s) => (
            <button
              key={s.label}
              onClick={() => updateStatus(s.label)}
              disabled={saving}
              className={`py-4 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                status === s.label
                  ? `${s.color} text-white ring-2 ring-white/20`
                  : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-zinc-600 text-xs text-center mt-4">如需修改个人资料请联系管理员</p>

      {/* 退出 */}
      <div className="mt-8">
        <button onClick={logout} className="w-full text-zinc-600 hover:text-zinc-400 text-sm py-2 transition-colors">
          退出登录
        </button>
      </div>
    </div>
  );
}
