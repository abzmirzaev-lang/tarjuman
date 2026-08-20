-- ============================================================
-- TARJUMAN — Saudi admin pipeline (dedicated 4-column kanban)
-- Adds portal credentials (entered by admin at the "translation
-- ready" step) and document tracking to public.saudi_applications.
-- Everything here stays behind the service-role key, same as the
-- base table — no RLS policies are added on purpose.
-- ============================================================

ALTER TABLE public.saudi_applications
  ADD COLUMN study_portal_login    TEXT,
  ADD COLUMN study_portal_password TEXT,
  -- [{ file_name, file_path, file_size, mime_type, uploaded_at }, ...]
  ADD COLUMN documents             JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN translated_documents  JSONB NOT NULL DEFAULT '[]'::jsonb;
