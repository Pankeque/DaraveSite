# Deployment Guide - Darave Studios

This guide explains how to deploy the application with the frontend on Vercel and the backend on Render.

## Architecture

```
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│           VERCEL (Frontend)         │     │          RENDER (Backend)           │
│                                     │     │                                     │
│  ┌─────────────────────────────┐   │     │  ┌─────────────────────────────┐   │
│  │     React Static Files      │   │     │  │     Express Server          │   │
│  │     daravestudios.vercel.app│   │     │  │     (your-api.onrender.com) │   │
│  └─────────────────────────────┘   │     │  └─────────────────────────────┘   │
│                                     │     │                                     │
└─────────────────────────────────────┘     │  ┌─────────────────────────────┐   │
                                            │  │   PostgreSQL Sessions       │   │
                                            │  │   (connect-pg-simple)       │   │
                                            │  └─────────────────────────────┘   │
                                            │                                     │
                                            └──────────────────┬──────────────────┘
                                                               │
                                                               ▼
                                            ┌─────────────────────────────────────┐
                                            │          SUPABASE (Database)        │
                                            │                                     │
                                            │  PostgreSQL Database                │
                                            │  vgvvkxhddibdriqktnyh.supabase.co   │
                                            └─────────────────────────────────────┘
```

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Supabase project (already set up)

---

## Step 1: Deploy Backend on Render

### 1.1 Create a new Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `darave-studios-api` |
| **Region** | Oregon (or closest to your users) |
| **Branch** | `main` |
| **Root Directory** | `.` (leave empty) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free |

### 1.2 Set Environment Variables

Add these environment variables in Render:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `DATABASE_URL` | `postgresql://postgres:...` | From Supabase |
| `SESSION_SECRET` | (auto-generate) | Click "Generate" button |
| `FRONTEND_URL` | `https://daravestudios.vercel.app` | Your Vercel URL |
| `SUPABASE_SERVICE_ROLE_KEY` | (from Supabase) | For RLS bypass |

### 1.3 Deploy

1. Click **Create Web Service**
2. Wait for the build to complete (~2-3 minutes)
3. Note your backend URL: `https://darave-studios-api.onrender.com`

---

## Step 2: Configure Frontend on Vercel

### 2.1 Set Environment Variables

In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add:

| Variable | Value |
|----------|-------|
| `API_URL` | `https://darave-studios-api.onrender.com` |

### 2.2 Redeploy

1. Go to **Deployments**
2. Click **Redeploy** on the latest deployment
3. This will inject the `API_URL` into the built files

---

## Step 3: Verify Deployment

### 3.1 Test Backend Health

```bash
curl https://your-api.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 3.2 Test Frontend

1. Visit `https://daravestudios.vercel.app`
2. Open browser DevTools (F12) → Console
3. Try to register/login
4. Check Network tab for API calls to your Render backend

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the console:

1. Verify `FRONTEND_URL` is set correctly in Render
2. Check that the backend is running (visit `/api/health`)
3. Ensure cookies are being sent with `credentials: "include"`

### Session Not Persisting

1. Check `SESSION_SECRET` is set in Render
2. Verify `DATABASE_URL` is correct
3. Check the `session` table exists in Supabase

### 405 Method Not Allowed

This means the backend is not receiving the request:
1. Verify the `API_URL` is correct in Vercel
2. Check that Render service is running (free tier spins down after inactivity)

### Cold Start Delays

Render free tier spins down after 15 minutes of inactivity:
- First request may take 30-60 seconds
- Subsequent requests are fast
- Upgrade to paid plan for always-on service

---

## Environment Variables Summary

### Render (Backend)

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PASSWORD@db.vgvvkxhddibdriqktnyh.supabase.co:5432/postgres
SESSION_SECRET=<generated-by-render>
FRONTEND_URL=https://daravestudios.vercel.app
SUPABASE_SERVICE_ROLE_KEY=<from-supabase>
```

### Vercel (Frontend)

```env
API_URL=https://darave-studios-api.onrender.com
```

---

## Database Migrations

Before deploying, ensure your database has the session table:

```sql
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
```

This is automatically created by `connect-pg-simple` if `createTableIfMissing: true` is set.

---

## Monitoring

### Render Logs

1. Go to your service in Render Dashboard
2. Click **Logs** tab
3. Look for `[DEBUG]` messages for authentication flow

### Vercel Logs

1. Go to your project in Vercel Dashboard
2. Click **Deployments** → select deployment
3. Click **Functions** or **Runtime Logs**

---

## Cost Estimate

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | Free |
| Render | Free | Free (with cold starts) |
| Supabase | Free Tier | Free |
| **Total** | | **$0/month** |

### Paid Alternative (No Cold Starts)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| Render | Starter | $7/month |
| **Total** | | **$27/month** |
