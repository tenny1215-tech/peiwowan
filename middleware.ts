import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/topup-confirmed')) {
    const session = request.cookies.get('admin_session')?.value;
    if (session !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname.startsWith('/companion/room')) {
    const session = request.cookies.get('companion_session')?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/companion/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/companion/room/:path*'],
};
