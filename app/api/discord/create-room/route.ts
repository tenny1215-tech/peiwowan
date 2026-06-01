import { NextRequest, NextResponse } from 'next/server';
import { getPersonById } from '@/lib/notion';

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
  // 先创建 DM 频道
  const dmRes = await fetch(`${DISCORD_API}/users/@me/channels`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ recipient_id: discordUserId }),
  });
  if (!dmRes.ok) return;

  const dm = await dmRes.json();
  // 发消息
  await fetch(`${DISCORD_API}/channels/${dm.id}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ content: message }),
  });
}

export async function POST(req: NextRequest) {
  const { companionName, companionId } = await req.json();
  if (!companionName) return NextResponse.json({ error: '缺少参数' }, { status: 400 });

  const ts = Date.now().toString().slice(-6);
  const channelName = `peiwan-room-${ts}`;

  // 创建语音频道
  const channelRes = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/channels`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name: channelName, type: 2 }),
  });

  if (!channelRes.ok) {
    return NextResponse.json({ error: '创建房间失败' }, { status: 500 });
  }

  const channel = await channelRes.json();

  // 创建邀请链接（24小时有效，最多2人）
  const inviteRes = await fetch(`${DISCORD_API}/channels/${channel.id}/invites`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ max_age: 86400, max_uses: 2, unique: true }),
  });

  if (!inviteRes.ok) {
    return NextResponse.json({ error: '创建邀请链接失败' }, { status: 500 });
  }

  const invite = await inviteRes.json();
  const inviteUrl = `https://discord.gg/${invite.code}`;

  // 如果有 companionId，查 Discord ID 并发私信通知
  if (companionId) {
    const person = await getPersonById(companionId);
    if (person?.discordId) {
      await sendDM(
        person.discordId,
        `🎮 有玩家找你陪玩啦！\n点击加入语音房间：${inviteUrl}\n（链接24小时有效）`
      );
    }
  }

  return NextResponse.json({ url: inviteUrl, channelName });
}
