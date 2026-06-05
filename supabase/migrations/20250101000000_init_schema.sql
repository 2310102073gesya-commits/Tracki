CREATE TABLE transactions (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            TEXT          NOT NULL CHECK (type IN ('income', 'expense')),
  amount          BIGINT        NOT NULL CHECK (amount > 0),
  category        VARCHAR(50)   NOT NULL,
  description     TEXT,
  shariah_status  TEXT          NOT NULL DEFAULT 'halal'
                                CHECK (shariah_status IN ('halal', 'syubhat', 'haram')),
  is_interest     BOOLEAN       NOT NULL DEFAULT false,
  date            DATE          NOT NULL DEFAULT CURRENT_DATE,
  source          TEXT          NOT NULL DEFAULT 'manual'
                                CHECK (source IN ('manual', 'scan')),
  synced_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_date   ON transactions (user_id, date DESC);
CREATE INDEX idx_transactions_user_type   ON transactions (user_id, type);
CREATE INDEX idx_transactions_shariah     ON transactions (user_id, shariah_status)
                                           WHERE shariah_status != 'halal';
CREATE INDEX idx_transactions_interest    ON transactions (user_id, is_interest)
                                           WHERE is_interest = true;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE split_sessions (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         VARCHAR(100)  NOT NULL,
  total_amount  BIGINT        NOT NULL CHECK (total_amount > 0),
  method        TEXT          NOT NULL CHECK (method IN ('equal', 'per_item', 'custom')),
  status        TEXT          NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'settled')),
  place_name    VARCHAR(100),
  notes         TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  settled_at    TIMESTAMPTZ
);

CREATE INDEX idx_split_sessions_user_status ON split_sessions (user_id, status);

CREATE TABLE split_members (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID          NOT NULL REFERENCES split_sessions(id) ON DELETE CASCADE,
  name          VARCHAR(100)  NOT NULL,
  amount_due    BIGINT        NOT NULL CHECK (amount_due > 0),
  is_paid       BOOLEAN       NOT NULL DEFAULT false,
  paid_at       TIMESTAMPTZ,
  notes         TEXT
);

CREATE INDEX idx_split_members_session ON split_members (session_id);
CREATE INDEX idx_split_members_unpaid  ON split_members (session_id, is_paid)
                                        WHERE is_paid = false;

CREATE TABLE zakat_records (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month           DATE        NOT NULL,
  income          BIGINT      NOT NULL,
  nishab_at_time  BIGINT      NOT NULL,
  zakat_due       BIGINT      NOT NULL,
  is_paid         BOOLEAN     NOT NULL DEFAULT false,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, month)
);

CREATE INDEX idx_zakat_records_user_month ON zakat_records (user_id, month DESC);

ALTER TABLE transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_records  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions: user owns their data"
  ON transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "split_sessions: user owns their data"
  ON split_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "split_members: accessible through owned sessions"
  ON split_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM split_sessions s
      WHERE s.id = split_members.session_id
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "zakat_records: user owns their data"
  ON zakat_records FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
