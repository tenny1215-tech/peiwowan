import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API = 'https://discord.com/api/v10';
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

function headers() {
  return {
    'Authorization': `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export async function POST(req: NextRequest) {
  const { companionName } = await req.json();
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
  return NextResponse.json({ url: `https://discord.gg/${invite.code}`, channelName });
}
