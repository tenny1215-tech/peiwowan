'use client';
import Link from 'next/link';
import { Person } from '@/lib/notion';

const gameColors: Record<string, string> = {
  '英雄联盟': 'bg-blue-500',
  '无畏契约': 'bg-red-500',
  '三角洲': 'bg-green-600',
};

const statusColors: Record<string, string> = {
  '可接单': 'bg-green-500',
  '忙碌中': 'bg-yellow-500',
  '下线': 'bg-zinc-500',
};

export default function GalleryCard({ person }: { person: Person }) {
  return (
    <Link href={`/${person.id}`}>
      <div className="rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer hover:scale-[1.02] transition-transform duration-200 hover:ring-1 hover:ring-zinc-600">
        {/* 图片区域 */}
        <div className="relative aspect-[3/4]">
          {person.image ? (
            <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-600 text-5xl">👤</span>
            </div>
          )}

          {/* 状态角标 */}
          {person.status && (
            <div className="absolute top-2 left-2">
              <span className={`text-xs text-white px-2 py-0.5 rounded-full ${statusColors[person.status] || 'bg-zinc-500'}`}>
                {person.status}
              </span>
            </div>
          )}

          {/* 有语音提示 */}
          {person.audio && (
            <div className="absolute top-2 right-2 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center">
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* 信息区域 */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm truncate">{person.name}</span>
            {person.location && (
              <span className="text-zinc-400 text-xs ml-1 flex-shrink-0">{person.location}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {person.games.map((game) => (
              <span key={game} className={`text-xs text-white px-2 py-0.5 rounded-full ${gameColors[game] || 'bg-zinc-600'}`}>
                {game}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
