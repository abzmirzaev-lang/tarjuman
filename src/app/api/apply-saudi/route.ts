import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyAdmin } from '@/lib/telegram'
import { SAUDI_PACKAGES, SaudiPackageId } from '@/lib/saudiPackages'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+[1-9]\d{7,14}$/ // international format, e.g. +998901234567

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
      full_name,
      email,
      phone,
      address,
      has_disability,
      annual_income,
      income_currency,
      motivation,
      desired_programs,
      service_package,
      lang,
    } = body ?? {}

    // ── Validation ──────────────────────────────────────────────
    if (typeof full_name !== 'string' || full_name.trim().length < 3) {
      return NextResponse.json({ error: 'invalid_full_name' }, { status: 400 })
    }
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
    if (typeof desired_programs !== 'string' || desired_programs.trim().length < 5) {
      return NextResponse.json({ error: 'invalid_programs' }, { status: 400 })
    }
    const cleanedDesiredPrograms = desired_programs.trim().slice(0, 4000)

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
        full_name:              full_name.trim(),
        email:                  email.trim().toLowerCase(),
        phone:                  phone.trim(),
        address:                address.trim(),
        has_disability,
        annual_income:          cleanedIncome,
        income_currency:        cleanedIncome !== null ? (income_currency || 'USD') : null,
        motivation:             motivation.trim(),
        desired_programs:       cleanedDesiredPrograms,
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
      `ФИО: ${app.full_name}\n` +
      `Email: ${app.email}\n` +
      `Телефон: ${app.phone}\n` +
      `Тариф: ${pkg.name_ru} — $${pkg.priceUSD}\n` +
      `Университеты/факультеты: ${cleanedDesiredPrograms.slice(0, 200)}${cleanedDesiredPrograms.length > 200 ? '…' : ''}\n` +
      `ID: ${app.id.slice(0, 8)}\n\n` +
      `https://tarjumanedu.com/admin`
    ).catch(console.error)

    return NextResponse.json({ ok: true, id: app.id })
  } catch (err: any) {
    console.error('apply-saudi error:', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
