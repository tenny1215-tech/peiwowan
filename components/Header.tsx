import Link from 'next/link';
import { cookies } from 'next/headers';
import AdminLogout from './AdminLogout';

export default async function Header() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

  return (
    <header className="w-full bg-[#161616] border-b border-white/5 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-black text-xl tracking-tight">
          陪我<span className="text-[#CCFF00]">玩.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors">首页</Link>
          <Link href="/companions" className="text-zinc-400 hover:text-white text-sm transition-colors">陪玩列表</Link>
          <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">关于我们</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link href="/admin" className="text-zinc-400 hover:text-white text-sm transition-colors">
                Admin ⚙️
              </Link>
              <AdminLogout />
            </>
          ) : (
            <Link href="/admin/login" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
              管理
            </Link>
          )}
          <Link
            href="/companions"
            className="bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-[#CCFF00] transition-colors"
          >
            立即找陪玩
          </Link>
        </div>
      </div>
    </header>
  );
}
