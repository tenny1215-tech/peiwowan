import Link from 'next/link';
import ServiceCards from '@/components/ServiceCards';

export default function Home() {
  return (
    <div className="bg-[#181818] min-h-screen">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="inline-flex items-center border border-zinc-700 rounded-full px-4 py-1.5 mb-10">
          <span className="text-zinc-300 text-sm">欧洲华人专属平台</span>
        </div>

        <h1 className="font-black leading-none mb-8" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          <div className="text-white">专业陪玩</div>
          <div className="text-[#CCFF00]">随叫随到</div>
          <div className="text-zinc-600">人在欧洲，不孤单。</div>
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
          连接欧洲华人与国内顶尖陪玩，游戏、聊天、解闷都可以。真人服务，实时匹配，让每一局都有人陪。
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-16">
          <Link
            href="/companions"
            className="border border-zinc-500 text-white px-8 py-3.5 rounded-lg font-semibold hover:border-white transition-colors"
          >
            浏览陪玩 →
          </Link>
          <Link
            href="/member/topup"
            className="bg-[#CCFF00] text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-[#b8e600] transition-colors"
          >
            💰 充值中心
          </Link>
          <Link
            href="/member"
            className="border border-zinc-700 text-zinc-400 px-8 py-3.5 rounded-lg font-semibold hover:text-white hover:border-zinc-500 transition-colors"
          >
            查看余额
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl p-6">
            <p className="text-[#CCFF00] font-black mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>50+</p>
            <p className="text-zinc-400 text-sm">认证陪玩</p>
          </div>
          <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl p-6">
            <p className="text-[#CCFF00] font-black mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>12€</p>
            <p className="text-zinc-400 text-sm">起步价格/小时</p>
          </div>
          <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl p-6">
            <p className="text-[#CCFF00] font-black mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>7×24</p>
            <p className="text-zinc-400 text-sm">跨时区服务</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6"><div className="h-px bg-zinc-800/60" /></div>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[#CCFF00] text-sm font-semibold mb-3 tracking-wide">我们的服务</p>
        <h2 className="text-white text-4xl md:text-5xl font-black mb-3">不止是游戏</h2>
        <p className="text-zinc-500 text-base mb-12">每一种需要陪伴的时刻，我们都有人在</p>

        <ServiceCards />
      </section>

      <div className="max-w-6xl mx-auto px-6"><div className="h-px bg-zinc-800/60" /></div>

      {/* How to start */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[#CCFF00] text-sm font-semibold mb-3 tracking-wide">怎么开始</p>
        <h2 className="text-white text-4xl md:text-5xl font-black mb-3">三步搞定</h2>
        <p className="text-zinc-500 text-base mb-16">从浏览到开始陪玩，最快5分钟</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <div className="w-14 h-14 rounded-full border-2 border-[#CCFF00] flex items-center justify-center mb-6">
              <span className="text-[#CCFF00] font-black text-sm">01</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-4">浏览陪玩主页</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              查看每位陪玩的照片、语音介绍、游戏擅长和价格，找到你喜欢的风格。
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-full border-2 border-[#CCFF00] flex items-center justify-center mb-6">
              <span className="text-[#CCFF00] font-black text-sm">02</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-4">充值开通账户</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              选择套餐充值，余额到账后即可预约，1币1元，余额永久有效。
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-full border-2 border-[#CCFF00] flex items-center justify-center mb-6">
              <span className="text-[#CCFF00] font-black text-sm">03</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-4">开始愉快陪玩</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              约定时间上线，语音开黑或聊天，不满意可以随时反馈，我们保障服务质量。
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-white font-black text-xl">
            陪你<span className="text-[#CCFF00]">玩.</span>
          </Link>
          <div className="flex items-center gap-2 text-zinc-600 text-sm">
            <span>专为欧洲华人打造 · 跨越时差的陪伴</span>
            <span>|</span>
            <Link href="/admin/login" className="hover:text-zinc-400 transition-colors">管理登录</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
