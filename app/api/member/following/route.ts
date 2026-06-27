import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';

function blobKey(discordId: string) {
  return `follow/${discordId.replace(/[^a-zA-Z0-9-_]/g, '_')}.json`;
}

export async function GET(req: NextRequest) {
  const discordId = req.nextUrl.searchParams.get('discordId');
  if (!discordId) return NextResponse.json([]);

  try {
    const key = blobKey(discordId);
    const result = await get(key, { access: 'public' });
    if (!result || result.statusCode !== 200) return NextResponse.json([]);
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([]);
  }
}
