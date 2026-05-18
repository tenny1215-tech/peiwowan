import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-zinc-950 border-b border-zinc-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg">
          🎮 陪玩
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/member/login"
            className="text-zinc-400 hover:text-white text-sm transition-colors px-3 py-1.5"
          >
            会员登录
          </Link>
          <Link
            href="/admin/login"
            className="bg-pink-500 hover:bg-pink-400 text-white text-sm px-4 py-1.5 rounded-full transition-colors"
          >
            管理员登录
          </Link>
        </div>
      </div>
    </header>
  );
}
