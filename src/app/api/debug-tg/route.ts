import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get the most recent application
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, full_name, user_id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!app) return NextResponse.json({ error: 'No applications found', appErr })

  // Call the real notification endpoint
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tarjumanedu.com'
  const notifRes = await fetch(`${baseUrl}/api/notifications/new-application`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId: app.id }),
  })
  const notifBody = await notifRes.json()

  return NextResponse.json({
    app: { id: app.id, name: app.full_name, user_id: app.user_id },
    notificationEndpointStatus: notifRes.status,
    notificationEndpointResponse: notifBody,
  })
}
