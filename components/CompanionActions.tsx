'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatWindow from './ChatWindow';

const SESSION_KEY = 'peiniwan_member';

function getMemberSession() {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function GuestModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-xs text-center space-y-4 shadow-xl">
        <div className="text-3xl">🌸</div>
        <h3 className="text-white font-bold text-base">请先注册账户</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          注册会员后即可关注喜欢的陪玩师，还能充值预约哦～
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <Link
            href="/member/register"
            className="bg-pink-500 hover:bg-pink-400 text-white rounded-full py-2.5 font-semibold text-sm transition-colors"
          >
            立即注册
          </Link>
          <Link
            href="/member"
            className="border border-zinc-600 text-zinc-400 hover:text-white rounded-full py-2.5 text-sm transition-colors"
          >
            已有账户？去登录
          </Link>
        </div>
        <button onClick={onClose} className="absolute top-3 right-4 text-zinc-500 hover:text-white text-lg">✕</button>
      </div>
    </div>
  );
}

export default function CompanionActions({
  companionId,
  companionName,
  companionImage,
}: {
  companionId: string;
  companionName: string;
  companionImage: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // 初始化：检查是否已关注
  useEffect(() => {
    const session = getMemberSession();
    if (!session?.discordId) return;
    fetch(`/api/member/following?discordId=${encodeURIComponent(session.discordId)}`)
      .then(r => r.json())
      .then((list: { id: string }[]) => {
        if (Array.isArray(list)) {
          setFollowed(list.some(c => c.id === companionId));
        }
      })
      .catch(() => {});
  }, [companionId]);

  async function handleFollow() {
    const session = getMemberSession();
    if (!session?.discordId) { setShowModal(true); return; }

    setFollowLoading(true);
    try {
      const res = await fetch('/api/member/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discordId: session.discordId,
          companionId,
          companionName,
          companionImage,
        }),
      });
      const data = await res.json();
      if (res.ok) setFollowed(data.following);
    } catch {}
    setFollowLoading(false);
  }

  function handleChat() {
    const session = getMemberSession();
    if (!session?.discordId) { setShowModal(true); return; }
    setShowChat(true);
  }

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={handleFollow}
          disabled={followLoading}
          className={`flex-1 rounded-full py-2.5 font-semibold text-sm transition-colors disabled:opacity-50 ${
            followed
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
              : 'border border-pink-500/50 text-pink-400 hover:bg-pink-500/10'
          }`}
        >
          {followed ? '❤️ 已关注' : '♡ 关注'}
        </button>
        <button
          onClick={handleChat}
          className="flex-1 bg-pink-500 hover:bg-pink-400 text-white rounded-full py-2.5 font-semibold transition-colors text-sm"
        >
          💬 私讯
        </button>
      </div>

      {showModal && <GuestModal onClose={() => setShowModal(false)} />}

      {showChat && (
        <ChatWindow
          companionId={companionId}
          companionName={companionName}
          companionImage={companionImage}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}
