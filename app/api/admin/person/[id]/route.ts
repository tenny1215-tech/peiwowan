import { NextRequest, NextResponse } from 'next/server';
import { updatePerson, deletePerson } from '@/lib/notion';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === 'authenticated';
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  await updatePerson(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await deletePerson(id);
  return NextResponse.json({ ok: true });
}
