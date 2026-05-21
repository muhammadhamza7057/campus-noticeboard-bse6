# CampusFlow

Modern realtime campus notice board platform.

## Features
- Authentication
- Realtime notices
- Category filtering
- Secure RLS policies
- Responsive UI
- Supabase backend
- Vercel deployment

## Tech Stack
- React
- Vite
- Supabase
- Tailwind CSS
- Vercel

## Live Demo
[campus-noticeboard-bse6.vercel.app](https://campus-noticeboard-bse6.vercel.app)

## Mobile Testing

To test the app on your mobile phone while running it locally:

1. Make sure your phone and computer are on the same Wi-Fi network.
2. Start the dev server with `npm run dev -- --host 0.0.0.0`.
3. Open the network URL shown in the terminal on your phone, such as `http://10.x.x.x:5174/`.
4. If the browser cannot connect, allow the app through your Windows firewall for local network access.

## Screenshots
(Add screenshots)

## Installation
npm install
npm run dev

## Supabase Setup

Create these tables in Supabase:

```sql
create table public.profiles (
	id uuid not null,
	email text not null,
	display_name text null,
	created_at timestamp with time zone null default now(),
	constraint profiles_pkey primary key (id)
);

create table public.notices (
	id bigint generated always as identity not null,
	user_id uuid null,
	title text not null,
	body text not null,
	category text not null,
	created_at timestamp with time zone null default now(),
	constraint notices_pkey primary key (id),
	constraint notices_user_id_fkey foreign key (user_id) references profiles (id) on delete CASCADE
);
```

Enable Auth providers in Supabase:

1. Email/password authentication.
2. Google provider.
3. In the Google provider settings, use your real Google OAuth Client ID and Client Secret from Google Cloud Console.
4. The Client ID should look like a Google domain string, usually ending in `.apps.googleusercontent.com`.
5. Do not use your project name, app name, or random text in the Client ID field.
6. Add your Supabase callback URL exactly as shown in the dashboard, for example `https://<project-ref>.supabase.co/auth/v1/callback`.
7. Add your local redirect URL, usually `http://localhost:5173/` or the Vite port shown in the terminal.
8. Set `VITE_SUPABASE_GOOGLE_ENABLED=true` in `.env.local` after Google provider is enabled.

Recommended RLS policies:

```sql
alter table public.profiles enable row level security;
alter table public.notices enable row level security;

create policy "profiles read own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles upsert own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "notices read all"
on public.notices
for select
using (true);

create policy "notices insert own"
on public.notices
for insert
with check (auth.uid() = user_id);
```