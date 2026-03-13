# Deploy to Vercel

## Root Directory (Required)

The Next.js app lives in the `realtasteofafrica/` subfolder. **You must set the Root Directory in Vercel** or builds will fail.

### Steps

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** → **General**
3. Find **Root Directory**
4. Click **Edit** and set to: `realtasteofafrica`
5. Click **Save**
6. Go to **Deployments** → trigger a new deployment (or push a commit)

### Why

The repo structure is:

```
realtasteofafrica/          ← repo root (no package.json here)
└── realtasteofafrica/      ← Next.js app (package.json, src/, etc.)
    ├── package.json
    ├── next.config.js
    └── src/
```

Without the Root Directory set, Vercel looks at the repo root and finds no `package.json`, so the build fails.

## Environment Variables

Add these in **Settings** → **Environment Variables**:

- `ADMIN_KEY` — secret for `/admin?key=xxx`
- `RESEND_API_KEY` — for admin email notifications
- `RESEND_FROM` — verified sender email (e.g. `noreply@yourdomain.com`)

## After Deploy

Your site will be at `https://your-project.vercel.app` (or your custom domain).
