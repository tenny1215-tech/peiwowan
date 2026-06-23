'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SESSION_KEY = 'peiniwan_member';

export default function MemberHeaderLink() {
  const [discordId, setDiscordId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.discordId) setDiscordId(s.discordId);
      } catch {}
    }
  }, []);

  if (discordId) {
    return (
      <Link href={`/member/${encodeURIComponent(discordId)}`}
        className="text-zinc-400 hover:text-white text-sm transition-colors">
        我的账户
      </Link>
    );
  }

  return (
    <Link href="/member" className="text-zinc-400 hover:text-white text-sm transition-colors">
      用户登录/注册
    </Link>
  );
}
