-- Blog / SEO content module. Idempotent. Run on the live Postgres.
CREATE TABLE IF NOT EXISTS posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  slug             text UNIQUE NOT NULL,
  excerpt          text,
  cover_image      text,
  body_html        text,
  meta_title       text,
  meta_description text,
  tags             text[] NOT NULL DEFAULT '{}',
  status           text NOT NULL DEFAULT 'draft',   -- draft | published
  author_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_status_pub_idx ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts (slug);
