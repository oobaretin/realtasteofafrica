# Deploy to Vercel

## Option A: Root Directory (Recommended)

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** → **Build & Development**
3. Find **Root Directory** → set to `realtasteofafrica`
4. **Save** and redeploy

## Option B: Root-Level Config (Fallback)

If Root Directory isn't working, the repo root now has `package.json` and `vercel.json` that build from the subfolder. Ensure **Root Directory is empty** in Vercel settings so it uses the root config.

## Troubleshooting

- **Builds not triggering?** Check **Settings** → **Git** — confirm the repo is connected and Production Branch is `main`.
- **Build fails?** Open the failed deployment → **Building** tab → scroll to the error. Share the exact error message.
- **Deploy from CLI:** `cd realtasteofafrica && npx vercel` (deploys from app folder directly).

## Environment Variables

Add these in **Settings** → **Environment Variables**:

- `ADMIN_KEY` — secret for `/admin?key=xxx`
- `RESEND_API_KEY` — for admin email notifications
- `RESEND_FROM` — verified sender email (e.g. `noreply@yourdomain.com`)

## After Deploy

Your site will be at `https://your-project.vercel.app` (or your custom domain).
