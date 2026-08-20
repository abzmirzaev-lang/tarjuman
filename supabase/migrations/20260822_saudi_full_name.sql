-- Add full name (as in passport) field to saudi_applications.
-- Collected on the anketa so the manager has the client's legal name for
-- university submission without waiting on document upload/translation.

ALTER TABLE saudi_applications
  ADD COLUMN IF NOT EXISTS full_name TEXT;
