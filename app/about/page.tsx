import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-[#181818] px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#CCFF00] text-sm font-semibold mb-3 tracking-wide">关于我们</p>
        <h1 className="text-white text-4xl md:text-5xl font-black mb-6">陪你玩.</h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
          我们是一个专为欧洲华人打造的陪玩平台，连接欧洲华人与国内顶尖陪玩。
          无论是游戏陪练、语音聊天，还是解闷陪伴，我们都致力于让每一位在欧洲的华人不再孤单。
        </p>
        <p className="text-zinc-500 text-base leading-relaxed mb-12">
          真人服务，实时匹配，跨越时差。我们的陪玩团队均经过严格筛选，保障服务质量和用户体验。
        </p>
        <Link
          href="/companions"
          className="border border-zinc-500 text-white px-8 py-3.5 rounded-lg font-semibold hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors inline-block"
        >
          浏览陪玩列表 →
        </Link>
      </div>
    </main>
  );
}
