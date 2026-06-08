import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';
import { getCustomerByDiscordId, createCustomer, addBalance } from '@/lib/customers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { blobs } = await list({ prefix: `topups/${id}.json` });
  if (!blobs.length) return new NextResponse('申请不存在或已处理', { status: 404 });

  const res = await fetch(blobs[0].url);
  const request = await res.json();

  // 查找或创建客户
  let customer = await getCustomerByDiscordId(request.discordId);
  if (!customer) {
    customer = await createCustomer(request.name || request.discordId, request.discordId, request.pin || '');
  }

  // 加余额
  const newBalance = customer.balance + request.coins;
  await addBalance(customer.id, newBalance, `${request.price}`, customer.history);

  // 删除充值申请
  await del(blobs[0].url);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peiwowan-xk56-kappa.vercel.app';
  return NextResponse.redirect(`${baseUrl}/admin/topup-confirmed?name=${encodeURIComponent(request.name)}&coins=${request.coins}&discord=${encodeURIComponent(request.discordId)}`);
}
