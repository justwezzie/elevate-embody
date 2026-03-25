-- ============================================================
-- LisasYoga — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table public.users (
  id            uuid primary key default uuid_generate_v4(),
  clerk_id      text unique not null,
  email         text unique not null,
  full_name     text,
  avatar_url    text,
  role          text not null default 'client' check (role in ('client', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.sessions (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  type            text not null check (type in ('yoga', 'boxing')),
  description     text,
  instructor_name text not null,
  datetime        timestamptz not null,
  duration_mins   integer not null default 60,
  capacity        integer not null,
  spots_remaining integer not null,
  price_cents     integer not null,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint spots_within_capacity check (spots_remaining >= 0 and spots_remaining <= capacity)
);

create table public.bookings (
  id                         uuid primary key default uuid_generate_v4(),
  user_id                    uuid not null references public.users(id) on delete cascade,
  session_id                 uuid not null references public.sessions(id) on delete cascade,
  status                     text not null default 'pending'
                               check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_payment_intent_id   text unique,
  stripe_checkout_session_id text unique,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),
  unique (user_id, session_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_sessions_datetime   on public.sessions(datetime);
create index idx_sessions_type       on public.sessions(type);
create index idx_bookings_user_id    on public.bookings(user_id);
create index idx_bookings_session_id on public.bookings(session_id);
create index idx_bookings_status     on public.bookings(status);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Decrement spots_remaining atomically
create or replace function public.decrement_spots(session_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.sessions
  set    spots_remaining = spots_remaining - 1,
         updated_at      = now()
  where  id = session_id
  and    spots_remaining > 0;

  if not found then
    raise exception 'no_spots_available' using hint = 'Session is fully booked';
  end if;
end;
$$;

-- Restore a spot on cancellation
create or replace function public.restore_spot(session_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.sessions
  set    spots_remaining = least(spots_remaining + 1, capacity),
         updated_at      = now()
  where  id = session_id;
end;
$$;

-- Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_sessions_updated_at
  before update on public.sessions
  for each row execute function public.handle_updated_at();

create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row execute function public.handle_updated_at();

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users    enable row level security;
alter table public.sessions enable row level security;
alter table public.bookings enable row level security;

-- Helper: extract clerk_id from JWT sub claim (set by Clerk JWT template)
create or replace function public.requesting_clerk_id()
returns text language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')
$$;

-- SESSIONS: published rows are publicly readable
create policy "sessions_select_published"
  on public.sessions for select
  using (is_published = true);

-- Service role bypasses RLS — admin writes go through API routes using service role key

-- BOOKINGS: users see only their own
create policy "bookings_select_own"
  on public.bookings for select
  using (
    user_id = (
      select id from public.users
      where clerk_id = public.requesting_clerk_id()
    )
  );

create policy "bookings_insert_own"
  on public.bookings for insert
  with check (
    user_id = (
      select id from public.users
      where clerk_id = public.requesting_clerk_id()
    )
    and status = 'pending'
  );

-- USERS: own row only
create policy "users_select_own"
  on public.users for select
  using (clerk_id = public.requesting_clerk_id());

create policy "users_update_own"
  on public.users for update
  using (clerk_id = public.requesting_clerk_id());

-- ============================================================
-- REALTIME
-- ============================================================
-- Enable realtime for spots_remaining live updates
alter publication supabase_realtime add table public.sessions;

-- ============================================================
-- CLERK JWT TEMPLATE (set up in Clerk Dashboard)
-- Dashboard → JWT Templates → New template named "supabase"
-- Template body:
-- {
--   "sub": "{{user.id}}",
--   "metadata": "{{user.public_metadata}}"
-- }
-- ============================================================

-- ============================================================
-- ASSIGN ADMIN ROLE (run once for instructor)
-- Replace 'clerk_user_id_here' with the instructor's Clerk user ID
-- ============================================================
-- update public.users set role = 'admin' where clerk_id = 'clerk_user_id_here';
