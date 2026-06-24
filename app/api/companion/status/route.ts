import { NextRequest, NextResponse } from 'next/server';
import { updatePerson } from '@/lib/notion';

const VALID_STATUSES = ['可接单', '游戏中', '离线'];

export async function PATCH(req: NextRequest) {
  const companionId = req.cookies.get('companion_session')?.value;
  if (!companionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: '无效状态' }, { status: 400 });
  }

  await updatePerson(companionId, { status });
  return NextResponse.json({ ok: true });
}
