-- rooms table
create table rooms (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  team_a_name text not null default 'Team A',
  team_b_name text not null default 'Team B',
  pin_hash    text,
  created_at  timestamptz default now()
);

-- expenses table
create table expenses (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references rooms(id) on delete cascade,
  team        text not null check (team in ('a', 'b')),
  description text not null,
  amount      numeric(10,2) not null check (amount > 0),
  created_at  timestamptz default now()
);

-- indexes
create index on expenses(room_id);
create index on expenses(created_at desc);

-- RLS
alter table rooms enable row level security;
alter table expenses enable row level security;

create policy "create rooms" on rooms for insert with check (true);
create policy "read rooms" on rooms for select using (true);
create policy "insert expenses" on expenses for insert with check (true);
create policy "read expenses" on expenses for select using (true);
create policy "delete expenses" on expenses for delete using (true);
