'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SESSION_KEY = 'peiniwan_member';

const PACKAGES = [
  { coins: 99, price: '¥99', label: '基础包', qr: '/qr-99.png' },
  { coins: 199, price: '¥199', label: '超值包', qr: '/qr-199.png' },
  { coins: 299, price: '¥299', label: '豪华包', qr: '/qr-299.png' },
];

const FEISHU_URL = 'https://applink.feishu.cn/client/chat/open?openId=ou_ae7fa64e5ea387d1faceb978afc73ba4';

type Step = 'select' | 'pay' | 'done';

export default function TopupPage() {
  const [step, setStep] = useState<Step>('select');
  const [selected, setSelected] = useState<typeof PACKAGES[0] | null>(null);
  const [discordId, setDiscordId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) {
      router.replace('/member/register');
      return;
    }
    try {
      const s = JSON.parse(saved);
      if (s.discordId) setDiscordId(s.discordId);
    } catch {}
    setChecking(false);
  }, [router]);

  if (checking) return <div className="min-h-screen bg-black" />;

  async function handleSubmit() {
    if (!discordId.trim()) { setError('请填写 Discord ID'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/member/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discordId: discordId.trim(),
        name: discordId.trim(),
        coins: selected!.coins,
        price: selected!.price,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setStep('done');
    } else {
      setError('提交失败，请重试');
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-5">
          <p className="text-5xl">✅</p>
          <h1 className="text-white text-2xl font-bold">充值申请已提交</h1>
          <p className="text-zinc-400 text-sm">我们确认收款后会立即到账，通常5分钟内处理</p>
          <Link
            href={`/member/${encodeURIComponent(discordId)}`}
            className="block w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-2xl font-semibold transition-colors"
          >
            查看我的账户
          </Link>
          <a href={FEISHU_URL} target="_blank" rel="noopener noreferrer"
            className="block text-zinc-500 text-xs underline hover:text-zinc-300 transition-colors">
            遇到问题？联系客服
          </a>
        </div>
      </div>
    );
  }

  if (step === 'pay' && selected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full space-y-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('select')} className="text-zinc-500 hover:text-white">←</button>
            <h1 className="text-white font-bold text-lg">扫码付款</h1>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-zinc-400">{selected.label}</span>
            <span className="text-white font-bold">{selected.price} → {selected.coins} 硬币</span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-zinc-400 text-sm">支付宝扫码付款</p>
            <div className="bg-white rounded-2xl p-3 inline-block">
              <img src={selected.qr} alt="支付宝收款码" className="w-44 h-44 object-contain" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-zinc-900 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-zinc-500 text-sm">充值账户</span>
              <span className="text-white text-sm font-mono">{discordId}</span>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-colors"
            >
              {loading ? '提交中...' : '✅ 我已付款'}
            </button>
            <a href={FEISHU_URL} target="_blank" rel="noopener noreferrer"
              className="block text-center text-zinc-500 text-xs underline hover:text-zinc-300 transition-colors">
              遇到问题？联系客服
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/member" className="text-zinc-500 hover:text-white">←</Link>
          <h1 className="text-white font-bold text-xl">充值</h1>
        </div>

        <p className="text-zinc-400 text-sm">选择充值套餐，1硬币 = 1元，可用于预约陪玩</p>

        <div className="space-y-3">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.coins}
              onClick={() => { setSelected(pkg); setStep('pay'); }}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-pink-500 text-white rounded-2xl p-4 flex items-center justify-between transition-all"
            >
              <div className="text-left">
                <p className="font-semibold">{pkg.label}</p>
                <p className="text-zinc-400 text-sm">{pkg.coins} 硬币</p>
              </div>
              <p className="text-pink-400 font-bold text-lg">{pkg.price}</p>
            </button>
          ))}
        </div>

        <p className="text-zinc-600 text-xs text-center">充值后余额永久有效</p>
      </div>
    </div>
  );
}
