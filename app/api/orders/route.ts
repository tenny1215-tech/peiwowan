import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';
import { getPersonById } from '@/lib/notion';

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

async function sendFeishuNotification(order: {
  id: string;
  companionName: string;
  companionPrice: string;
  customerDiscordId: string;
  createdAt: string;
}) {
  const token = await getFeishuToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peiwowan-xk56-kappa.vercel.app';
  const confirmUrl = `${baseUrl}/api/orders/${order.id}/confirm`;
  const time = new Date(order.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

  const message = `🎮 新订单待确认\n\n陪玩师：${order.companionName}\n客户 Discord：${order.customerDiscordId}\n金额：${order.companionPrice}\n时间：${time}\n\n点击确认收款 👇\n${confirmUrl}`;

  await fetch(`${FEISHU_API}/im/v1/messages?receive_id_type=open_id`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      receive_id: TENNY_OPEN_ID,
      msg_type: 'text',
      content: JSON.stringify({ text: message }),
    }),
  });
}

export async function POST(req: NextRequest) {
  const { companionId, customerDiscordId } = await req.json();
  if (!companionId || !customerDiscordId) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }

  const person = await getPersonById(companionId);
  if (!person) return NextResponse.json({ error: '陪玩师不存在' }, { status: 404 });

  const order = await createOrder({
    companionId,
    companionName: person.name,
    companionPrice: person.price,
    customerDiscordId,
  });

  // 飞书通知失败不影响订单创建
  sendFeishuNotification(order).catch((e) => console.error('飞书通知失败:', e));

  return NextResponse.json({ orderId: order.id });
}
