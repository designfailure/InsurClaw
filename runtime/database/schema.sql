-- InsurClaw Database Schema
-- SQLite for dev; pgvector migration path for production

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  slack_user_id TEXT UNIQUE,
  jurisdiction TEXT DEFAULT 'EU',
  timezone TEXT DEFAULT 'Europe/Paris',
  tier TEXT DEFAULT 'free',
  gdpr_consent_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_slack ON users(slack_user_id);

-- Policies
CREATE TABLE IF NOT EXISTS policies (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  carrier TEXT,
  type TEXT,
  policy_number TEXT,
  start_date DATE,
  end_date DATE,
  premium_annual REAL,
  coverage_summary TEXT,
  raw_document_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_policies_user ON policies(user_id);

-- Claims
CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  policy_id TEXT REFERENCES policies(id),
  event_type TEXT,
  event_date DATE,
  status TEXT DEFAULT 'draft',
  estimated_value_min REAL,
  estimated_value_max REAL,
  settled_value REAL,
  evidence_paths TEXT,
  audit_trail TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_user ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- Risk Profiles
CREATE TABLE IF NOT EXISTS risk_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  properties TEXT,
  travel_frequency TEXT,
  registered_routes TEXT,
  risk_scores TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT,
  action_type TEXT,
  action_detail TEXT,
  outcome TEXT,
  approved_by TEXT,
  gdpr_basis TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);

-- Admin Triggers (for WhatsApp push notifications)
CREATE TABLE IF NOT EXISTS admin_triggers (
  id TEXT PRIMARY KEY,
  trigger_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  whatsapp_recipient TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_admin_triggers_status ON admin_triggers(status);

-- Pending Approvals (approval gates)
CREATE TABLE IF NOT EXISTS pending_approvals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  action_type TEXT NOT NULL,
  action_detail TEXT NOT NULL,
  channel TEXT DEFAULT 'slack',
  channel_ref TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  resolved_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_pending_approvals_user ON pending_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_approvals_status ON pending_approvals(status);
