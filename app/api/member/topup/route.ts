import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const FEISHU_API = 'https://open.feishu.cn/open-apis';
const TENNY_OPEN_ID = 'ou_ae7fa64e5ea387d1faceb978afc73ba4';

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
  const { discordId, name, coins, price } = await req.json();
  if (!discordId || !coins) return NextResponse.json({ error: '缺少参数' }, { status: 400 });

  const id = Math.random().toString(36).slice(2, 10);
  const request = { id, discordId, name, coins, price, createdAt: new Date().toISOString() };

  await put(`topups/${id}.json`, JSON.stringify(request), {
    access: 'public',
    addRandomSuffix: false,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peiwowan-xk56-kappa.vercel.app';
  const confirmUrl = `${baseUrl}/api/member/topup/${id}/confirm`;

  const message = `💰 新充值申请\n\n用户：${name}（${discordId}）\n套餐：${price} → ${coins}币\n\n确认收款后点击链接到账 👇\n${confirmUrl}`;

  const token = await getFeishuToken().catch(() => null);
  if (token) {
    await fetch(`${FEISHU_API}/im/v1/messages?receive_id_type=open_id`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receive_id: TENNY_OPEN_ID,
        msg_type: 'text',
        content: JSON.stringify({ text: message }),
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
