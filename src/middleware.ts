import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection — skip intl middleware
  if (pathname.startsWith('/admin')) {
    const isLogin = pathname === '/admin/login';
    const token  = request.cookies.get('admin_token')?.value;
    const secret = process.env.ADMIN_SECRET;

    if (!isLogin && token !== secret) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
