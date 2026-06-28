import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

const BLOB_PREFIX = 'follow/';

function blobPathname(discordId: string) {
  return `${BLOB_PREFIX}${discordId.replace(/[^a-zA-Z0-9-_]/g, '_')}.json`;
}

export async function GET(req: NextRequest) {
  try {
    const discordId = req.nextUrl.searchParams.get('discordId');
    if (!discordId) return NextResponse.json([]);

    const pathname = blobPathname(discordId);
    const { blobs } = await list({ prefix: pathname });
    const match = blobs.find(b => b.pathname === pathname);
    if (!match) return NextResponse.json([]);

    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error('[following] GET error:', e);
    return NextResponse.json([]);
  }
}
