import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyAdmin } from '@/lib/telegram'
import { SAUDI_PACKAGES, SaudiPackageId } from '@/lib/saudiPackages'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+[1-9]\d{7,14}$/ // international format, e.g. +998901234567

interface SelectedProgram {
  university_id?:   string | null
  university_name?: string
  faculty?:          string
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      phone,
      address,
      has_disability,
      annual_income,
      income_currency,
      motivation,
      selected_programs,
      service_package,
      lang,
    } = body ?? {}

    // ── Validation ──────────────────────────────────────────────
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }
    if (typeof phone !== 'string' || !PHONE_RE.test(phone.trim())) {
      return NextResponse.json({ error: 'invalid_phone' }, { status: 400 })
    }
    if (typeof address !== 'string' || address.trim().length < 5) {
      return NextResponse.json({ error: 'invalid_address' }, { status: 400 })
    }
    if (typeof has_disability !== 'boolean') {
      return NextResponse.json({ error: 'invalid_disability' }, { status: 400 })
    }
    if (typeof motivation !== 'string' || motivation.trim().length < 10) {
      return NextResponse.json({ error: 'invalid_motivation' }, { status: 400 })
    }
    if (!Array.isArray(selected_programs) || selected_programs.length < 1 || selected_programs.length > 25) {
      return NextResponse.json({ error: 'invalid_programs' }, { status: 400 })
    }
    const cleanedPrograms = (selected_programs as SelectedProgram[]).map((p, i) => ({
      university_id:   p.university_id ?? null,
      university_name: String(p.university_name ?? '').trim(),
      faculty:          String(p.faculty ?? '').trim(),
      order:            i,
    }))
    if (cleanedPrograms.some(p => !p.university_name || !p.faculty)) {
      return NextResponse.json({ error: 'invalid_programs' }, { status: 400 })
    }
    // no duplicate university+faculty combos
    const seen = new Set<string>()
    for (const p of cleanedPrograms) {
      const key = `${p.university_name.toLowerCase()}::${p.faculty.toLowerCase()}`
      if (seen.has(key)) return NextResponse.json({ error: 'duplicate_program' }, { status: 400 })
      seen.add(key)
    }

    if (!service_package || !(service_package in SAUDI_PACKAGES)) {
      return NextResponse.json({ error: 'invalid_package' }, { status: 400 })
    }
    const pkg = SAUDI_PACKAGES[service_package as SaudiPackageId] // price always resolved server-side

    let cleanedIncome: number | null = null
    if (annual_income !== undefined && annual_income !== null && annual_income !== '') {
      const n = Number(annual_income)
      if (Number.isNaN(n) || n < 0) {
        return NextResponse.json({ error: 'invalid_income' }, { status: 400 })
      }
      cleanedIncome = n
    }

    const supabase = getSupabase()
    const { data: app, error } = await supabase
      .from('saudi_applications')
      .insert({
        email:                  email.trim().toLowerCase(),
        phone:                  phone.trim(),
        address:                address.trim(),
        has_disability,
        annual_income:          cleanedIncome,
        income_currency:        cleanedIncome !== null ? (income_currency || 'USD') : null,
        motivation:             motivation.trim(),
        selected_programs:      cleanedPrograms,
        service_package:        pkg.id,
        service_package_price:  pkg.priceUSD,
        status:                 'REGISTERED',
        lang:                   typeof lang === 'string' ? lang : null,
      })
      .select()
      .single()

    if (error) {
      console.error('apply-saudi insert error:', error)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    await notifyAdmin(
      `🇸🇦 Новая заявка — Саудовская Аравия\n\n` +
      `Email: ${app.email}\n` +
      `Телефон: ${app.phone}\n` +
      `Тариф: ${pkg.name_ru} — $${pkg.priceUSD}\n` +
      `Университеты/факультеты: ${cleanedPrograms.length}\n` +
      `ID: ${app.id.slice(0, 8)}\n\n` +
      `https://tarjumanedu.com/admin`
    ).catch(console.error)

    return NextResponse.json({ ok: true, id: app.id })
  } catch (err: any) {
    console.error('apply-saudi error:', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
