import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS, only ever used after an admin check.
export function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/**
 * Verifies the caller sent a valid Supabase access token (Authorization: Bearer <token>)
 * AND that the matching users row has is_admin = true. The browser client in this app
 * (src/lib/supabase/client.ts) persists sessions in localStorage, not cookies, so the
 * token has to travel via header — same pattern as /api/payments/create-checkout.
 */
export async function requireAdmin(req: NextRequest): Promise<
  { ok: true; supabase: ReturnType<typeof serviceClient> } | { ok: false; response: NextResponse }
> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) }
  }

  const supabase = serviceClient()
  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userData.user) {
    return { ok: false, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userData.user.id)
    .single()

  if (!profile?.is_admin) {
    return { ok: false, response: NextResponse.json({ error: 'forbidden' }, { status: 403 }) }
  }

  return { ok: true, supabase }
}
