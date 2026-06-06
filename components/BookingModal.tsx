'use client';
import { useState } from 'react';
import Link from 'next/link';

type Step = 'idle' | 'login' | 'confirm' | 'done';

function extractCoins(price: string): number {
  const match = price.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export default function BookingModal({
  companionName,
  companionId,
  companionPrice,
}: {
  companionName: string;
  companionId: string;
  companionPrice: string;
}) {
  const [step, setStep] = useState<Step>('idle');
  const [discordId, setDiscordId] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const cost = extractCoins(companionPrice);

  async function handleLogin() {
    if (!discordId.trim()) { setError('请输入 Discord 用户名'); return; }
    setLoading(true);
    setError('');
    const res = await fetch(`/api/member/${encodeURIComponent(discordId.trim())}`);
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
      setStep('confirm');
    } else {
      setError('账户不存在，请先充值');
    }
  }

  async function handleBook() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/discord/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId, discordId: discordId.trim(), cost }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setInviteUrl(data.url);
      setStep('done');
    } else {
      setError(data.error || '预约失败，请重试');
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === 'done') {
    return (
      <div className="bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <div>
            <p className="text-white text-sm font-semibold">已通知陪玩师，等她加入～</p>
            <p className="text-zinc-400 text-xs">24小时有效</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white py-2.5 rounded-xl text-sm font-semibold text-center transition-colors">
            加入房间
          </a>
          <button onClick={copyLink}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
            {copied ? '已复制' : '复制链接'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'idle') {
    return (
      <button onClick={() => setStep('login')}
        className="w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-full font-semibold transition-colors">
        🎮 预约陪玩
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">预约 {companionName}</h2>
          <button onClick={() => { setStep('idle'); setError(''); }} className="text-zinc-500 hover:text-white text-2xl leading-none">×</button>
        </div>

        {companionPrice && (
          <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-zinc-400 text-sm">本次费用</span>
            <span className="text-white font-bold">{companionPrice}</span>
          </div>
        )}

        {step === 'login' && (
          <>
            <div className="space-y-3">
              <label className="text-zinc-400 text-sm">输入你的 Discord 用户名</label>
              <input
                type="text"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="你的 Discord 用户名"
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
            <button onClick={handleLogin} disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors">
              {loading ? '查询中...' : '查询余额'}
            </button>
            <div className="text-center">
              <Link href="/member/topup" className="text-zinc-500 hover:text-white text-sm transition-colors">
                还没有余额？去充值 →
              </Link>
            </div>
          </>
        )}

        {step === 'confirm' && balance !== null && (
          <>
            <div className="bg-zinc-800 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">当前余额</span>
                <span className="text-white font-semibold">{balance} 币</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">本次扣除</span>
                <span className="text-red-400 font-semibold">-{cost} 币</span>
              </div>
              <div className="border-t border-zinc-700 pt-2 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">预约后余额</span>
                <span className={`font-bold ${balance - cost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {balance - cost} 币
                </span>
              </div>
            </div>

            {balance < cost ? (
              <>
                <p className="text-red-400 text-sm text-center">余额不足，请先充值</p>
                <Link href="/member/topup"
                  className="block w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-2xl font-semibold text-center transition-colors">
                  去充值
                </Link>
              </>
            ) : (
              <>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button onClick={handleBook} disabled={loading}
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors">
                  {loading ? '创建中...' : '✅ 确认预约'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
