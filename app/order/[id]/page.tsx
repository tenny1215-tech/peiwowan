'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'notfound'>('pending');
  const [inviteUrl, setInviteUrl] = useState('');

  useEffect(() => {
    const check = async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) { setStatus('notfound'); return; }
      const data = await res.json();
      setStatus(data.status);
      if (data.discordInviteUrl) setInviteUrl(data.discordInviteUrl);
    };
    check();
    const timer = setInterval(check, 5000);
    return () => clearInterval(timer);
  }, [id]);

  if (status === 'notfound') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-white text-lg">订单不存在</p>
        </div>
      </div>
    );
  }

  if (status === 'confirmed' && inviteUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <p className="text-5xl">🎮</p>
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">付款已确认！</h1>
            <p className="text-zinc-400 text-sm">点击下方进入语音房间，陪玩师已在等你</p>
          </div>
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-2xl text-lg font-semibold transition-colors"
          >
            加入 Discord 房间
          </a>
          <p className="text-zinc-600 text-xs">链接24小时有效</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-zinc-700 border-t-pink-500 animate-spin" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold mb-2">等待确认收款</h1>
          <p className="text-zinc-400 text-sm">我们收到你的付款通知了，通常5分钟内处理</p>
          <p className="text-zinc-600 text-xs mt-2">页面会自动更新，不需要刷新</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-left space-y-2">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">订单号</p>
          <p className="text-white font-mono text-sm">{id}</p>
        </div>
      </div>
    </div>
  );
}
