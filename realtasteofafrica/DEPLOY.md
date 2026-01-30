# Deploy to Vercel

## 1. Commit and push

From the **repo root** (one level above this folder):

```bash
cd /Users/osagieobaretin/realtasteofafrica
git add -A
git commit -m "Deploy: claim flow, PayPal, featured section, coverage map"
git push origin main
```

## 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. **Add New** → **Project** → import **oobaretin/realtasteofafrica**.
3. **Important:** set **Root Directory** to `realtasteofafrica` (the folder that contains `package.json`). Edit → set to `realtasteofafrica` → Save.
4. Before deploying, open **Environment Variables** and add:

   | Name                         | Value                    | Environment |
   |------------------------------|--------------------------|-------------|
   | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Your **Live** Client ID  | Production, Preview |
   | `PAYPAL_CLIENT_SECRET`       | Your **Live** Secret     | Production, Preview |
   | `PAYPAL_SANDBOX`             | `false`                  | Production (optional) |

   Use the same values as in your `.env.local` (Live app from [developer.paypal.com](https://developer.paypal.com/dashboard) → Live).

5. Click **Deploy**.

## 3. After deploy

- Your site will be at `https://your-project.vercel.app` (or your custom domain if you add one).
- The Claim page and PayPal button will work if the env vars are set.
- Do **not** commit `.env.local`; it is ignored by git.
