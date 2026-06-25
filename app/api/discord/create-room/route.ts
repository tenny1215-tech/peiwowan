import { NextRequest, NextResponse } from 'next/server';
import { getPersonById, updatePerson } from '@/lib/notion';
import { getCustomerByDiscordId } from '@/lib/customers';

const DISCORD_API = 'https://discord.com/api/v10';
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

function headers() {
  return {
    'Authorization': `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function sendDMWithButton(discordUserId: string, content: string, customId: string) {
  const dmRes = await fetch(`${DISCORD_API}/users/@me/channels`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ recipient_id: discordUserId }),
  });
  if (!dmRes.ok) {
    console.error('创建DM频道失败', discordUserId, dmRes.status, await dmRes.text());
    return;
  }
  const dm = await dmRes.json();
  const msgRes = await fetch(`${DISCORD_API}/channels/${dm.id}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      content,
      components: [{
        type: 1,
        components: [{
          type: 2,
          style: 3,
          label: '✅ 接单',
          custom_id: customId,
        }],
      }],
    }),
  });
  if (!msgRes.ok) {
    console.error('发送DM消息失败', discordUserId, msgRes.status, await msgRes.text());
  }
}

export async function POST(req: NextRequest) {
  const { companionId, discordId, cost } = await req.json();
  if (!companionId) return NextResponse.json({ error: '缺少参数' }, { status: 400 });

  // 先验证客户余额，但不扣费
  if (discordId && cost) {
    const customer = await getCustomerByDiscordId(discordId);
    if (!customer) return NextResponse.json({ error: '账户不存在' }, { status: 404 });
    if (customer.balance < cost) return NextResponse.json({ error: '余额不足' }, { status: 402 });
  }

  const person = await getPersonById(companionId);
  if (!person) return NextResponse.json({ error: '陪玩师不存在' }, { status: 404 });

  if (person.status === '游戏中') {
    return NextResponse.json({ error: '陪玩师正在接待中，请稍后再试' }, { status: 409 });
  }

  const companionName = person.name;

  async function createChannel(): Promise<string | null> {
    const channelName = `peiwan-${companionName || companionId.slice(-6)}`;
    const channelRes = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/channels`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name: channelName, type: 2 }),
    });
    if (!channelRes.ok) return null;
    const channel = await channelRes.json();
    await updatePerson(companionId, { discordChannelId: channel.id });
    return channel.id as string;
  }

  let channelId: string | null = person.discordChannelId || null;

  if (!channelId) {
    channelId = await createChannel();
    if (!channelId) return NextResponse.json({ error: '创建房间失败' }, { status: 500 });
  }

  async function createInvite(id: string) {
    return fetch(`${DISCORD_API}/channels/${id}/invites`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ max_age: 86400, max_uses: 0, unique: true }),
    });
  }

  let inviteRes = await createInvite(channelId);

  // 旧频道可能已在 Discord 那边被删除，自动重建一次再重试
  if (!inviteRes.ok) {
    channelId = await createChannel();
    if (!channelId) return NextResponse.json({ error: '创建房间失败' }, { status: 500 });
    inviteRes = await createInvite(channelId);
  }

  if (!inviteRes.ok) return NextResponse.json({ error: '创建邀请链接失败' }, { status: 500 });

  const invite = await inviteRes.json();
  const inviteUrl = `https://discord.gg/${invite.code}`;

  // 私信陪玩师（带接单按钮）
  if (person.discordId) {
    const companionIdClean = companionId.replace(/-/g, '');
    const customId = `ao|${companionIdClean}|${cost || 0}|${discordId || ''}|${invite.code}`;
    await sendDMWithButton(
      person.discordId,
      `🎮 有新订单！玩家邀请你陪玩\n费用：${cost || 0} 硬币\n加入频道：${inviteUrl}`,
      customId,
    );
  }

  return NextResponse.json({ url: inviteUrl });
}
