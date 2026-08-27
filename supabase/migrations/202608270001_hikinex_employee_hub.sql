create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  department text,
  role text not null default 'employee' check (role in ('employee', 'manager', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id text primary key,
  name text not null,
  description text not null,
  url text not null check (url ~ '^https://'),
  category text not null,
  icon text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_default_apps (
  role text not null check (role in ('employee', 'manager', 'admin')),
  application_id text not null references public.applications(id) on delete cascade,
  primary key (role, application_id)
);

create table if not exists public.user_app_assignments (
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id text not null references public.applications(id) on delete cascade,
  source text not null default 'self_added' check (source in ('self_added', 'admin')),
  added_at timestamptz not null default now(),
  primary key (user_id, application_id)
);

create or replace function public.create_employee_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 'employee')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_employee_profile();

insert into public.applications (id, name, description, url, category, icon, sort_order) values
  ('mission-control', 'Mission Control', 'Work overview', 'https://mission-control-hikinex.vercel.app', 'H!KINEX', 'M', 10),
  ('timekeeper', 'TimeKeeper', 'Time tracking', 'https://hikinex-timekeeper-web2.vercel.app', 'H!KINEX', 'T', 20),
  ('lms', 'LMS', 'Learning center', 'https://dfd-lms-ten.vercel.app/auth/sign-in?redirectTo=%2Fdashboard', 'H!KINEX', 'L', 30),
  ('vaultwarden', 'Vaultwarden', 'Password manager', 'https://vault.hikinex.com/#/login', 'IT', 'V', 40),
  ('hiki-it-portal', 'HIKI IT Portal', 'Support requests', 'https://hikinex-it-app-production.up.railway.app', 'IT', 'IT', 50),
  ('hubspot', 'HubSpot', 'Sales and marketing', 'https://app.hubspot.com/login', 'Sales', 'H', 60),
  ('reet', 'REET', 'Agent performance dashboards', 'https://reet-hikinex.vercel.app', 'H!KINEX', 'R', 70),
  ('talentdirector', 'TalentDirector', 'Recruiting operations hub', 'https://talentdirector.dogfooddevsecure.com', 'Recruiting', 'TD', 80),
  ('invsync', 'InvSync', 'Invoice pipeline and billing', 'https://invsync-rho.vercel.app', 'H!KINEX', 'IS', 90),
  ('softwaretracker', 'SoftwareTracker', 'Software inventory and renewals', 'https://softwaretracker.vercel.app', 'IT', 'ST', 100),
  ('canva', 'Canva', 'Design workspace', 'https://www.canva.com/login', 'Marketing', 'C', 110),
  ('semrush', 'Semrush', 'SEO intelligence', 'https://www.semrush.com/login/', 'Marketing', 'S', 120),
  ('reqev-ats', 'RegEv · ATS', 'Applicant tracking and hiring', 'https://app.reqev.com', 'Recruiting', 'RA', 130),
  ('dfd-timekeeper', 'DFD TimeKeeper', 'DogFoodDev time tracking', 'https://dfd-timekeeper.vercel.app', 'DogFoodDev', 'DT', 140)
on conflict (id) do update set name = excluded.name, description = excluded.description, url = excluded.url,
  category = excluded.category, icon = excluded.icon, sort_order = excluded.sort_order, updated_at = now();

insert into public.role_default_apps (role, application_id) values
  ('employee', 'mission-control'), ('employee', 'timekeeper'), ('employee', 'lms'), ('employee', 'vaultwarden'), ('employee', 'hiki-it-portal'), ('employee', 'hubspot'),
  ('manager', 'mission-control'), ('manager', 'timekeeper'), ('manager', 'lms'), ('manager', 'vaultwarden'), ('manager', 'hiki-it-portal'), ('manager', 'hubspot'), ('manager', 'reet'), ('manager', 'talentdirector'),
  ('admin', 'mission-control'), ('admin', 'timekeeper'), ('admin', 'lms'), ('admin', 'vaultwarden'), ('admin', 'hiki-it-portal'), ('admin', 'hubspot'), ('admin', 'invsync'), ('admin', 'softwaretracker')
on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.role_default_apps enable row level security;
alter table public.user_app_assignments enable row level security;

create policy "authenticated users read own profile" on public.profiles for select to authenticated using (auth.uid() = user_id);
create policy "authenticated users read active apps" on public.applications for select to authenticated using (active = true);
create policy "authenticated users read role defaults" on public.role_default_apps for select to authenticated using (true);
create policy "users read own app assignments" on public.user_app_assignments for select to authenticated using (auth.uid() = user_id);
create policy "users add own optional apps" on public.user_app_assignments for insert to authenticated with check (auth.uid() = user_id and source = 'self_added');
create policy "users remove own optional apps" on public.user_app_assignments for delete to authenticated using (auth.uid() = user_id and source = 'self_added');

grant usage on schema public to authenticated;
grant select on public.profiles, public.applications, public.role_default_apps to authenticated;
grant select, insert, delete on public.user_app_assignments to authenticated;
