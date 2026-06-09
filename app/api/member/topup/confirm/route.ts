import { NextRequest, NextResponse } from 'next/server';
import { getCustomerByDiscordId, createCustomer, addBalance } from '@/lib/customers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const discordId = searchParams.get('discordId');
  const name = searchParams.get('name') || discordId || '';
  const coins = parseInt(searchParams.get('coins') || '0');
  const price = searchParams.get('price') || '';
  const pin = searchParams.get('pin') || '';

  if (!discordId || !coins) {
    return new NextResponse('参数错误', { status: 400 });
  }

  try {
    // 查找或创建客户
    let customer = await getCustomerByDiscordId(discordId);
    if (!customer) {
      customer = await createCustomer(name, discordId, pin);
    }

    // 加余额
    const newBalance = customer.balance + coins;
    await addBalance(customer.id, newBalance, price, customer.history);
  } catch (err: any) {
    console.error('充值确认失败:', err?.message || err);
    return new NextResponse(`充值处理失败: ${err?.message || '未知错误'}`, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peiwowan-xk56-kappa.vercel.app';
  return NextResponse.redirect(
    `${baseUrl}/admin/topup-confirmed?name=${encodeURIComponent(name)}&coins=${coins}&discord=${encodeURIComponent(discordId)}`
  );
}
