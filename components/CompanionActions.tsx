'use client';

export default function CompanionActions({ companionId }: { companionId: string }) {
  return (
    <div className="flex gap-3">
      <button className="flex-1 border border-pink-500/50 text-pink-400 rounded-full py-2.5 font-semibold hover:bg-pink-500/10 transition-colors text-sm">
        ♡ 关注
      </button>
      <button className="flex-1 bg-pink-500 hover:bg-pink-400 text-white rounded-full py-2.5 font-semibold transition-colors text-sm">
        💬 私讯
      </button>
    </div>
  );
}
