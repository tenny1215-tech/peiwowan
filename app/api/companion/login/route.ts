import { NextRequest, NextResponse } from 'next/server';
import { getPersonByKey } from '@/lib/notion';

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: '请输入 Key' }, { status: 400 });

  const person = await getPersonByKey(key.trim());
  if (!person) return NextResponse.json({ error: 'Key 无效' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set('companion_session', person.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return res;
}
