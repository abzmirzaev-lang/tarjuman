const TOKEN = '8795066758:AAHOry2y60EDr5Szs0OQLmOKINxckuq30PU'
const CHAT_ID = 7516226655

const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text: 'Assalomu alaykum! 👋\n\nSiz bilan bog\'lanishni xohlaymiz. Menejerimiz bilan to\'g\'ridan-to\'g\'ri muloqot qilish uchun quyidagi tugmani bosing 👇',
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: '💬 Menejer bilan bog\'lanish', url: 'https://t.me/TARJUMAN_EDU' }
      ]]
    }
  })
})

const data = await res.json()
if (data.ok) {
  console.log('✅ Xabar yuborildi!')
} else {
  console.error('❌ Xato:', data.description)
}
