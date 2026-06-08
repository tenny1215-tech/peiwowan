import { NextRequest, NextResponse } from 'next/server';
import { getCustomerByDiscordId } from '@/lib/customers';

export async function POST(req: NextRequest) {
  const { discordId, pin } = await req.json();
  if (!discordId || !pin) return NextResponse.json({ error: '请填写 Discord ID 和 PIN' }, { status: 400 });

  const customer = await getCustomerByDiscordId(discordId.trim());
  if (!customer) return NextResponse.json({ error: '账户不存在，请先充值注册' }, { status: 404 });
  if (customer.pin !== pin.trim()) return NextResponse.json({ error: 'PIN 码错误' }, { status: 401 });

  return NextResponse.json({
    name: customer.name,
    discordId: customer.discordId,
    balance: customer.balance,
  });
}
