'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FollowedCompanion {
  id: string;
  name: string;
  image: string;
}

export default function FollowingList({ discordId }: { discordId: string }) {
  const [list, setList] = useState<FollowedCompanion[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/member/following?discordId=${encodeURIComponent(discordId)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setList(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [discordId]);

  if (!loaded) return null;

  return (
    <div className="space-y-3">
      <p className="text-zinc-500 text-xs uppercase tracking-wider">我的关注</p>
      {list.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl px-4 py-5 text-center">
          <p className="text-zinc-600 text-sm">还没有关注任何陪玩师</p>
          <Link href="/companions" className="text-pink-400 text-xs hover:text-pink-300 mt-1 block transition-colors">
            去逛逛陪玩列表 →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(c => (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl px-4 py-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">👤</div>
                )}
              </div>
              <span className="text-white text-sm font-medium flex-1">{c.name}</span>
              <span className="text-zinc-600 text-xs">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
