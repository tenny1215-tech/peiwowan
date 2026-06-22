import Link from 'next/link';
import { cookies } from 'next/headers';
import AdminLogout from './AdminLogout';
import MemberHeaderLink from './MemberHeaderLink';

export default async function Header() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';
  const isCompanion = !!cookieStore.get('companion_session')?.value;

  return (
    <header className="w-full bg-[#161616] border-b border-white/5 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-black text-xl tracking-tight">
          陪你<span className="text-[#CCFF00]">玩.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors">首页</Link>
          <Link href="/companions" className="bg-[#CCFF00] text-black text-sm font-semibold px-3 py-1 rounded-full hover:bg-[#b8e600] transition-colors">陪玩列表</Link>
          <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">关于我们</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isCompanion ? (
            <Link href="/companion/room" className="text-zinc-400 hover:text-white text-sm transition-colors">
              我的房间
            </Link>
          ) : (
            <Link href="/companion/login" className="text-zinc-400 hover:text-white text-sm transition-colors">
              陪玩登录
            </Link>
          )}
          <span className="text-zinc-700">|</span>
          <MemberHeaderLink />
          {isAdmin && (
            <>
              <span className="text-zinc-700">|</span>
              <AdminLogout />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
