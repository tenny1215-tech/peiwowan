import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';

function blobKey(companionId: string) {
  return `chat/${companionId.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
}

export async function GET(req: NextRequest) {
  const companionId = req.nextUrl.searchParams.get('companionId');
  if (!companionId) {
    return NextResponse.json({ error: 'missing companionId' }, { status: 400 });
  }

  try {
    const key = blobKey(companionId);
    const result = await get(key, { access: 'public' });
    if (!result || result.statusCode !== 200) return NextResponse.json([]);
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([]);
  }
}
