# Share this demo on the web (Chrome and any browser)

A **public https link is created by your host**, not by the repo itself. After you deploy once, that URL stays valid for as long as the project stays online (for example `https://your-app.up.railway.app`).

This app uses **Next.js**, **Prisma**, and **SQLite**. For a **durable** demo (database survives restarts), run SQLite on a **mounted disk** using the included **Dockerfile**.

---

## Demo logins (same password for every account)

| Role            | Email                                       | Password   |
|-----------------|---------------------------------------------|------------|
| Owner           | `musa@eyabantu-funerals.co.za`    | `Demo@2026` |
| Owner           | `thandi@eyabantu-funerals.co.za`| `Demo@2026` |
| Management      | `lindiwe.mgmt@eyabantu-funerals.co.za` | `Demo@2026` |
| Administration  | `nomfundo.admin@eyabantu-funerals.co.za` | `Demo@2026` |
| Agent           | `sibusiso.agent@eyabantu-funerals.co.za` | `Demo@2026` |
| Viewer          | `zanele.viewer@eyabantu-funerals.co.za`  | `Demo@2026` |

Public site: `/` — Staff login: `/login` — Owner CRM: `/owner` — Staff CRM: `/staff`.

---

## Recommended: Railway (Docker + volume)

1. Push this folder (`eyabantu-funerals`) to a **GitHub** repository.
2. In [Railway](https://railway.app), **New project** → **Deploy from GitHub** → select the repo.
3. Railway should detect the **Dockerfile**. Create a **web service** from that Dockerfile.
4. Add a **volume**: mount path **`/data`** (service settings → volumes).
5. Set **variables** on the service:
   - `DATABASE_URL` = `file:/data/prod.db`
   - `AUTH_SECRET` = a long random string (at least 32 characters), e.g. from `openssl rand -hex 32`
6. Deploy. Railway shows an **HTTPS URL** — that is the link you share.
7. Open it in Chrome (or any browser). First container boot runs migrations + seed; later boots keep the same database on the volume.

If the build fails on Prisma, check build logs; `DATABASE_URL` for **runtime** must stay `file:/data/prod.db` (the image already uses a throwaway DB only during `docker build`).

---

## Alternative: Fly.io, Render, or any VPS

- Build and run the same **Dockerfile**.
- Mount a host directory or volume on **`/data`**.
- Set `DATABASE_URL=file:/data/prod.db` and `AUTH_SECRET` as above.
- Map container port **3000** to HTTPS (the platform usually does this automatically).

---

## Quick temporary link (not permanent)

To show something **today** without deploying: run `npm run dev` locally, then use a tunnel such as [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) or [ngrok](https://ngrok.com/). Those URLs change when you restart the tunnel or free tier rotates — fine for a quick review, not “permanent.”

---

## Why not only Vercel serverless?

Vercel is excellent for Next.js, but **SQLite on serverless** has no reliable writable disk between invocations. For this demo stack, **Docker + volume** (above) is the straightforward way to get a stable database and logins. If you later move to **PostgreSQL** (Neon, Supabase, etc.), you can host on Vercel with a normal `DATABASE_URL` instead.

---

## Environment reference

| Variable        | Example                         | Purpose                          |
|----------------|----------------------------------|----------------------------------|
| `DATABASE_URL` | `file:/data/prod.db`             | SQLite file (persist on volume)  |
| `AUTH_SECRET`  | 64-character hex                 | Signs session cookies            |

Copy `.env.example` for local development; production values are set in the host’s dashboard.
