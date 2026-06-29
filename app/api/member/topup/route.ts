import { NextRequest, NextResponse } from 'next/server';

const FEISHU_API = 'https://open.feishu.cn/open-apis';
const NOTIFY_OPEN_IDS = [
  'ou_ae7fa64e5ea387d1faceb978afc73ba4', // Tenny
  'ou_10d1a58b2eb0a134bea702066bfe39ff', // 龙浩
];

async function getFeishuToken(): Promise<string> {
  const res = await fetch(`${FEISHU_API}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }),
  });
  const data = await res.json();
  return data.tenant_access_token;
}

export async function POST(req: NextRequest) {
  const { discordId, name, coins, price, pin } = await req.json();
  if (!discordId || !coins) return NextResponse.json({ error: '缺少参数' }, { status: 400 });

  const id = crypto.randomUUID();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peiniwan.vercel.app';

  const params = new URLSearchParams({
    id,
    discordId,
    name: name || discordId,
    coins: String(coins),
    price,
    ...(pin ? { pin } : {}),
  });
  const confirmUrl = `${baseUrl}/api/member/topup/confirm?${params.toString()}`;

  const message = `💰 新充值申请\n\n用户：${name || discordId}（${discordId}）\n套餐：${price} → ${coins}硬币\n\n确认收款后点击链接到账 👇\n${confirmUrl}`;

  try {
    const token = await getFeishuToken();
    await Promise.all(
      NOTIFY_OPEN_IDS.map((open_id) =>
        fetch(`${FEISHU_API}/im/v1/messages?receive_id_type=open_id`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receive_id: open_id,
            msg_type: 'text',
            content: JSON.stringify({ text: message }),
          }),
        })
      )
    );
  } catch (e) {
    console.error('飞书通知失败:', e);
  }

  return NextResponse.json({ ok: true });
}
