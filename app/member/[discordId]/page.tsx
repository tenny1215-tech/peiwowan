import { getCustomerByDiscordId } from '@/lib/customers';
import Link from 'next/link';
import MemberLogout from '@/components/MemberLogout';

export const revalidate = 0;

export default async function MemberDashboard({ params }: { params: Promise<{ discordId: string }> }) {
  const { discordId } = await params;
  const decoded = decodeURIComponent(discordId);
  const customer = await getCustomerByDiscordId(decoded);

  if (!customer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <p className="text-4xl">⏳</p>
          <h1 className="text-white text-xl font-bold">账号确认中</h1>
          <p className="text-zinc-400 text-sm">充值申请正在处理，确认收款后账号自动激活</p>
          <p className="text-zinc-600 text-xs">通常 5 分钟内处理完成</p>
          <Link href="/member/topup" className="block text-pink-400 text-sm hover:text-pink-300 transition-colors">
            返回充值页
          </Link>
        </div>
      </div>
    );
  }

  const historyLines = customer.history
    ? customer.history.split('\n').filter(Boolean).reverse()
    : [];

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-sm mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <MemberLogout />
          <Link href="/member/topup" className="bg-pink-500 hover:bg-pink-400 text-white text-sm px-4 py-2 rounded-full font-semibold transition-colors">
            + 充值
          </Link>
        </div>

        <div className="text-center py-4">
          <p className="text-zinc-400 text-sm mb-1">你好，{customer.name || decoded}</p>
          <p className="text-white text-6xl font-bold"><span className="text-3xl align-top mt-2 inline-block">¥</span>{customer.balance}</p>
          <p className="text-zinc-500 text-sm mt-1">当前余额（硬币）</p>
        </div>

        <Link
          href="/companions"
          className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 rounded-2xl font-semibold text-center transition-colors"
        >
          🎮 去预约陪玩
        </Link>

        <div className="space-y-3">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">充值记录</p>
          {historyLines.length === 0 ? (
            <p className="text-zinc-600 text-sm">暂无记录</p>
          ) : (
            historyLines.map((line, i) => (
              <div key={i} className="bg-zinc-900 rounded-2xl px-4 py-3">
                <p className="text-white text-sm">{line}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
