# ⚡ AutoTrust AI — Vercel Deployment Guide

This guide explains how to deploy **AutoTrust AI** on [Vercel](https://vercel.com).

---

## 🏗️ Architecture for Vercel

AutoTrust AI consists of:
1. **Frontend (React 19 + TypeScript + Vite + Tailwind CSS v4)**: Hosted on **Vercel** with global edge CDN, instant rebuilds, and automatic SSL.
2. **Backend (Django REST Framework + PostgreSQL/SQLite)**: Hosted on **Render** (or Railway / Fly.io / AWS), connecting seamlessly with the Vercel frontend.

---

## 🚀 3-Step Deployment to Vercel

### Step 1: Push latest code to GitHub

The required configuration files (`vercel.json` and `frontend/vercel.json`) are already added. Commit and push:
```powershell
git add .
git commit -m "Add Vercel deployment configuration and SPA rewrites"
git push origin main
```

---

### Step 2: Import Project in Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: **`Aditya051105/AutoTrustAI`**.

---

### Step 3: Configure Project Settings

In the Vercel **Configure Project** screen:

1. **Root Directory**:
   - Click **Edit** next to Root Directory.
   - Select **`frontend`** and click **Continue**.
   *(Vercel will automatically detect **Vite** as the framework!)*

2. **Build and Output Settings** (Automatic):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   Add this environment variable so the frontend knows where your live backend API is:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://autotrust-backend.onrender.com/api/` *(or your backend URL)*

4. Click **Deploy**.

---

## ✨ Features Automatically Enabled

- **SPA Routing**: Client-side routes (`/marketplace`, `/seller`, `/login`, `/vehicle/:id`) will work on page refresh without 404 errors due to `vercel.json` rewrites.
- **Production Performance**: Compressed asset bundles, Brotli/Gzip edge caching, and HTTPS out of the box.
- **Preview Deployments**: Every pull request or branch you push to GitHub will automatically get its own preview URL on Vercel.
