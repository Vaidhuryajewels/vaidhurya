create table if not exists public.seller_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'seller',
  created_at timestamptz not null default now()
);
create table if not exists public.seller_listings (
  id uuid primary key default gen_random_uuid(), seller_id uuid not null references public.seller_profiles(id),
  status text not null default 'draft', title text not null default '', structured_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.seller_listing_media (
  id uuid primary key default gen_random_uuid(), listing_id uuid not null references public.seller_listings(id) on delete cascade,
  storage_path text not null, media_type text not null, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.seller_ai_sessions (
  id uuid primary key default gen_random_uuid(), listing_id uuid references public.seller_listings(id) on delete cascade,
  seller_id uuid not null references public.seller_profiles(id), model text, request_id text, structured_result jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.seller_conversations (
  id uuid primary key default gen_random_uuid(), seller_id uuid not null references public.seller_profiles(id),
  channel text not null, customer_name text not null, unread_count integer not null default 0, last_message text, updated_at timestamptz not null default now()
);
alter table public.seller_profiles enable row level security;
alter table public.seller_listings enable row level security;
alter table public.seller_listing_media enable row level security;
alter table public.seller_ai_sessions enable row level security;
alter table public.seller_conversations enable row level security;
create policy "seller owns profile" on public.seller_profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "seller owns listings" on public.seller_listings for all using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns ai sessions" on public.seller_ai_sessions for all using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "seller owns conversations" on public.seller_conversations for all using (seller_id = auth.uid()) with check (seller_id = auth.uid());
