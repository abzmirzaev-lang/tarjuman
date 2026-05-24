-- ============================================================
-- TARJUMAN — Full Database Schema
-- Run in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────
-- ENUM TYPES
-- ──────────────────────────────────────────
CREATE TYPE application_status AS ENUM (
  'REGISTERED', 'PAID', 'IN_PROGRESS',
  'UNDER_REVIEW', 'SUBMITTED', 'COMPLETED', 'REJECTED'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING', 'PAID', 'FAILED', 'REFUNDED'
);

CREATE TYPE payment_method AS ENUM (
  'STRIPE_CARD', 'STRIPE_APPLE_PAY', 'CIS_UZCARD', 'CIS_HUMO', 'OTHER'
);

CREATE TYPE service_package AS ENUM (
  'SUBMISSION', 'STANDARD', 'VIP'
);

CREATE TYPE document_type AS ENUM (
  'PASSPORT', 'PHOTO', 'DIPLOMA', 'TRANSCRIPT',
  'IELTS', 'ARABIC_CERT', 'RECOMMENDATION',
  'MEDICAL', 'CRIMINAL_RECORD', 'OTHER'
);

CREATE TYPE message_sender AS ENUM ('USER', 'ADMIN');

CREATE TYPE app_language AS ENUM ('ru', 'uz', 'en');

-- ──────────────────────────────────────────
-- USERS  (extends Supabase auth.users)
-- ──────────────────────────────────────────
CREATE TABLE public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL UNIQUE,
  full_name       TEXT,
  avatar_url      TEXT,
  phone           TEXT,
  telegram        TEXT,                        -- Telegram @username
  citizenship     TEXT,
  date_of_birth   DATE,
  education_level TEXT,
  preferred_lang  app_language DEFAULT 'ru',
  is_admin        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- UNIVERSITIES
