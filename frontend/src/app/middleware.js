import { NextResponse } from 'next/server';

export function middleware(req) {
  const { nextUrl, cookies, headers } = req
  const token =
    cookies.get('token')?.value ||
    headers.get('authorization')?.split(' ')[1]
  const isAuthPage = nextUrl.pathname.startsWith('/login')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)']
}
