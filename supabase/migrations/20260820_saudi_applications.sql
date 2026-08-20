-- ============================================================
-- TARJUMAN — Saudi Arabia anketa (separate, guest-facing form)
-- Standalone from public.applications: no login, minimal field set.
-- Inserts happen only through the server (service-role key), so no
-- public RLS policies are defined — RLS is enabled with zero grants
-- to anon/authenticated, which blocks direct client access entirely.
-- ============================================================

CREATE TABLE public.saudi_applications (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact
  email                  TEXT NOT NULL,
  phone                  TEXT NOT NULL,
  address                TEXT NOT NULL,

  -- Screening
  has_disability         BOOLEAN NOT NULL,
  annual_income          NUMERIC(14,2),          -- optional
  income_currency        TEXT,                    -- optional, e.g. 'USD', 'UZS'
  motivation             TEXT NOT NULL,           -- "why Saudi Arabia" essay (ar/en)

  -- University/faculty picks — up to 25, ordered.
  -- Placeholder shape until the real Study in Saudi catalogue is wired in:
  -- [{ university_id: string|null, university_name: string, faculty: string, order: number }, ...]
  selected_programs      JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Package (see src/lib/saudiPackages.ts — single source of truth for pricing)
  service_package         TEXT NOT NULL CHECK (service_package IN ('SUPPORT','STANDARD','VIP')),
  service_package_price   NUMERIC(10,2) NOT NULL,

  -- Kanban-compatible status, so a future dedicated admin panel can reuse
  -- the same first-column convention as public.applications ('REGISTERED').
  status                 TEXT NOT NULL DEFAULT 'REGISTERED'
                           CHECK (status IN ('REGISTERED','PAID','IN_PROGRESS','UNDER_REVIEW','SUBMITTED','COMPLETED','REJECTED')),

  lang                   TEXT,                    -- UI language at submission time ('ru'|'uz'|'en')

  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saudi_applications ENABLE ROW LEVEL SECURITY;
-- No policies added on purpose: only the service-role key (used by
-- /api/apply-saudi and, later, the admin panel) can read/write this table.

CREATE TRIGGER saudi_applications_updated_at BEFORE UPDATE ON public.saudi_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_saudi_applications_status ON public.saudi_applications (status);
CREATE INDEX idx_saudi_applications_created_at ON public.saudi_applications (created_at DESC);
