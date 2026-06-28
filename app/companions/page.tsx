import { getPeople } from '@/lib/notion';
import GalleryCard from '@/components/GalleryCard';

export const revalidate = 60;

export default async function CompanionsList() {
  const people = await getPeople();

  return (
    <main className="min-h-screen bg-[#181818] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-start justify-between gap-6">
          <div>
            <p className="text-[#CCFF00] text-sm font-semibold mb-2 tracking-wide">陪玩列表</p>
            <h1 className="text-white text-4xl md:text-5xl font-black mb-3">找到你的陪伴</h1>
            <p className="text-zinc-500">浏览所有认证陪玩，选择你喜欢的风格</p>
          </div>

          {/* 客服提示 */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-1">
            <p className="text-zinc-400 text-xs text-center whitespace-nowrap">下单前请添加客服微信</p>
            <div className="bg-white p-1.5 rounded-lg">
              <img src="/wechat-qr.png" alt="客服微信" className="w-16 h-16 object-contain" />
            </div>
            <p className="text-zinc-600 text-[10px]">yiding_baofu888</p>
          </div>
        </div>

        {people.length === 0 ? (
          <p className="text-zinc-500 text-center mt-32">暂无陪玩人员</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {people.map((person) => (
              <GalleryCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
