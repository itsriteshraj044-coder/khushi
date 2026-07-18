# Love Form + Admin Dashboard — Setup

The form saves submissions to **Supabase** (free) and the admin dashboard reads
them. One-time setup (~5 min):

## 1. Create a free Supabase project
Go to https://supabase.com → New project. Wait for it to finish provisioning.

## 2. Create the table
Open **SQL Editor** in Supabase and run:

```sql
create table public.love_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  data jsonb not null
);

alter table public.love_submissions enable row level security;

-- Anyone can submit the form...
create policy "anon can insert"
  on public.love_submissions for insert to anon
  with check (true);

-- ...and the dashboard (anon key) can read them back.
create policy "anon can read"
  on public.love_submissions for select to anon
  using (true);
```

## 3. Add your keys
In Supabase: **Project Settings → API**. Copy the **Project URL** and the
**anon public** key. In the project root, copy `.env.example` to `.env` and fill:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

If you deploy on a host that builds from source (Vercel/Netlify/GitHub Actions),
add the same two variables in that host's environment settings instead.

## 4. Rebuild / redeploy
```
npm run build
```

## Using the dashboard
- Open **`<your-site>/#admin`**
- Password: **`abhishek@neha`** (change it in `src/pages/AdminDashboard.tsx`)
- It lists every submission and auto-refreshes every 5 seconds.

## Note on security
The anon key is public by design; Row Level Security (above) is what protects the
table. The dashboard password is a light client-side gate — fine for a personal
site, not bank-grade. To lock reads down fully, remove the "anon can read" policy
and use Supabase Auth for the dashboard.
