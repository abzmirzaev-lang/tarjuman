-- Add free-text "desired programs" field to saudi_applications.
-- The old structured picker (university + faculty pairs, selected_programs
-- JSONB) is replaced on the frontend by a single free-text field where the
-- client writes in their own words which universities/faculties they want
-- (or asks TARJUMAN to choose for them). selected_programs already has a
-- NOT NULL DEFAULT '[]'::jsonb, so leaving it out of new inserts is safe —
-- it's kept as-is for backward compatibility with already-submitted apps.

ALTER TABLE saudi_applications
  ADD COLUMN IF NOT EXISTS desired_programs TEXT;
