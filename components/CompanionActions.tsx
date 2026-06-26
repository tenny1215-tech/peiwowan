'use client';

import { useState } from 'react';
import Link from 'next/link';

function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return !!(localStorage.getItem('member_discord_id') || document.cookie.includes('companion_key=') || document.cookie.includes('admin_token='));
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

export default function CompanionActions({ companionId }: { companionId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [followed, setFollowed] = useState(false);

  function handleFollow() {
    if (!isLoggedIn()) {
      setShowModal(true);
      return;
    }
    setFollowed(true);
  }

  function handleChat() {
    if (!isLoggedIn()) {
      setShowModal(true);
      return;
    }
    // 私讯功能即将接入
    alert('私讯功能即将上线～');
  }

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={handleFollow}
          className={`flex-1 rounded-full py-2.5 font-semibold text-sm transition-colors ${
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
    </>
  );
}
