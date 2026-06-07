import { createClient } from '@supabase/supabase-js'
import type { Lang, Status } from './config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Types ───────────────────────────────────────────────────

export interface TelegramUser {
  chat_id:    number
  first_name: string
  username:   string | null
  lang:       Lang
  source:     string
  last_seen:  string
  created_at: string
}

export interface Lead {
  id:         string
  chat_id:    number
  status:     Status
  tags:       string[]
  notes:      string | null
  created_at: string
  updated_at: string
}

// ── Users ────────────────────────────────────────────────────

export async function upsertUser(user: {
  chat_id:    number
  first_name: string
  username?:  string | null
  lang?:      string
  source?:    string
}) {
  await supabase.from('telegram_users').upsert(
    {
      chat_id:    user.chat_id,
      first_name: user.first_name,
      username:   user.username ?? null,
      lang:       user.lang ?? 'ru',
      source:     user.source ?? 'bot',
      last_seen:  new Date().toISOString(),
    },
    { onConflict: 'chat_id' }
  )
}

export async function getUserLang(chatId: number): Promise<Lang> {
  const { data } = await supabase
    .from('telegram_users')
    .select('lang')
    .eq('chat_id', chatId)
    .single()
  return (data?.lang as Lang) || 'ru'
}

export async function setUserLang(chatId: number, lang: Lang) {
  await supabase
    .from('telegram_users')
    .upsert({ chat_id: chatId, lang }, { onConflict: 'chat_id' })
}

export async function getClients(limit = 10, offset = 0) {
  const { data } = await supabase
    .from('telegram_users')
    .select(`*, leads(status)`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  return data ?? []
}

export async function getClientCount(): Promise<number> {
  const { count } = await supabase
    .from('telegram_users')
    .select('*', { count: 'exact', head: true })
  return count ?? 0
}

// ── Leads ────────────────────────────────────────────────────

export async function upsertLead(chatId: number, source = 'bot'): Promise<Lead | null> {
  const { data } = await supabase
    .from('leads')
    .upsert({ chat_id: chatId, source }, { onConflict: 'chat_id', ignoreDuplicates: true })
    .select()
    .single()
  if (!data) {
    const { data: existing } = await supabase
      .from('leads')
      .select()
      .eq('chat_id', chatId)
      .single()
    return existing
  }
  return data
}

export async function getLeadByChatId(chatId: number): Promise<Lead | null> {
  const { data } = await supabase
    .from('leads')
    .select()
    .eq('chat_id', chatId)
    .single()
  return data ?? null
}

export async function updateLeadStatus(chatId: number, status: Status) {
  await supabase
    .from('leads')
    .update({ status })
    .eq('chat_id', chatId)
}

export async function updateLeadNotes(chatId: number, notes: string) {
  await supabase
    .from('leads')
    .update({ notes })
    .eq('chat_id', chatId)
}

export async function getLeadStats() {
  const { data } = await supabase.from('lead_stats').select().limit(7)
  return data ?? []
}

// ── Admin sessions ───────────────────────────────────────────

export async function setAdminState(adminChatId: number, state: string, targetChatId: number) {
  await supabase
    .from('admin_sessions')
    .upsert({ admin_chat_id: adminChatId, state, target_chat_id: targetChatId, created_at: new Date().toISOString() },
      { onConflict: 'admin_chat_id' })
}

export async function getAdminState(adminChatId: number) {
  const { data } = await supabase
    .from('admin_sessions')
    .select()
    .eq('admin_chat_id', adminChatId)
    .single()
  return data ?? null
}

export async function clearAdminState(adminChatId: number) {
  await supabase.from('admin_sessions').delete().eq('admin_chat_id', adminChatId)
}

// ── Messages log ─────────────────────────────────────────────

export async function logMessage(chatId: number, direction: 'in' | 'out', text: string) {
  await supabase.from('messages_log').insert({ chat_id: chatId, direction, text })
}
