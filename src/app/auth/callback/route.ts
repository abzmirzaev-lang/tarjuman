// This file is intentionally left minimal.
// Session exchange is handled client-side in page.tsx via detectSessionInUrl
export async function GET() {
  // This route should not be reached if page.tsx handles the callback
  const { NextResponse } = await import('next/server')
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}
