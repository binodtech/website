# Binod Suman Academy

Premium EdTech platform for FAANG interview prep, system design, AI engineering, and cloud careers.

**Separate from [binodsuman.com](https://binodsuman.com)** — this repo and deployment are independent. No cross-links to the personal site.

## Local development

This is an Astro app (not static HTML). After cloning:

```bash
git clone https://github.com/binodtech/website.git
cd website
npm install
npm run dev
```

Open **http://localhost:4321**

Production preview:

```bash
npm run build
npm run preview
```

This repo is separate from the personal HTML site [binodsuman.com](https://binodsuman.com) (`github.com/binodsuman/binodsuman`). To run that site locally, clone that repo and use `python3 -m http.server 8000`.

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

This project is already connected to **https://github.com/binodtech/website**.

```bash
cd binodtech
git remote -v
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
