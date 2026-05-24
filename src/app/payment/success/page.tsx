'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export default function PaymentSuccessPage() {
  const router = useRouter()
  useEffect(() => {
    const t = setTimeout(() => router.push('/dashboard'), 5000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-10 text-center max-w-md w-full"
      >
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-3">Оплата успешна! 🎉</h1>
        <p className="text-muted text-sm mb-8">
          Ваша заявка принята. Мы свяжемся с вами в течение 24 часов.
          Автоматически перейдёте в личный кабинет через 5 секунд...
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="w-full">Перейти в кабинет</Button>
        </Link>
      </motion.div>
    </div>
  )
}
