create table if not exists public.company_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null check (char_length(summary) between 1 and 220),
  body text not null check (char_length(body) between 1 and 4000),
  audience text not null default 'company' check (audience in ('company', 'department')),
  department text,
  pinned boolean not null default false,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((audience = 'company' and department is null) or (audience = 'department' and department is not null))
);

create index if not exists company_updates_published_order
  on public.company_updates (published desc, pinned desc, published_at desc);
create index if not exists company_updates_department
  on public.company_updates (department) where audience = 'department';

alter table public.company_updates enable row level security;

drop policy if exists "employees read visible company updates" on public.company_updates;
create policy "employees read visible company updates"
on public.company_updates for select to authenticated
using (
  published = true
  and (
    audience = 'company'
    or department = (select p.department from public.profiles p where p.user_id = auth.uid())
  )
);

drop policy if exists "admins and managers publish updates" on public.company_updates;
create policy "admins and managers publish updates"
on public.company_updates for insert to authenticated
with check (
  created_by = auth.uid()
  and (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
    or (
      audience = 'department'
      and department = (select p.department from public.profiles p where p.user_id = auth.uid() and p.role = 'manager')
    )
  )
);

drop policy if exists "authors and admins update company updates" on public.company_updates;
create policy "authors and admins update company updates"
on public.company_updates for update to authenticated
using (
  created_by = auth.uid()
  or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  or (
    created_by = auth.uid()
    and audience = 'department'
    and department = (select p.department from public.profiles p where p.user_id = auth.uid() and p.role = 'manager')
  )
);

drop policy if exists "authors and admins delete company updates" on public.company_updates;
create policy "authors and admins delete company updates"
on public.company_updates for delete to authenticated
using (
  created_by = auth.uid()
  or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

grant select, insert, update, delete on public.company_updates to authenticated;

do $$
declare
  seed_author uuid;
begin
  select user_id into seed_author
  from public.profiles
  where role in ('admin', 'manager')
  order by case role when 'admin' then 0 else 1 end, created_at
  limit 1;

  if seed_author is not null and not exists (select 1 from public.company_updates) then
    insert into public.company_updates (title, summary, body, audience, pinned, created_by, published_at)
    values (
      'H!KINEX Learning Week starts Monday',
      'Short daily sessions, practical tools and an open Q&A with department leads.',
      'Learning Week brings short daily sessions designed to help every H!KINEX employee discover practical tools and useful working habits. Check the schedule shared by your department lead and bring your questions to the open Q&A.',
      'company',
      true,
      seed_author,
      now()
    );
  end if;
end $$;
