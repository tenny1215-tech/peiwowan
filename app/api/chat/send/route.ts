import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { companionId, message, senderName, senderType } = await req.json();

  if (!companionId || !message?.trim() || !senderName) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  await pusherServer.trigger(`chat-${companionId}`, 'new-message', {
    message: message.trim(),
    senderName,
    senderType,
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
