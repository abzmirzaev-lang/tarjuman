'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  const [status, setStatus] = useState('Читаю токен...')
  const [error,  setError]  = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken  = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      setStatus(`Токен найден: ${accessToken ? 'ДА' : 'НЕТ'}, Refresh: ${refreshToken ? 'ДА' : 'НЕТ'}`)

      if (!accessToken || !refreshToken) {
        setError('Токены не найдены в URL. Попробуй войти снова.')
        return
      }

      setStatus('Сохраняю сессию...')
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token:  accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        setError(`Ошибка setSession: ${sessionError.message}`)
        return
      }

      if (data.session) {
        setStatus(`Сессия создана! Пользователь: ${data.session.user.email}. Перехожу...`)
        setTimeout(() => { window.location.href = '/dashboard' }, 1500)
      } else {
        setError('setSession вернул пустую сессию')
      }
    }

    handleAuth()
  }, [])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="card p-8 max-w-md w-full text-center space-y-4">
        <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-ink">{status}</p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
