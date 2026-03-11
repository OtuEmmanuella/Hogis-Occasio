# 🎉 Hogis Occasio — Smart Holiday Notification System

> **Automatically send personalized holiday greetings to your guests via Email & SMS**  
> Built for Nigerian businesses. Powered by Supabase, Resend & Africa's Talking.

---

## ✨ What It Does

**Hogis Occasio** is a full-stack Next.js application that lets you:

- 📋 **Manage a guest list** — Add guests with email, phone, group, and notification preferences
- 📅 **Track public holidays** — Pre-loaded with Nigerian national holidays + international ones
- 📧 **Send emails** — Beautiful branded HTML emails via Resend (free: 3,000/month)
- 📱 **Send SMS** — Reliable SMS via Africa's Talking (best for Nigeria) or Twilio
- 🚀 **One-click broadcasting** — Send to everyone or filter by group/channel
- 📊 **Full history logs** — Track every sent, failed, or pending notification
- ⚙️ **Auto-scheduling** — Set it to send automatically on holiday day

---

## 🎨 What Makes It Stand Out

| Feature | Description |
|---------|-------------|
| **Web3 Cyberpunk UI** | Dark neon interface with Orbitron font, glowing effects, framer-motion animations |
| **Personalization** | Use `{{name}}` in messages — each guest gets their first name |
| **Smart Filtering** | Target specific groups (VIP, Staff, Customers) per broadcast |
| **Multi-channel** | Email + SMS simultaneously with individual opt-in per guest |
| **Nigeria-first** | Pre-loaded with all Nigerian public holidays (NG + religious) |
| **Real-time feedback** | Live send progress, delivery stats, system status indicators |
| **Free stack** | Supabase (free) + Resend (free) + Africa's Talking (pay-as-you-go) |

---

## 🚀 Quick Setup (15 minutes)

### 1. Install dependencies
```bash
cd hogis-occasio
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run
3. Copy your **Project URL** and **Anon Key** from Settings → API

### 3. Set up Resend (Email)
1. Go to [resend.com](https://resend.com) → Sign up (free)
2. Create an API key
3. Verify your sending domain (or use their sandbox)

### 4. Set up Africa's Talking (SMS)
1. Go to [africastalking.com](https://africastalking.com) → Register
2. Create an API key
3. Add a Sender ID "HOGIS" (requires approval) or use default

### 5. Configure environment
```bash
cp .env.local.example .env.local
# Fill in all the values
```

### 6. Run the app
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
hogis-occasio/
├── app/
│   ├── page.tsx                     # 🌟 Landing page
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Cyberpunk CSS theme
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar layout
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── guests/page.tsx         # Guest management (CRUD)
│   │   ├── holidays/page.tsx       # Holiday management
│   │   ├── send/page.tsx           # Broadcast center
│   │   ├── history/page.tsx        # Notification logs
│   │   └── settings/page.tsx       # App configuration
│   └── api/
│       └── send-notifications/     # Email + SMS API route
│           └── route.ts
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Animated sidebar nav
│   │   └── Header.tsx              # Top header with clock
│   └── ui/
│       └── StatCard.tsx            # Neon glow stat cards
├── lib/
│   ├── supabase.ts                  # Supabase client + types
│   └── holidays.ts                  # Holiday data + utilities
├── supabase-schema.sql              # 📋 Run this in Supabase SQL Editor
└── .env.local.example               # Environment variables template
```

---

## 🔧 Free Tier Summary

| Service | Free Tier | Use |
|---------|-----------|-----|
| **Supabase** | 500MB DB, 2GB transfer | Database, auth |
| **Resend** | 3,000 emails/month | Email delivery |
| **Africa's Talking** | Pay-as-you-go (~₦2/SMS) | SMS delivery |
| **Vercel** | Free deployment | Hosting |

---

## 📅 Pre-loaded Nigerian Holidays

- 🎆 New Year's Day (Jan 1)
- ❤️ Valentine's Day (Feb 14)
- 👩 International Women's Day (Mar 8)
- ✝️ Good Friday / Easter Monday
- ⚒️ Workers' Day (May 1)
- 🕌 Eid al-Fitr (varies)
- 🇳🇬 Democracy Day (Jun 12)
- 🕌 Eid al-Adha (varies)
- 🦅 Independence Day (Oct 1)
- 🎃 Halloween (Oct 31)
- 🎄 Christmas Day (Dec 25)
- 🎁 Boxing Day (Dec 26)
- 🥂 New Year's Eve (Dec 31)

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or use: vercel env add
```

---

## 📧 Email Template

Emails are sent as branded HTML with:
- Hogis header with gradient logo
- Personalized greeting with guest name
- Holiday message in styled card
- Professional footer

---

## 💡 Personalization Variables

Use in any message template:
- `{{name}}` → Guest's first name
- `{name}` → Also works

Example: `"Happy Christmas, {{name}}! 🎄 The Hogis family wishes you joy!"`

---

## 🔒 Security Notes

For production:
1. Add Supabase Auth (email/password or magic link)
2. Tighten RLS policies to user-specific data
3. Add rate limiting to the API route
4. Use HTTPS and secure headers

---

Built with ❤️ by Hogis Group · Port Harcourt, Nigeria 🇳🇬
