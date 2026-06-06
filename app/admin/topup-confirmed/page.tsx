import Link from 'next/link';

export default async function TopupConfirmedPage({ searchParams }: { searchParams: Promise<{ name: string; coins: string; discord: string }> }) {
  const { name, coins, discord } = await searchParams;
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <p className="text-5xl">✅</p>
        <h1 className="text-white text-2xl font-bold">充值已确认</h1>
        <div className="bg-zinc-900 rounded-2xl p-4 text-left space-y-2">
          <p className="text-zinc-400 text-sm">用户：<span className="text-white">{decodeURIComponent(name || '')}（{decodeURIComponent(discord || '')}）</span></p>
          <p className="text-zinc-400 text-sm">到账：<span className="text-green-400 font-bold">+{coins}币</span></p>
        </div>
        <Link href="/admin" className="block text-zinc-500 hover:text-white text-sm transition-colors">
          返回管理面板
        </Link>
      </div>
    </div>
  );
}
