import { getPersonById, getPeople } from '@/lib/notion';
import ServiceList from '@/components/ServiceList';
import CompanionActions from '@/components/CompanionActions';
import TipButton from '@/components/TipButton';
import OrderRanking from '@/components/OrderRanking';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const people = await getPeople();
    return people.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

const gameColors: Record<string, string> = {
  '英雄联盟': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  '无畏契约': 'bg-red-500/20 text-red-300 border border-red-500/30',
  '三角洲': 'bg-green-500/20 text-green-300 border border-green-500/30',
};

const skillColors: Record<string, string> = {
  '上分带队': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  '陪练': 'bg-zinc-600/40 text-zinc-300 border border-zinc-500/30',
  '开黑': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  '教学': 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
};

const statusConfig: Record<string, { color: string; label: string; dot: string }> = {
  '可接单': { color: 'bg-green-500/20 text-green-400 border border-green-500/30', label: '可接单', dot: 'bg-green-400' },
  '接单':   { color: 'bg-green-500/20 text-green-400 border border-green-500/30', label: '可接单', dot: 'bg-green-400' },
  '游戏中': { color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', label: '游戏中', dot: 'bg-yellow-400' },
  '离线':   { color: 'bg-zinc-500/20 text-zinc-500 border border-zinc-600/30', label: '离线', dot: 'bg-zinc-500' },
};

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let person;
  try {
    person = await getPersonById(id);
  } catch (err) {
    console.error('[ProfilePage] getPersonById error:', err);
    return <div className="min-h-screen bg-black text-white p-8">加载失败，请刷新重试</div>;
  }
  if (!person) return notFound();

  const status = statusConfig[person.status] || {
    color: 'bg-zinc-500/20 text-zinc-400 border border-zinc-600/30',
    label: person.status,
    dot: 'bg-zinc-500',
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 返回按钮（移动端） */}
      <Link
        href="/"
        className="md:hidden fixed top-4 left-4 z-20 bg-black/60 backdrop-blur text-white text-sm rounded-full px-4 py-2"
      >
        ← 返回
      </Link>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <div className="md:flex md:gap-6 md:items-start">

          {/* 左列 */}
          <div className="md:w-[38%] md:flex-shrink-0">

            {/* 照片 */}
            <div className="relative rounded-2xl overflow-hidden h-[380px] md:h-[420px]">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <span className="text-zinc-600 text-8xl">👤</span>
                </div>
              )}
              <Link
                href="/"
                className="hidden md:flex absolute top-4 left-4 z-20 bg-black/50 backdrop-blur text-white text-sm rounded-full px-4 py-2 hover:bg-black/70 transition-colors"
              >
                ← 返回
              </Link>
            </div>

            {/* 图片下方卡片 */}
            <div className="bg-zinc-900/80 border border-zinc-800 border-t-0 rounded-b-2xl p-4 space-y-4 mb-6 md:mb-0">

              {/* 简介 */}
              {person.bio && (
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4">
                  {person.bio}
                </p>
              )}

              {/* 打赏 */}
              <TipButton />

              {/* 分割线 */}
              <div className="border-t border-zinc-800" />

              {/* 下单榜 */}
              <OrderRanking />
            </div>
          </div>

          {/* 右列 */}
          <div className="flex-1 space-y-5">

            {/* 名字 + 状态 + 地区 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-white text-2xl md:text-3xl font-bold">{person.name}</h1>
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${person.status !== '离线' ? 'animate-pulse' : ''}`} />
                  {status.label}
                </span>
              </div>
              {person.location && (
                <p className="text-zinc-500 text-sm">📍 {person.location}</p>
              )}
            </div>

            {/* 关注 + 私讯 */}
            <CompanionActions
              companionId={person.id}
              companionName={person.name}
              companionImage={person.image}
            />

            {/* 游戏项目 */}
            {person.games.length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">游戏项目</p>
                <div className="flex flex-wrap gap-2">
                  {person.games.map((g) => (
                    <span key={g} className={`text-sm px-3 py-1 rounded-full ${gameColors[g] || 'bg-zinc-700/50 text-zinc-300 border border-zinc-600/30'}`}>
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
                    <span key={s} className={`text-sm px-3 py-1 rounded-full ${skillColors[s] || 'bg-zinc-700/50 text-zinc-300 border border-zinc-600/30'}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 服务项目 */}
            {person.services.length > 0 && (
              <div className="pb-10">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">服务项目</p>
                <ServiceList
                  companionId={person.id}
                  companionName={person.name}
                  companionImage={person.image}
                  companionStatus={person.status}
                  services={person.services}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
