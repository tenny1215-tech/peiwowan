import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const companionId = req.cookies.get('companion_session')?.value;
  if (!companionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string;

  if (!file) return NextResponse.json({ error: '没有文件' }, { status: 400 });

  const ext = file.name.split('.').pop();
  const blob = await put(`companions/${companionId}/${type}-${Date.now()}.${ext}`, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
