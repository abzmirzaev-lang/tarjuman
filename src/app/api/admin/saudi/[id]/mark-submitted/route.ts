import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { data: app } = await auth.supabase
    .from('saudi_applications')
    .select('id, status')
    .eq('id', params.id)
    .single()

  if (!app) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (app.status !== 'UNDER_REVIEW') {
    return NextResponse.json({ error: 'wrong_status' }, { status: 400 })
  }

  const { error } = await auth.supabase
    .from('saudi_applications')
    .update({ status: 'SUBMITTED' })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
