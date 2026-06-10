import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID

  const checks: Record<string, string> = {
    TELEGRAM_BOT_TOKEN: token ? `✅ set (ends ...${token.slice(-4)})` : '❌ NOT SET',
    TELEGRAM_ADMIN_CHAT_ID: adminChat ? `✅ set = ${adminChat}` : '❌ NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ set' : '❌ NOT SET',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ set' : '❌ NOT SET',
  }

  // Try sending a real test message if both are set
  let testResult = 'skipped (missing token or chat id)'
  if (token && adminChat) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChat,
        text: '🧪 Test message from TARJUMAN debug endpoint',
      }),
    })
    const data = await res.json()
    testResult = data.ok ? '✅ Message sent!' : `❌ Error: ${data.description}`
  }

  return NextResponse.json({ checks, testResult })
}
