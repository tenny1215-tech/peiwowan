import { NextResponse } from 'next/server';
import { put, get } from '@vercel/blob';

interface FollowedCompanion {
  id: string;
  name: string;
  image: string;
}

function blobKey(discordId: string) {
  return `follow/${discordId.replace(/[^a-zA-Z0-9-_]/g, '_')}.json`;
}

async function readList(key: string): Promise<FollowedCompanion[]> {
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
  const { discordId, companionId, companionName, companionImage } = await req.json();
  if (!discordId || !companionId) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  const key = blobKey(discordId);
  const list = await readList(key);
  const alreadyFollowing = list.some(c => c.id === companionId);

  const updated = alreadyFollowing
    ? list.filter(c => c.id !== companionId)
    : [...list, { id: companionId, name: companionName || '', image: companionImage || '' }];

  await put(key, JSON.stringify(updated), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  });

  return NextResponse.json({ following: !alreadyFollowing, list: updated });
}
