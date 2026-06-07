import { NextRequest, NextResponse } from 'next/server'
import { answerCallbackQuery } from '@/lib/bot/telegram'
import { handleStart, handleText, handleUserCallback } from '@/lib/bot/handlers/user'
import { handleAdminCommand, handleAdminMessage, handleAdminCallback } from '@/lib/bot/handlers/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Incoming message ───────────────────────────────────
    if (body.message) {
      const msg = body.message

      // Admin state (reply / note) takes highest priority
      const handledByAdmin = await handleAdminMessage(msg)
      if (handledByAdmin) return NextResponse.json({ ok: true })

      // Admin commands
      const handledCommand = await handleAdminCommand(msg)
      if (handledCommand) return NextResponse.json({ ok: true })

      // /start
      if (msg.text?.startsWith('/start')) {
        await handleStart(msg)
        return NextResponse.json({ ok: true })
      }

      // Regular user message
      await handleText(msg)
    }

    // ── Callback query (button press) ──────────────────────
    if (body.callback_query) {
      const cb = body.callback_query
      await answerCallbackQuery(cb.id)

      // Admin callbacks first
      const handledByAdmin = await handleAdminCallback(cb)
      if (handledByAdmin) return NextResponse.json({ ok: true })

      // User callbacks
      await handleUserCallback(cb)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
