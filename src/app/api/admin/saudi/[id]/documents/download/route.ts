import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { path } = await req.json().catch(() => ({}))
  if (typeof path !== 'string' || !path.startsWith(`saudi/${params.id}/`)) {
    return NextResponse.json({ error: 'invalid_path' }, { status: 400 })
  }

  const { data, error } = await auth.supabase.storage.from('documents').createSignedUrl(path, 120)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? 'signed_url_failed' }, { status: 500 })
  }
  return NextResponse.json({ url: data.signedUrl })
}
