import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

interface FollowedCompanion {
  id: string;
  name: string;
  image: string;
}

const BLOB_PREFIX = 'follow/';

function blobPathname(discordId: string) {
  return `${BLOB_PREFIX}${discordId.replace(/[^a-zA-Z0-9-_]/g, '_')}.json`;
}

async function readList(discordId: string): Promise<FollowedCompanion[]> {
  try {
    const pathname = blobPathname(discordId);
    const { blobs } = await list({ prefix: pathname });
    const match = blobs.find(b => b.pathname === pathname);
    if (!match) return [];
    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[follow] readList error:', e);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { discordId, companionId, companionName, companionImage } = await req.json();
    if (!discordId || !companionId) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const list_ = await readList(discordId);
    const alreadyFollowing = list_.some(c => c.id === companionId);

    const updated = alreadyFollowing
      ? list_.filter(c => c.id !== companionId)
      : [...list_, { id: companionId, name: companionName || '', image: companionImage || '' }];

    await put(blobPathname(discordId), JSON.stringify(updated), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });

    return NextResponse.json({ following: !alreadyFollowing, list: updated });
  } catch (e) {
    console.error('[follow] POST error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
