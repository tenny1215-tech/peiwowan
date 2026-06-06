import { NextRequest, NextResponse } from 'next/server';
import { getCustomerByDiscordId } from '@/lib/customers';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ discordId: string }> }) {
  const { discordId } = await params;
  const customer = await getCustomerByDiscordId(decodeURIComponent(discordId));
  if (!customer) return NextResponse.json({ error: '账户不存在' }, { status: 404 });
  return NextResponse.json(customer);
}
