import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 60

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count, error } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'SUBMITTED')

    if (error) throw error

    return NextResponse.json({ submitted: (count ?? 0) + 40 })
  } catch (err: any) {
    return NextResponse.json({ submitted: 40 })
  }
}
