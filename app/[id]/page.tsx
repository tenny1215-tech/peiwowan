import { getPersonById, getPeople } from '@/lib/notion';
import AudioPlayer from '@/components/AudioPlayer';
import ServiceList from '@/components/ServiceList';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const people = await getPeople();
  return people.map((p) => ({ id: p.id }));
}

const gameColors: Record<string, string> = {
  '英雄联盟': 'bg-blue-500',
  '无畏契约': 'bg-red-500',
  '三角洲': 'bg-green-600',
};

const skillColors: Record<string, string> = {
  '上分带队': 'bg-yellow-600',
  '陪练': 'bg-zinc-600',
  '开黑': 'bg-yellow-500',
  '教学': 'bg-pink-500',
};

const statusConfig: Record<string, { color: string; label: string }> = {
  '在线': { color: 'bg-green-500', label: '在线 🟢' },
  '可接单': { color: 'bg-green-500', label: '可接单 🟢' },
  '接单': { color: 'bg-green-500', label: '可接单 🟢' },
  '游戏中': { color: 'bg-yellow-500', label: '游戏中 🎮' },
  '离线': { color: 'bg-zinc-500', label: '离线 ⚫' },
};

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPersonById(id);
  if (!person) return notFound();

  const status = statusConfig[person.status] || { color: 'bg-zinc-500', label: person.status };

  return (
    <div className="min-h-screen bg-black">
      {/* 返回按钮 */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-20 bg-black/60 backdrop-blur text-white text-sm rounded-full px-4 py-2 hover:bg-black/80 transition-colors"
      >
        ← 返回
      </Link>

      {/* 封面图 */}
      <div className="relative h-80 md:h-96 w-full">
        {person.image ? (
          <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-9xl">👤</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5">
          <h1 className="text-white text-3xl font-bold">{person.name}</h1>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {/* 状态 + 地区 */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-white text-sm px-3 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
          {person.location && (
            <span className="text-zinc-400 text-sm">📍 {person.location}</span>
          )}
        </div>

        {/* 语音介绍 */}
        {person.audio && (
          <div>
            <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">语音介绍</p>
            <AudioPlayer src={person.audio} />
          </div>
        )}

        {/* 游戏项目 */}
        {person.games.length > 0 && (
          <div>
            <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">游戏项目</p>
            <div className="flex flex-wrap gap-2">
              {person.games.map((g) => (
                <span key={g} className={`text-white text-sm px-3 py-1 rounded-full ${gameColors[g] || 'bg-zinc-600'}`}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 技能标签 */}
        {person.skills.length > 0 && (
          <div>
            <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">技能标签</p>
            <div className="flex flex-wrap gap-2">
              {person.skills.map((s) => (
                <span key={s} className={`text-white text-sm px-3 py-1 rounded-full ${skillColors[s] || 'bg-zinc-700'}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 个人简介 */}
        {person.bio && (
          <div>
            <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">个人简介</p>
            <p className="text-white text-sm leading-relaxed bg-zinc-900 rounded-2xl p-4">{person.bio}</p>
          </div>
        )}

        {/* 收费 + 联系 */}
        {person.price && (
          <div className="flex items-center justify-between bg-zinc-900 rounded-2xl px-4 py-3">
            <span className="text-zinc-400 text-sm">💰 收费标准</span>
            <span className="text-white font-semibold">{person.price}</span>
          </div>
        )}
        {person.contact && (
          <div className="flex items-center justify-between bg-zinc-900 rounded-2xl px-4 py-3">
            <span className="text-zinc-400 text-sm">💬 联系方式</span>
            <span className="text-white text-sm">{person.contact}</span>
          </div>
        )}

        {/* 服务项目列表 */}
        {person.services.length > 0 && (
          <div className="pt-2 pb-8">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">服务项目</p>
            <ServiceList
              companionId={person.id}
              companionName={person.name}
              companionImage={person.image}
              services={person.services}
            />
          </div>
        )}
      </div>
    </div>
  );
}
