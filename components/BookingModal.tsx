'use client';
import { useState } from 'react';

type Step = 'idle' | 'payment' | 'done';

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
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  async function handlePaid() {
    setLoading(true);
    const res = await fetch('/api/discord/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setInviteUrl(data.url);
      setStep('done');
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('payment')}
        className="w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-full font-semibold transition-colors"
      >
        💰 预约陪玩
      </button>
    );
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
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white py-2.5 rounded-xl text-sm font-semibold text-center transition-colors"
          >
            加入房间
          </a>
          <button
            onClick={copyLink}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            {copied ? '已复制' : '复制链接'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">预约 {companionName}</h2>
          <button onClick={() => setStep('idle')} className="text-zinc-500 hover:text-white text-2xl leading-none">×</button>
        </div>

        {companionPrice && (
          <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-zinc-400 text-sm">本次费用</span>
            <span className="text-white font-bold text-lg">{companionPrice}</span>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-zinc-400 text-sm">扫码支付宝付款</p>
          <div className="bg-white rounded-2xl p-3 inline-block">
            <img src="/alipay-qr.png" alt="支付宝收款码" className="w-44 h-44 object-contain" />
          </div>
        </div>

        <button
          onClick={handlePaid}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors"
        >
          {loading ? '创建中...' : '✅ 我已付款，进入房间'}
        </button>

        <p className="text-zinc-600 text-xs text-center">付款后点击上方按钮，陪玩师会收到通知</p>
      </div>
    </div>
  );
}
