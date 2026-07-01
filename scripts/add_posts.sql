-- Blog / SEO content posts for the public website.
CREATE TABLE IF NOT EXISTS public.posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  slug             text UNIQUE NOT NULL,
  excerpt          text,
  cover_image      text,
  body_html        text,
  meta_title       text,
  meta_description text,
  tags             text[],
  status           text NOT NULL DEFAULT 'draft',   -- draft | published
  author_id        uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at     timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Admins (the two fixed owners) can do everything.
DROP POLICY IF EXISTS "Admins manage posts" ON public.posts;
CREATE POLICY "Admins manage posts" ON public.posts
  FOR ALL USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- Anyone (incl. anonymous visitors / search engines) can read PUBLISHED posts.
DROP POLICY IF EXISTS "Public read published posts" ON public.posts;
CREATE POLICY "Public read published posts" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE INDEX IF NOT EXISTS posts_status_pub_idx ON public.posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
