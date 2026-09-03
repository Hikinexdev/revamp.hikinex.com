# H!KINEX Commons

The role-aware H!KINEX employee portal.

## GitHub Pages

[Open H!KINEX Commons](https://marianahikinex.github.io/revamp.hikinex.com/)

Approved employees can sign in to use their Employee, Manager, or Admin experience, add optional applications to **My Apps**, and access role-default applications.

- Current milestone: functional application catalog, role defaults, secure external shortcuts, and Supabase-ready persistence
- Supabase setup: apply `supabase/migrations/202608270001_hikinex_employee_hub.sql`, then provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` during the Commons build

No shared passwords or Supabase service-role credentials belong in this repository.

## Included requirements

- H!KINEX branding and company palette
- Departments: H!KINEX, Sales, Recruiting, Marketing, E-Discovery, and IT
- Role-aware Employee, Manager, and Admin navigation
- Apps, announcements, company feed, groups, people, jobs/referrals, team, requests, and administration
- Public Review mode cannot change employee data; authenticated app selections are protected by Supabase row-level security
- Approved application shortcuts open their corresponding destination in a separate tab
- Responsive navigation and keyboard-accessible overlays
- Screaming Frog remains disabled until its destination is confirmed

## Project

- `commons/`

The folder contains the Vinext/React project. Install dependencies and run the local development command documented in its `package.json`.
