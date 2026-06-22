import { NextRequest, NextResponse } from 'next/server';
import { getCustomerByDiscordId, createCustomer } from '@/lib/customers';

export async function POST(req: NextRequest) {
  const { discordId, name, pin } = await req.json();
  if (!discordId || !pin) return NextResponse.json({ error: '请填写所有必填项' }, { status: 400 });
  if (pin.length < 6) return NextResponse.json({ error: '密码至少6位' }, { status: 400 });

  const existing = await getCustomerByDiscordId(discordId.trim());
  if (existing) return NextResponse.json({ error: '该 Discord ID 已注册' }, { status: 409 });

  const customer = await createCustomer(name?.trim() || discordId.trim(), discordId.trim(), pin.trim());

  return NextResponse.json({
    discordId: customer.discordId,
    name: customer.name,
    balance: customer.balance,
  });
}
