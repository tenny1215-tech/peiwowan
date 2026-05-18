import { getPeople } from '@/lib/notion';
import Link from 'next/link';
import AdminDeleteButton from '@/components/AdminDeleteButton';

export const revalidate = 0;

const statusColors: Record<string, string> = {
  '可接单': 'text-green-400',
  '忙碌中': 'text-yellow-400',
  '下线': 'text-zinc-500',
};

export default async function AdminDashboard() {
  const people = await getPeople();

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">管理面板</h1>
            <p className="text-zinc-500 text-sm mt-1">共 {people.length} 名陪玩人员</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/new"
              className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              + 添加人员
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {people.map((person) => (
            <div key={person.id} className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4">
              {/* 头像 */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                {person.image ? (
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                )}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{person.name}</span>
                  <span className={`text-xs ${statusColors[person.status] || 'text-zinc-500'}`}>
                    {person.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {person.games.map((g) => (
                    <span key={g} className="text-zinc-400 text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{g}</span>
                  ))}
                  {person.location && (
                    <span className="text-zinc-500 text-xs">📍 {person.location}</span>
                  )}
                  {person.price && (
                    <span className="text-zinc-500 text-xs">💰 {person.price}</span>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/edit/${person.id}`}
                  className="text-zinc-400 hover:text-white text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  编辑
                </Link>
                <AdminDeleteButton id={person.id} name={person.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
