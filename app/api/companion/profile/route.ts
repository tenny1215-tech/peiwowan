import { NextRequest, NextResponse } from 'next/server';
import { updatePerson } from '@/lib/notion';

export async function PATCH(req: NextRequest) {
  const companionId = req.cookies.get('companion_session')?.value;
  if (!companionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const { loginKey: _, id: __, ...safeData } = data;
  await updatePerson(companionId, safeData);
  return NextResponse.json({ ok: true });
}
