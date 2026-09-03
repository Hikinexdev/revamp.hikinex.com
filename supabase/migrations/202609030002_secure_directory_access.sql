-- Require an approved directory match before an authenticated account receives portal access.
-- work_email is intentionally nullable because the source PDF does not contain email addresses.

alter table public.employee_role_directory
  add column if not exists work_email text;

create unique index if not exists employee_role_directory_work_email_unique
  on public.employee_role_directory (lower(work_email))
  where work_email is not null and btrim(work_email) <> '';

alter table public.profiles
  add column if not exists job_title text,
  add column if not exists operations_manager text;

alter table public.profiles alter column role drop default;
alter table public.profiles alter column role drop not null;

create or replace function public.create_employee_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (user_id, display_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    ),
    null
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.create_employee_profile() from public, anon, authenticated;

create or replace function public.sync_my_employee_role()
returns table(role text, display_name text, department text)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  caller_id uuid := auth.uid();
  login_email text;
  microsoft_name text;
  existing_role text;
  directory_found boolean := false;
  directory_record public.employee_role_directory%rowtype;
begin
  if caller_id is null then
    raise exception 'Authentication required';
  end if;

  select lower(nullif(btrim(u.email), ''))
  into login_email
  from auth.users u
  where u.id = caller_id;

  select coalesce(
    nullif(identity_data->>'full_name', ''),
    nullif(identity_data->>'name', ''),
    nullif(identity_data->>'display_name', '')
  )
  into microsoft_name
  from auth.identities
  where user_id = caller_id and provider = 'azure'
  order by created_at desc
  limit 1;

  select p.role into existing_role
  from public.profiles p
  where p.user_id = caller_id;

  if login_email is not null then
    select d.* into directory_record
    from public.employee_role_directory d
    where lower(d.work_email) = login_email
    limit 1;
    directory_found := found;
  end if;

  if not directory_found and microsoft_name is not null then
    select d.* into directory_record
    from public.employee_role_directory d
    where d.match_key = coalesce(
      (select a.directory_match_key
       from public.employee_role_aliases a
       where a.alias_match_key = public.normalize_employee_directory_name(microsoft_name)),
      public.normalize_employee_directory_name(microsoft_name)
    );
    directory_found := found;
  end if;

  if directory_found then
    update public.profiles p
    set
      display_name = directory_record.full_name,
      department = directory_record.department,
      job_title = directory_record.job_title,
      operations_manager = directory_record.operations_manager,
      role = case when existing_role = 'admin' then 'admin' else directory_record.portal_role end,
      updated_at = now()
    where p.user_id = caller_id;
  elsif existing_role is distinct from 'admin' then
    update public.profiles p
    set role = null, department = null, job_title = null, operations_manager = null, updated_at = now()
    where p.user_id = caller_id;
  end if;

  return query
  select p.role, p.display_name, p.department
  from public.profiles p
  where p.user_id = caller_id;
end;
$$;

revoke all on function public.sync_my_employee_role() from public, anon;
grant execute on function public.sync_my_employee_role() to authenticated;

-- Remove the permissive default from existing non-admin profiles. The next sign-in
-- restores Employee or Manager only after a trusted directory match.
update public.profiles
set role = null, department = null, job_title = null, operations_manager = null, updated_at = now()
where role is distinct from 'admin';

create or replace function public.is_portal_member()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role in ('employee', 'manager', 'admin')
  );
$$;

revoke all on function public.is_portal_member() from public, anon;
grant execute on function public.is_portal_member() to authenticated;

drop policy if exists "authenticated users read active apps" on public.applications;
create policy "portal members read active apps"
on public.applications for select to authenticated
using (active = true and public.is_portal_member());

drop policy if exists "authenticated users read role defaults" on public.role_default_apps;
create policy "portal members read own role defaults"
on public.role_default_apps for select to authenticated
using (
  role = (select p.role from public.profiles p where p.user_id = auth.uid())
);

drop policy if exists "users read own app assignments" on public.user_app_assignments;
create policy "portal members read own app assignments"
on public.user_app_assignments for select to authenticated
using (auth.uid() = user_id and public.is_portal_member());

drop policy if exists "users add own optional apps" on public.user_app_assignments;
create policy "portal members add own approved optional apps"
on public.user_app_assignments for insert to authenticated
with check (
  auth.uid() = user_id
  and source = 'self_added'
  and public.is_portal_member()
  and application_id in ('canva', 'semrush', 'reqev-ats', 'dfd-timekeeper')
);

drop policy if exists "users remove own optional apps" on public.user_app_assignments;
create policy "portal members remove own optional apps"
on public.user_app_assignments for delete to authenticated
using (auth.uid() = user_id and source = 'self_added' and public.is_portal_member());
