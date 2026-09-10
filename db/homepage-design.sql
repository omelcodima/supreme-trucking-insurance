-- Isolated, additive migration. Never resets the owner's existing design choice.
CREATE TABLE IF NOT EXISTS sti_homepage_design (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton = true),
  variant text NOT NULL CHECK (variant IN ('classic', 'cinematic')),
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO sti_homepage_design (singleton, variant) VALUES (true, 'cinematic')
ON CONFLICT (singleton) DO NOTHING;
