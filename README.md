# Eyabantu Funerals

CRM and operations workspace for Eyabantu Funerals — members, claims, collections, funerals, and staff scheduling.

## Local development

```bash
npm install
cp .env.example .env.local
# Set DATABASE_URL to a PostgreSQL connection string and AUTH_SECRET
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login).

### Demo logins

| Role | Email | Password |
|------|-------|----------|
| Owner | `musa@eyabantu-funerals.co.za` | `Demo@2026` |
| Owner | `thandi@eyabantu-funerals.co.za` | `Demo@2026` |
| Management | `lindiwe.mgmt@eyabantu-funerals.co.za` | `Demo@2026` |
| Administration | `nomfundo.admin@eyabantu-funerals.co.za` | `Demo@2026` |
| Agent | `sibusiso.agent@eyabantu-funerals.co.za` | `Demo@2026` |
| Viewer | `zanele.viewer@eyabantu-funerals.co.za` | `Demo@2026` |

## Deploy on Vercel

This project is deployed as its own Vercel project (`eyabantu-funerals`), separate from other apps on the account.

1. Connect the GitHub repo to Vercel (or use `vercel link --project eyabantu-funerals`).
2. Add **Neon Postgres** via Vercel → Storage → Create Database.
3. Set `AUTH_SECRET` in Vercel environment variables (production, preview, development).
4. Deploy — the build runs `prisma db push` and `prisma db seed` automatically.

For Docker + persistent SQLite (alternative hosting), see [DEPLOY.md](./DEPLOY.md).
