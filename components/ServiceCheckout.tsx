'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service } from '@/lib/notion';

type Step = 'login' | 'confirm' | 'done';

const SESSION_KEY = 'peiwowan_member';

interface Session {
  discordId: string;
  name: string;
  balance: number;
}

export default function ServiceCheckout({
  companionId,
  companionName,
  companionImage,
  service,
  onClose,
}: {
  companionId: string;
  companionName: string;
  companionImage: string;
  service: Service;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>('login');
  const [session, setSession] = useState<Session | null>(null);
  const [qty, setQty] = useState(1);
  const [discordId, setDiscordId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');

  const total = service.price * qty;

  // 检查本地登录状态，并刷新最新余额
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return;
    try {
      const s: Session = JSON.parse(saved);
      setSession(s);
      setStep('confirm');
      // 从服务器拉最新余额
      fetch(`/api/member/${encodeURIComponent(s.discordId)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            const updated = { ...s, balance: data.balance };
            localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
            setSession(updated);
          }
        })
        .catch(() => {});
    } catch {}
  }, []);

  async function handleLogin() {
    if (!discordId.trim() || !pin.trim()) { setError('请填写 Discord ID 和 PIN'); return; }
    setLoading(true); setError('');
    const res = await fetch('/api/member/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discordId: discordId.trim(), pin: pin.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      const s: Session = { discordId: data.discordId, name: data.name, balance: data.balance };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
      setStep('confirm');
    } else {
      setError(data.error || '登录失败');
    }
  }

  async function handleBook() {
    if (!session) return;
    setLoading(true); setError('');
    const res = await fetch('/api/discord/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId, discordId: session.discordId, cost: total }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      // 更新本地余额
      const updated = { ...session, balance: session.balance - total };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setSession(updated);
      setInviteUrl(data.url);
      setStep('done');
    } else {
      setError(data.error || '预约失败，请重试');
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setStep('login');
    setDiscordId(''); setPin('');
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-sm overflow-hidden">

        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {companionImage ? (
              <img src={companionImage} alt={companionName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">👤</div>
            )}
            <div>
              <p className="text-white font-semibold text-sm">{companionName}</p>
              <p className="text-zinc-400 text-xs">{service.game} · {service.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">

          {/* 完成状态 */}
          {step === 'done' && (
            <div className="text-center space-y-4 py-4">
              <p className="text-3xl">🎮</p>
              <p className="text-white font-bold">预约成功！</p>
              <p className="text-zinc-400 text-sm">已通知陪玩师，等她加入～</p>
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 rounded-2xl font-semibold text-center transition-colors">
                加入 Discord 房间
              </a>
            </div>
          )}

          {/* 登录状态 */}
          {step === 'login' && (
            <div className="space-y-3">
              <p className="text-zinc-400 text-sm text-center">登录账户后预约</p>
              <input type="text" value={discordId} onChange={e => setDiscordId(e.target.value)}
                placeholder="Discord 用户名" autoCapitalize="none"
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600" />
              <input type="password" value={pin} onChange={e => setPin(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="PIN 码" maxLength={6}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600" />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleLogin} disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors">
                {loading ? '登录中...' : '登录'}
              </button>
              <p className="text-center text-zinc-500 text-sm">
                还没注册？
                <Link href="/member/topup" className="text-pink-400 hover:text-pink-300 ml-1 transition-colors">
                  去充值注册 →
                </Link>
              </p>
            </div>
          )}

          {/* 确认支付状态 */}
          {step === 'confirm' && session && (
            <>
              {/* 服务信息 */}
              <div className="bg-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">服务单价</span>
                  <span className="text-white font-semibold">{service.price} 硬币/{service.unit}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">单数（{service.unit}）</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold transition-colors">−</button>
                    <span className="text-white font-bold w-6 text-center">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)}
                      className="w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold transition-colors">+</button>
                  </div>
                </div>
                <div className="border-t border-zinc-700 pt-3 flex justify-between">
                  <span className="text-zinc-400 text-sm">合计</span>
                  <span className="text-pink-400 font-bold">{total} 硬币</span>
                </div>
              </div>

              {/* 账户信息 */}
              <div className="bg-zinc-800 rounded-2xl px-4 py-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">账户</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{session.name || session.discordId}</span>
                    <button onClick={logout} className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">退出</button>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">当前余额</span>
                  <span className="text-white">{session.balance} 硬币</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">支付后余额</span>
                  <span className={session.balance - total >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {session.balance - total} 硬币
                  </span>
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              {session.balance < total ? (
                <div className="space-y-2">
                  <p className="text-red-400 text-sm text-center">余额不足</p>
                  <Link href="/member/topup"
                    className="block w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-2xl font-semibold text-center transition-colors">
                    去充值
                  </Link>
                </div>
              ) : (
                <button onClick={handleBook} disabled={loading}
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors">
                  {loading ? '预约中...' : `确认支付 ${total} 硬币`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
