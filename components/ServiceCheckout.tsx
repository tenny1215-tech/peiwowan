'use client';
import { useState } from 'react';
import { Service } from '@/lib/notion';

type Step = 'confirm' | 'login' | 'done';

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
  const [step, setStep] = useState<Step>('confirm');
  const [qty, setQty] = useState(1);
  const [discordId, setDiscordId] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');

  const total = service.price * qty;

  async function handleQueryBalance() {
    if (!discordId.trim()) { setError('请输入 Discord 用户名'); return; }
    setLoading(true); setError('');
    const res = await fetch(`/api/member/${encodeURIComponent(discordId.trim())}`);
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
      setStep('login');
    } else {
      setError('账户不存在，请先充值');
    }
  }

  async function handleBook() {
    setLoading(true); setError('');
    const res = await fetch('/api/discord/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId, discordId: discordId.trim(), cost: total }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setInviteUrl(data.url); setStep('done'); }
    else setError(data.error || '预约失败，请重试');
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
          {step === 'done' ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-3xl">🎮</p>
              <p className="text-white font-bold">预约成功！</p>
              <p className="text-zinc-400 text-sm">已通知陪玩师，等她加入～</p>
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 rounded-2xl font-semibold text-center transition-colors">
                加入 Discord 房间
              </a>
            </div>
          ) : (
            <>
              {/* 服务信息 */}
              <div className="bg-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">服务单价</span>
                  <span className="text-white font-semibold">{service.price} 硬币/{service.unit}</span>
                </div>

                {/* 数量选择 */}
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

              {/* 余额信息（登录后显示）*/}
              {step === 'login' && balance !== null && (
                <div className="bg-zinc-800 rounded-2xl px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">当前余额</span>
                    <span className="text-white">{balance} 硬币</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">支付后余额</span>
                    <span className={balance - total >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {balance - total} 硬币
                    </span>
                  </div>
                </div>
              )}

              {/* Discord ID 输入 */}
              {step === 'confirm' && (
                <div className="space-y-2">
                  <input
                    type="text" value={discordId}
                    onChange={e => setDiscordId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleQueryBalance()}
                    placeholder="输入你的 Discord 用户名"
                    className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button onClick={handleQueryBalance} disabled={loading}
                    className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors">
                    {loading ? '查询中...' : '查询余额'}
                  </button>
                  <p className="text-center">
                    <a href="/member/topup" className="text-zinc-500 hover:text-white text-sm transition-colors">
                      还没有余额？去充值 →
                    </a>
                  </p>
                </div>
              )}

              {step === 'login' && (
                <>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  {balance !== null && balance < total ? (
                    <div className="space-y-2">
                      <p className="text-red-400 text-sm text-center">余额不足</p>
                      <a href="/member/topup"
                        className="block w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-2xl font-semibold text-center transition-colors">
                        去充值
                      </a>
                    </div>
                  ) : (
                    <button onClick={handleBook} disabled={loading}
                      className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors">
                      {loading ? '预约中...' : `确认支付 ${total} 硬币`}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
