'use client';

export default function TipButton() {
  return (
    <button
      onClick={() => alert('打赏功能即将上线～')}
      className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white rounded-xl py-2.5 font-semibold text-sm transition-all"
    >
      🎁 打赏
    </button>
  );
}
