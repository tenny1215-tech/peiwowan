import { NextRequest, NextResponse } from 'next/server';
import { getOrder, confirmOrder } from '@/lib/orders';
import { getPersonById, updatePerson } from '@/lib/notion';

const DISCORD_API = 'https://discord.com/api/v10';
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

function discordHeaders() {
  return {
    'Authorization': `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function getOrCreateChannel(companionId: string, companionName: string): Promise<string> {
  const person = await getPersonById(companionId);
  if (person?.discordChannelId) return person.discordChannelId;

  const res = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/channels`, {
    method: 'POST',
    headers: discordHeaders(),
    body: JSON.stringify({ name: `peiwan-${companionName}`, type: 2 }),
  });
  const channel = await res.json();
  await updatePerson(companionId, { discordChannelId: channel.id });
  return channel.id;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return new NextResponse('订单不存在或已处理', { status: 404 });
  }
  if (order.status === 'confirmed') {
    return NextResponse.redirect(
      new URL(`/order/${id}/success?url=${encodeURIComponent(order.discordInviteUrl || '')}`, req.url)
    );
  }

  // 获取或创建 Discord 频道
  const channelId = await getOrCreateChannel(order.companionId, order.companionName);

  // 生成邀请链接
  const inviteRes = await fetch(`${DISCORD_API}/channels/${channelId}/invites`, {
    method: 'POST',
    headers: discordHeaders(),
    body: JSON.stringify({ max_age: 86400, max_uses: 0, unique: true }),
  });
  const invite = await inviteRes.json();
  const inviteUrl = `https://discord.gg/${invite.code}`;

  // 确认订单
  await confirmOrder(id, inviteUrl);

  // 跳转到成功页面
  return NextResponse.redirect(
    new URL(`/order/${id}/success?url=${encodeURIComponent(inviteUrl)}`, req.url)
  );
}
