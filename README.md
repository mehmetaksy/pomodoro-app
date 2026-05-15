# Pomodoro Timer

A Pomodoro timer app inspired by [pomofocus.io](https://pomofocus.io), built with React + Vite.

## Features

- 🍅 Pomodoro / Short Break / Long Break modes
- ⏱ Start, Pause, Reset timer
- 🎨 Background color changes with mode
- ✅ Task list with add/delete/complete
- 🔔 Sound notification when timer ends
- 🔐 User authentication (sign up / sign in)
- ☁️ Tasks saved to database — persist across sessions

## Tech Stack

- React
- Vite
- CSS
- Supabase (Auth + Database)

## Getting Started

1. Create a project on [Supabase](https://supabase.com) and run this SQL:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  done boolean default false,
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

create policy "Users can only see own tasks"
  on tasks for all
  using (auth.uid() = user_id);
```

2. Create `src/supabase.js` with your project credentials:

```js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'your-project-url'
const SUPABASE_ANON_KEY = 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

3. Install dependencies and run:

```bash
npm install
npm run dev
```