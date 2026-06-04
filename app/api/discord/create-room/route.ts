import { NextRequest, NextResponse } from 'next/server';
import { getPersonById, updatePerson } from '@/lib/notion';

const DISCORD_API = 'https://discord.com/api/v10';
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

function headers() {
  return {
    'Authorization': `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function sendDM(discordUserId: string, message: string) {
  const dmRes = await fetch(`${DISCORD_API}/users/@me/channels`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ recipient_id: discordUserId }),
  });
  if (!dmRes.ok) return;
  const dm = await dmRes.json();
  await fetch(`${DISCORD_API}/channels/${dm.id}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ content: message }),
  });
}

export async function POST(req: NextRequest) {
  const { companionId } = await req.json();
  if (!companionId) return NextResponse.json({ error: '缺少参数' }, { status: 400 });

  const person = await getPersonById(companionId);
  if (!person) return NextResponse.json({ error: '陪玩师不存在' }, { status: 404 });

  let channelId = person.discordChannelId;

  // 没有固定频道则新建，并保存到 Notion
  if (!channelId) {
    const channelName = `peiwan-${person.name || companionId.slice(-6)}`;
    const channelRes = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/channels`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name: channelName, type: 2 }),
    });
    if (!channelRes.ok) return NextResponse.json({ error: '创建房间失败' }, { status: 500 });
    const channel = await channelRes.json();
    channelId = channel.id;
    await updatePerson(companionId, { discordChannelId: channelId });
  }

  // 为固定频道生成邀请链接（24小时有效，不限次数）
  const inviteRes = await fetch(`${DISCORD_API}/channels/${channelId}/invites`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ max_age: 86400, max_uses: 0, unique: true }),
  });

  if (!inviteRes.ok) return NextResponse.json({ error: '创建邀请链接失败' }, { status: 500 });

  const invite = await inviteRes.json();
  const inviteUrl = `https://discord.gg/${invite.code}`;

  // 私信通知陪玩师
  if (person.discordId) {
    await sendDM(
      person.discordId,
      `🎮 有玩家找你陪玩啦！\n点击加入语音房间：${inviteUrl}`
    );
  }

  return NextResponse.json({ url: inviteUrl });
}