-- ──────────────────────────────────────────
CREATE TABLE public.universities (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ru      TEXT NOT NULL,
  name_uz      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  country      TEXT NOT NULL,            -- 'SA' | 'AE'
  city         TEXT,
  logo_url     TEXT,
  website_url  TEXT,
  description_ru TEXT,
  description_uz TEXT,
  description_en TEXT,
  programs     TEXT[] DEFAULT '{}',      -- ['Islamic Studies','Engineering',...]
  is_active    BOOLEAN DEFAULT TRUE,
  rank         INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view universities"
  ON public.universities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage universities"
  ON public.universities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- APPLICATIONS
-- ──────────────────────────────────────────
CREATE TABLE public.applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  university_id   UUID REFERENCES public.universities(id),
  university_name TEXT,                 -- denormalized for display
  country         TEXT NOT NULL,        -- 'SA' | 'AE'
  program         TEXT,
  service_package service_package NOT NULL DEFAULT 'STANDARD',
  status          application_status DEFAULT 'REGISTERED',
  full_name       TEXT NOT NULL,
  citizenship     TEXT,
  date_of_birth   DATE,
  phone           TEXT,
  telegram        TEXT,
  education_level TEXT,
  notes           TEXT,                 -- admin notes
  submitted_at    TIMESTAMPTZ,          -- when admin marks as Submitted
  completed_at    TIMESTAMPTZ,          -- when admin marks as Completed
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications"
  ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications"
  ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications (pre-payment)"
  ON public.applications FOR UPDATE USING (auth.uid() = user_id AND status = 'REGISTERED');
CREATE POLICY "Admins can do anything with applications"
  ON public.applications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- DOCUMENTS
-- ──────────────────────────────────────────
CREATE TABLE public.documents (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id   UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type             document_type NOT NULL,
  file_name        TEXT NOT NULL,
  file_path        TEXT NOT NULL,       -- Supabase Storage path
  file_size        BIGINT,              -- bytes
  mime_type        TEXT,
  is_verified      BOOLEAN DEFAULT FALSE,
  verified_at      TIMESTAMPTZ,
  verified_by      UUID REFERENCES public.users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload own documents"
  ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own pending documents"
  ON public.documents FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents"
  ON public.documents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- PAYMENTS
-- ──────────────────────────────────────────
CREATE TABLE public.payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id        UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_payment_intent TEXT UNIQUE,
  stripe_session_id     TEXT UNIQUE,
  cis_transaction_id    TEXT,
  amount                NUMERIC(10,2) NOT NULL,
  currency              TEXT DEFAULT 'USD',
  method                payment_method DEFAULT 'STRIPE_CARD',
  status                payment_status DEFAULT 'PENDING',
  package               service_package NOT NULL,
  paid_at               TIMESTAMPTZ,
  refunded_at           TIMESTAMPTZ,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- MESSAGES
-- ──────────────────────────────────────────
CREATE TABLE public.messages (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES public.users(id),
  sender         message_sender NOT NULL,
  content        TEXT NOT NULL,
  is_read        BOOLEAN DEFAULT FALSE,
  read_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages for own applications"
  ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can send messages for own applications"
  ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = user_id AND sender = 'USER'
  );
CREATE POLICY "Admins can do anything with messages"
  ON public.messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- STATUS HISTORY (audit log)
-- ──────────────────────────────────────────
CREATE TABLE public.status_history (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  changed_by     UUID REFERENCES public.users(id),
  old_status     application_status,
  new_status     application_status NOT NULL,
  note           TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own status history"
  ON public.status_history FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id AND a.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can do anything"
  ON public.status_history FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- ──────────────────────────────────────────
-- SEED: Universities
-- ──────────────────────────────────────────
INSERT INTO public.universities
  (name_ru, name_uz, name_en, country, city, website_url, programs, rank)
VALUES
  (
    'Исламский университет Мадины', 'Madina Islom universiteti',
    'Islamic University of Madinah', 'SA', 'Madinah',
    'https://iu.edu.sa',
    ARRAY['Islamic Studies','Arabic Language','Quran','Shariah','Dawah'],
    1
  ),
  (
    'Университет Умм аль-Кура', 'Umm al-Qura universiteti',
    'Umm Al-Qura University', 'SA', 'Makkah',
    'https://uqu.edu.sa',
    ARRAY['Islamic Studies','Engineering','Medicine','Business','Computer Science'],
    2
  ),
  (
    'Университет короля Сауда', 'Qirol Saud universiteti',
    'King Saud University', 'SA', 'Riyadh',
    'https://ksu.edu.sa',
    ARRAY['Engineering','Medicine','Business','Computer Science','Sciences'],
    3
  ),
  (
    'Университет имама Мухаммада ибн Сауда', 'Imom Muhammad ibn Saud universiteti',
    'Imam Muhammad ibn Saud Islamic University', 'SA', 'Riyadh',
    'https://imamu.edu.sa',
    ARRAY['Islamic Studies','Shariah','Arabic','Social Sciences','Business'],
    4
  ),
  (
    'Университет ОАЭ', 'BAA universiteti',
    'UAE University', 'AE', 'Al Ain',
    'https://uaeu.ac.ae',
    ARRAY['Engineering','Medicine','Business','Law','Sciences','Computer Science'],
    5
  ),
  (
    'Американский университет Шарджи', 'Sharjah Amerika universiteti',
    'American University of Sharjah', 'AE', 'Sharjah',
    'https://aus.edu',
    ARRAY['Engineering','Architecture','Business','Arts & Sciences'],
    6
  ),
  (
    'Университет Аджмана', 'Ajman universiteti',
    'Ajman University', 'AE', 'Ajman',
    'https://ajman.ac.ae',
    ARRAY['Engineering','Medicine','Pharmacy','Business','IT'],
    7
  );

-- ──────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ──────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.status_history (application_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER application_status_changed
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- ──────────────────────────────────────────
-- STORAGE BUCKETS (run separately in Supabase dashboard or CLI)
-- ──────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
--
-- Storage RLS for documents bucket:
-- CREATE POLICY "Users can upload own docs"
--   ON storage.objects FOR INSERT WITH CHECK (
--     bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
--   );
-- CREATE POLICY "Users can read own docs"
--   ON storage.objects FOR SELECT USING (
--     bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
--   );
-- CREATE POLICY "Admins can read all docs"
--   ON storage.objects FOR SELECT USING (
--     bucket_id = 'documents' AND
--     EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
--   );
