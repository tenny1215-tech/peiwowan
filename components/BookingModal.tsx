'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'idle' | 'payment' | 'submitted';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    if (!discordId.trim()) { setError('请填写你的 Discord 用户名'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId, customerDiscordId: discordId.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push(`/order/${data.orderId}`);
    } else {
      setError(data.error || '提交失败，请重试');
    }
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('payment')}
        className="w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
      >
        💰 预约陪玩
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-sm p-6 space-y-5">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">预约 {companionName}</h2>
          <button onClick={() => setStep('idle')} className="text-zinc-500 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* 价格 */}
        {companionPrice && (
          <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-zinc-400 text-sm">本次费用</span>
            <span className="text-white font-bold text-lg">{companionPrice}</span>
          </div>
        )}

        {/* 支付宝收款码 */}
        <div className="text-center space-y-2">
          <p className="text-zinc-400 text-sm">扫码支付宝付款</p>
          <div className="bg-white rounded-2xl p-3 inline-block">
            <img src="/alipay-qr.png" alt="支付宝收款码" className="w-40 h-40 object-contain" />
          </div>
          <p className="text-zinc-500 text-xs">付款备注写你的 Discord 用户名</p>
        </div>

        {/* Discord ID 输入 */}
        <div className="space-y-2">
          <label className="text-zinc-400 text-sm">付款后填写你的 Discord 用户名</label>
          <input
            type="text"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            placeholder="例：danny#1234 或 dannyyy"
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-500 placeholder-zinc-600"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        {/* 提交 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors"
        >
          {loading ? '提交中...' : '✅ 我已付款'}
        </button>

        <p className="text-zinc-600 text-xs text-center">付款确认后会通知你加入 Discord 房间</p>
      </div>
    </div>
  );
}
