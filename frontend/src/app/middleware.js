
export function middleware(req) {
  const { cookies, nextUrl } = req
  const token = cookies.get('token')?.value
  const isPublic = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}
