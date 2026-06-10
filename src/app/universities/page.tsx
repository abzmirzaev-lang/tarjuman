import { createServerSupabase } from '@/lib/supabase/server'
import { UniversitiesClient } from './UniversitiesClient'
import { Suspense } from 'react'

export const revalidate = 3600

export default async function UniversitiesPage() {
  const supabase = createServerSupabase()
  const { data } = await supabase
    .from('universities')
    .select('*')
    .eq('is_active', true)
    .order('rank')

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-muted">Загрузка...</div>
      </div>
    }>
      <UniversitiesClient initialUnis={data ?? []} />
    </Suspense>
  )
}
