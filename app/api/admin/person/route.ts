import { NextRequest, NextResponse } from 'next/server';
import { createPerson } from '@/lib/notion';

export async function POST(req: NextRequest) {
  if (req.cookies.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const page = await createPerson(data);
  return NextResponse.json({ ok: true, id: (page as any).id });
}
