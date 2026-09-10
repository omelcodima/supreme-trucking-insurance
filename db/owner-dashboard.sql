CREATE TABLE IF NOT EXISTS sti_intake_limits (
  key text PRIMARY KEY,
  reset_at timestamptz NOT NULL,
  hits integer NOT NULL CHECK (hits > 0)
);
CREATE INDEX IF NOT EXISTS sti_intake_reset ON sti_intake_limits (reset_at);
CREATE TABLE IF NOT EXISTS sti_leads (
  id uuid PRIMARY KEY,
  dedupe_key text NOT NULL UNIQUE,
  source text NOT NULL CHECK (source IN ('quick_quote','full_application','instant_indication')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  contact_name text NOT NULL, company text NOT NULL, phone text NOT NULL, email text NOT NULL,
  dot text NOT NULL, home_state text NOT NULL, contact_requested boolean NOT NULL,
  request jsonb NOT NULL
);
CREATE INDEX IF NOT EXISTS sti_leads_created ON sti_leads (created_at DESC, id);
CREATE TABLE IF NOT EXISTS sti_consent_events (
  id uuid PRIMARY KEY,
  lead_id uuid REFERENCES sti_leads(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  mobile text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('sms_opt_in','sms_not_provided','sms_opt_out','call_opt_out')),
  evidence jsonb NOT NULL,
  digest text NOT NULL CHECK (length(digest)=64)
);
CREATE INDEX IF NOT EXISTS sti_consent_mobile ON sti_consent_events(mobile, kind);
CREATE INDEX IF NOT EXISTS sti_consent_lead ON sti_consent_events(lead_id);
CREATE TABLE IF NOT EXISTS sti_audit (
  id uuid PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  actor text NOT NULL, action text NOT NULL, target text NOT NULL
);
CREATE OR REPLACE FUNCTION sti_prevent_evidence_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Evidence is append-only; corrections require a new event';
END;
$$;
DROP TRIGGER IF EXISTS sti_evidence_append_only ON sti_consent_events;
CREATE TRIGGER sti_evidence_append_only BEFORE UPDATE OR DELETE ON sti_consent_events
FOR EACH ROW EXECUTE FUNCTION sti_prevent_evidence_change();
DROP TRIGGER IF EXISTS sti_audit_append_only ON sti_audit;
CREATE TRIGGER sti_audit_append_only BEFORE UPDATE OR DELETE ON sti_audit
FOR EACH ROW EXECUTE FUNCTION sti_prevent_evidence_change();
