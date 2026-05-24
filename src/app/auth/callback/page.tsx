'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Handle the OAuth callback - exchange code for session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push('/dashboard')
      } else {
        // Listen for auth state change after code exchange
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe()
            router.push('/dashboard')
          }
        })
        // Timeout fallback
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: d }) => {
            if (d.session) router.push('/dashboard')
            else router.push('/login')
          })
        }, 3000)
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted text-sm">Выполняется вход...</p>
      </div>
    </div>
  )
}
