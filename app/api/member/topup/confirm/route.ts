import { NextRequest, NextResponse } from 'next/server';
import { getCustomerByDiscordId, createCustomer, addBalance } from '@/lib/customers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || '';
  const discordId = searchParams.get('discordId') || '';
  const name = searchParams.get('name') || discordId;
  const coins = parseInt(searchParams.get('coins') || '0');
  const price = searchParams.get('price') || '';
  const pin = searchParams.get('pin') || '';

  if (!discordId || !coins || !id) {
    return new NextResponse('参数错误', { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peiniwan.vercel.app';

  try {
    let customer = await getCustomerByDiscordId(discordId);

    // 防重复：检查 UUID 是否已在充值记录里
    if (customer && customer.history.includes(id)) {
      return NextResponse.redirect(
        `${baseUrl}/admin/topup-confirmed?name=${encodeURIComponent(name)}&coins=${coins}&discord=${encodeURIComponent(discordId)}&duplicate=1`
      );
    }

    if (!customer) {
      customer = await createCustomer(name, discordId, pin);
    }

    const newBalance = customer.balance + coins;
    await addBalance(customer.id, newBalance, `${price} [${id}]`, customer.history);
  } catch (err: any) {
    console.error('充值确认失败:', err?.message || err);
    return new NextResponse(`充值处理失败: ${err?.message || '未知错误'}`, { status: 500 });
  }

  return NextResponse.redirect(
    `${baseUrl}/admin/topup-confirmed?name=${encodeURIComponent(name)}&coins=${coins}&discord=${encodeURIComponent(discordId)}`
  );
}
