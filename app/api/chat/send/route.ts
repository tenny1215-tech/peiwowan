import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';
import { put, get } from '@vercel/blob';

const MAX_MESSAGES = 100;

interface Message {
  message: string;
  senderName: string;
  senderType: 'player' | 'companion';
  timestamp: number;
}

function blobKey(companionId: string) {
  // Notion ID 有连字符，sanitize 成安全路径
  return `chat/${companionId.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
}

async function readMessages(key: string): Promise<Message[]> {
  try {
    const result = await get(key, { access: 'public' });
    if (!result || result.statusCode !== 200) return [];
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const { companionId, message, senderName, senderType } = await req.json();

  if (!companionId || !message?.trim() || !senderName) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  const newMsg: Message = {
    message: message.trim(),
    senderName,
    senderType,
    timestamp: Date.now(),
  };

  // 先实时推送，不被 Blob 操作阻断
  await pusherServer.trigger(`chat-${companionId}`, 'new-message', newMsg);

  // 再持久化到 Blob
  try {
    const key = blobKey(companionId);
    const existing = await readMessages(key);
    const updated = [...existing, newMsg].slice(-MAX_MESSAGES);
    await put(key, JSON.stringify(updated), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });
  } catch (e) {
    console.error('[chat/send] blob write failed:', e);
  }

  return NextResponse.json({ ok: true });
}
