export default function OrderRanking() {
  return (
    <div>
      <p className="text-zinc-400 text-xs font-semibold mb-4 tracking-wider">🏆 下单榜</p>

      {/* 前三名领奖台 */}
      <div className="flex items-end justify-center gap-4 mb-4">
        {/* 第2名 */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-lg">
            👤
          </div>
          <span className="text-zinc-600 text-xs">虚位以待</span>
          <span className="text-zinc-600 text-xs">🥈</span>
        </div>
        {/* 第1名 */}
        <div className="flex flex-col items-center gap-1.5 -translate-y-2">
          <span className="text-yellow-400 text-xl">👑</span>
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-yellow-500/40 flex items-center justify-center text-zinc-500 text-lg">
            👤
          </div>
          <span className="text-zinc-600 text-xs">虚位以待</span>
          <span className="text-yellow-500 text-xs">🥇</span>
        </div>
        {/* 第3名 */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-lg">
            👤
          </div>
          <span className="text-zinc-600 text-xs">虚位以待</span>
          <span className="text-zinc-600 text-xs">🥉</span>
        </div>
      </div>

      <p className="text-center text-zinc-600 text-xs">成为第一个上榜的人 ✨</p>
    </div>
  );
}
