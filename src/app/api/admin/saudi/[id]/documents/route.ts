import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

type DocCategory = 'documents' | 'translated_documents'

function categoryColumn(category: string): DocCategory | null {
  if (category === 'original') return 'documents'
  if (category === 'translated') return 'translated_documents'
  return null
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const categoryRaw = form?.get('category')
  const column = typeof categoryRaw === 'string' ? categoryColumn(categoryRaw) : null

  if (!(file instanceof File) || !column) {
    return NextResponse.json({ error: 'file_and_category_required' }, { status: 400 })
  }

  const { data: app } = await auth.supabase
    .from('saudi_applications')
    .select(`id, ${column}`)
    .eq('id', params.id)
    .single()

  if (!app) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const folder = column === 'documents' ? 'original' : 'translated'
  const filePath = `saudi/${params.id}/${folder}/${Date.now()}_${safeName}`

  const { error: uploadError } = await auth.supabase.storage
    .from('documents')
    .upload(filePath, file, { upsert: true, contentType: file.type || undefined })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const docEntry = {
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.type || null,
    uploaded_at: new Date().toISOString(),
  }

  const existing = ((app as any)[column] ?? []) as unknown[]
  const updated = [...existing, docEntry]

  const { error: updateError } = await auth.supabase
    .from('saudi_applications')
    .update({ [column]: updated })
    .eq('id', params.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  return NextResponse.json({ ok: true, document: docEntry, [column]: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { path, category } = await req.json().catch(() => ({}))
  const column = typeof category === 'string' ? categoryColumn(category) : null
  if (typeof path !== 'string' || !path || !column) {
    return NextResponse.json({ error: 'path_and_category_required' }, { status: 400 })
  }

  const { data: app } = await auth.supabase
    .from('saudi_applications')
    .select(`id, ${column}`)
    .eq('id', params.id)
    .single()

  if (!app) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  await auth.supabase.storage.from('documents').remove([path]).catch(() => {})

  const existing = ((app as any)[column] ?? []) as Array<{ file_path: string }>
  const updated = existing.filter(d => d.file_path !== path)

  const { error: updateError } = await auth.supabase
    .from('saudi_applications')
    .update({ [column]: updated })
    .eq('id', params.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  return NextResponse.json({ ok: true, [column]: updated })
}
