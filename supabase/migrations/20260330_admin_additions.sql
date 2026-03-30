-- ============================================================
-- MIGRATION: admin additions
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- --------------------------------------------------------
-- site_config table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_config (
  key        text PRIMARY KEY,
  value      text,
  type       text NOT NULL DEFAULT 'text'
               CHECK (type IN ('text', 'color', 'image')),
  label      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_config_select_public"
  ON public.site_config FOR SELECT
  USING (true);

CREATE POLICY "site_config_write_admin"
  ON public.site_config FOR ALL
  USING (
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  );

-- --------------------------------------------------------
-- Seed default config values
-- --------------------------------------------------------
INSERT INTO public.site_config (key, value, type, label) VALUES
  ('hero_badge',       'Yoga & Boxing',                                          'text',  'Hero Badge Text'),
  ('hero_headline',    'Mindful movement.\nPowerful results.',                   'text',  'Hero Headline'),
  ('hero_subheadline', 'Intimate small-group yoga and boxing sessions at Elevate + Embody. Real technique, real community, real transformation.', 'text', 'Hero Sub-headline'),
  ('hero_image',       '/hero.jpg',                                              'image', 'Hero Background Image'),
  ('about_photo',      '/hero3.jpg',                                             'image', 'About Section Photo'),
  ('about_heading',    'Meet Lisa',                                              'text',  'About Section Heading'),
  ('about_body',       'Lisa is the heart behind Elevate + Embody — a certified yoga instructor and trained boxer who found that the two disciplines together created something transformative.', 'text', 'About Body Text'),
  ('color_primary',    'oklch(0.40 0.15 160)',                                   'color', 'Primary Colour (green)'),
  ('color_accent',     'oklch(0.65 0.20 50)',                                    'color', 'Accent Colour (orange)')
ON CONFLICT (key) DO NOTHING;

-- --------------------------------------------------------
-- Admin RLS policies on existing tables
-- These are ADDITIVE — existing client policies are unchanged
-- --------------------------------------------------------

-- Sessions: admin can see all (including unpublished) and mutate
CREATE POLICY "sessions_admin_all"
  ON public.sessions FOR ALL
  USING (
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  );

-- Bookings: admin can read all
CREATE POLICY "bookings_admin_select"
  ON public.bookings FOR SELECT
  USING (
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  );

-- Users: admin can read all
CREATE POLICY "users_admin_select"
  ON public.users FOR SELECT
  USING (
    (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  );

-- --------------------------------------------------------
-- Revenue RPC functions
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_weekly_revenue()
RETURNS numeric
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(SUM(s.price_cents) / 100.0, 0)
  FROM public.bookings b
  JOIN public.sessions s ON s.id = b.session_id
  WHERE b.status = 'confirmed'
    AND b.created_at >= date_trunc('week', now());
$$;

CREATE OR REPLACE FUNCTION public.get_monthly_revenue()
RETURNS numeric
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(SUM(s.price_cents) / 100.0, 0)
  FROM public.bookings b
  JOIN public.sessions s ON s.id = b.session_id
  WHERE b.status = 'confirmed'
    AND b.created_at >= date_trunc('month', now());
$$;

GRANT EXECUTE ON FUNCTION public.get_weekly_revenue() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_monthly_revenue() TO authenticated;

-- --------------------------------------------------------
-- Supabase Storage: site-assets bucket
-- NOTE: If the bucket already exists, skip the INSERT below.
-- You can also create it in: Dashboard → Storage → New bucket
-- Name: site-assets, Public: true
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "site_assets_read_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "site_assets_write_admin"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'site-assets'
    AND (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'site-assets'
    AND (current_setting('request.jwt.claims', true)::json->'metadata'->>'role') = 'admin'
  );
