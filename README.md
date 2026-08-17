# Binod Suman Academy

Premium EdTech platform for FAANG interview prep, system design, AI engineering, and cloud careers.

**Separate from [binodsuman.com](https://binodsuman.com)** — this repo and deployment are independent. No cross-links to the personal site.

## Local development

```bash
cd binodsuman-academy
npm install
npm run dev
```

Open **http://localhost:4321**

Production preview:

```bash
npm run build
npm run preview
```

## Site structure

| Route | Purpose |
|-------|---------|
| `/` | Marketing homepage + YouTube quality showcase |
| `/learn` | Full study catalog (Educative-style) |
| `/learn/[category]` | Category outline with free/locked topics |
| `/learn/[category]/[topic]` | Free lesson pages only |
| `/pricing` | Pro & Cohort plans |

## GitHub — separate account (recommended)

To avoid confusion with your personal `binodsuman` repo:

1. Create a **new GitHub account** or **Organization** (e.g. `binodsuman-academy` or `bsa-edtech`)
2. Create an empty repo: `website` or `academy`
3. Push this project:

```bash
cd binodsuman-academy
git init
git add .
git commit -m "Initial Binod Suman Academy site"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/academy.git
git push -u origin main
```

4. Connect **Cloudflare Pages** to this new repo (not binodsuman.com repo)

## Deployment

```
binodsumanacademy.com
    → GitHub (academy account)
    → Cloudflare Pages (Astro build)
    → Supabase (auth, progress) — later
    → Railway (APIs, Razorpay webhooks) — later
```

Build command: `npm run build`  
Output directory: `dist`

## Branding

- **Navbar:** Binod Academy (short)
- **Full name:** Binod Suman Academy (footer, legal)
- **Short code:** BSA

## Domain ideas (short)

| Domain | Notes |
|--------|-------|
| `bsaprep.com` | Short, memorable, interview-focused |
| `binodprep.com` | Personal brand + prep |
| `cracktech.io` | Generic but punchy |
| `techprep.academy` | Clear EdTech signal |
| `prepforge.io` | Startup-style name |

## Tech stack

- Astro 7 + TypeScript
- Tailwind CSS 4
- React islands (Framer Motion, Lucide)
- Dark / light mode
