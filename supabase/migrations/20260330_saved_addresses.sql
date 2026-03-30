create table if not exists public.saved_addresses (
  id         uuid primary key default uuid_generate_v4(),
  address    text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_saved_addresses_updated_at
  before update on public.saved_addresses
  for each row execute function public.handle_updated_at();

alter table public.saved_addresses enable row level security;

create policy "saved_addresses_admin_all"
  on public.saved_addresses for all
  using (
    exists (
      select 1
      from public.users
      where public.users.clerk_id = auth.uid()::text
        and public.users.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.users
      where public.users.clerk_id = auth.uid()::text
        and public.users.role = 'admin'
    )
  );
