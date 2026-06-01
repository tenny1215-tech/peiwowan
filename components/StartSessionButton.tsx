'use client';
import { useState } from 'react';

export default function StartSessionButton({
  companionName,
  companionId,
}: {
  companionName: string;
  companionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; channelName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleStart() {
    setLoading(true);
    const res = await fetch('/api/discord/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionName, companionId }),
    });
    const data = await res.json();
    if (res.ok) setResult(data);
    setLoading(false);
  }

  function copyLink() {
    if (!result) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (result) {
    return (
      <div className="bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎮</span>
          <div>
            <p className="text-white text-sm font-semibold">已通知陪玩师，等她加入～</p>
            <p className="text-zinc-400 text-xs">{result.channelName} · 24小时有效</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={result.url}
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
        <p className="text-zinc-500 text-xs">陪玩师会收到通知，进入后即可开始</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span> 创建中...
        </>
      ) : (
        <>🎮 开始陪玩（Discord）</>
      )}
    </button>
  );
}
