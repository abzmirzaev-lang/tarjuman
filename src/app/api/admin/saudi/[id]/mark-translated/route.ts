import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { login, password } = await req.json().catch(() => ({}))
  if (typeof login !== 'string' || !login.trim() || typeof password !== 'string' || !password.trim()) {
    return NextResponse.json({ error: 'login_and_password_required' }, { status: 400 })
  }

  const { data: app } = await auth.supabase
    .from('saudi_applications')
    .select('id, status')
    .eq('id', params.id)
    .single()

  if (!app) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (app.status !== 'PAID') {
    return NextResponse.json({ error: 'wrong_status' }, { status: 400 })
  }

  const { error } = await auth.supabase
    .from('saudi_applications')
    .update({
      status: 'UNDER_REVIEW',
      study_portal_login: login.trim(),
      study_portal_password: password.trim(),
    })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
