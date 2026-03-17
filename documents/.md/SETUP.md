# 🚗 EVGuide SL - Setup Instructions

## Day 1-2 Complete! ✅ Project Initialized

### What We've Built Today:
- ✅ Next.js 14 with TypeScript & Tailwind CSS
- ✅ Supabase client integration
- ✅ Database schema (vehicles + charging stations)
- ✅ Beautiful homepage with vehicle grid
- ✅ TypeScript types for data models

---

## 🚀 Next Steps: Connect to Supabase

### Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up with GitHub
2. Click "New Project"
3. Fill in:
   - **Name**: `evguide-sl`
   - **Database Password**: (save this somewhere safe)
   - **Region**: Singapore (closest to Sri Lanka)
4. Click "Create Project" and wait ~2 minutes

### Step 2: Run Database Setup (2 minutes)

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `supabase-schema.sql` in this project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **RUN** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

This creates:
- ✅ `vehicles` table (with 5 sample EVs)
- ✅ `charging_stations` table (with 5 sample stations)
- ✅ Proper indexes and security policies

### Step 3: Get Your API Keys (1 minute)

1. In Supabase, go to **Project Settings** (gear icon, bottom left)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://abc123xyz.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Update Environment Variables (1 minute)

1. Open the file `.env.local` in your project
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your_actual_key_here
```

3. Save the file

### Step 5: (Optional) Setup Google Maps API for Route Planner (5 minutes)

The Route Planner feature requires a Google Maps API key. Skip this if you don't need the route planner yet.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (for location autocomplete)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key
6. **Restrict your key** (Security → API restrictions):
   - Select "Restrict key"
   - Check only: Maps JavaScript API, Places API
   - Add website restriction: `localhost:3000/*` for development
7. Add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your_actual_key_here
```

**Note**: Google Maps has a $200/month free tier (sufficient for development).

---

## 🎯 Run Your App!

```powershell
# Start the development server
npm run dev
```

Then open: **http://localhost:3000**

You should see:
- 🎨 A beautiful green hero section
- 🚗 5 EV cards (BYD Atto 3, Nissan Leaf, MG ZS EV, BYD Dolphin, Tesla Model 3)
- 📊 Real pricing in LKR
- 🔋 Battery capacity and range estimates

---

## 📁 Project Structure

```
evguide-sl/
├── app/
│   ├── page.tsx          # Homepage (vehicle grid)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   └── supabase.ts       # Supabase client
├── types/
│   ├── database.ts       # TypeScript types
│   └── index.ts          # Type exports
├── components/           # (Empty - will add components next)
├── .env.local           # Environment variables (DO NOT COMMIT)
└── supabase-schema.sql  # Database setup SQL
```

---

## 🐛 Troubleshooting

### "No vehicles showing"
- ✅ Check `.env.local` has correct Supabase URL and key
- ✅ Restart dev server (`Ctrl+C` then `npm run dev`)
- ✅ Check browser console for errors (F12)

### "Remote image not allowed"
This is normal! Add this to `next.config.ts`:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

---

## 📅 What's Next? (Week 2)

- [ ] Vehicle detail page (click a card to see full specs)
- [ ] Search and filter functionality
- [ ] Comparison feature (select 2-3 vehicles)
- [ ] Add more vehicles to database

---

## 🎉 Congratulations!

You've successfully set up:
- ✅ Modern Next.js 14 app
- ✅ Supabase backend
- ✅ TypeScript type safety
- ✅ Tailwind CSS styling
- ✅ Database with real EV data

**Time to celebrate!** 🎊 You're ahead of Week 1 schedule!
