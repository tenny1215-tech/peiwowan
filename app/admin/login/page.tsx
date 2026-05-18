export default function AdminLogin() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">管理员登录</h1>
          <p className="text-zinc-500 text-sm mt-1">陪玩人员管理后台</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="账号"
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-zinc-500"
          />
          <input
            type="password"
            placeholder="密码"
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-zinc-500"
          />
          <button className="w-full bg-pink-500 hover:bg-pink-400 text-white py-3 rounded-xl font-semibold transition-colors">
            登录
          </button>
        </div>
        <p className="text-zinc-600 text-xs text-center">功能开发中，敬请期待</p>
      </div>
    </main>
  );
}
