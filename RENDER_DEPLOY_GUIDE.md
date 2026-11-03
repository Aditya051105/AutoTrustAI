# 🚀 AutoTrust AI — Render Deployment Guide

This guide walks you through deploying **AutoTrust AI** (Django REST Framework + PostgreSQL + React 19 / Vite) to [Render](https://render.com).

---

## 🏗️ Architecture Overview on Render

AutoTrust AI is configured with production-grade components:

| Component | Render Service Type | Description |
|---|---|---|
| **Backend API** | **Web Service** (Python) | Django REST Framework running via Gunicorn, WhiteNoise for static files |
| **Database** | **PostgreSQL** (Managed) | Managed PostgreSQL instance auto-migrated and seeded |
| **Frontend UI** | **Static Site** (Node/Vite) | Single-page application compiled to `dist/` with client-side SPA rewrites |

---

## ⚡ Method 1: Instant Deployment via Render Blueprint (Recommended)

A pre-configured [`render.yaml`](./render.yaml) is included in the project root. It provisions the **Backend Web Service**, **PostgreSQL Database**, and **Frontend Static Site** together with linked environment variables in one click.

### Step 1: Push Project to GitHub

1. Open your terminal in the project root and commit the files:
   ```bash
   git add .
   git commit -m "Configure AutoTrust AI for Render deployment"
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `autotrust-ai`).

3. Link and push your code:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/autotrust-ai.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy Blueprint on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository (`autotrust-ai`).
4. Render will read [`render.yaml`](./render.yaml) and display 3 resources:
   - `autotrust-db` (PostgreSQL Database)
   - `autotrust-backend` (Web Service)
   - `autotrust-frontend` (Static Site)
5. Click **Apply**.
6. Render will automatically:
   - Provision the PostgreSQL database.
   - Run `build.sh` on the backend (installs requirements, applies migrations, seeds 8 demo vehicles & demo users).
   - Build the React/Vite frontend with production assets.
   - Link the frontend `VITE_API_URL` to your backend's live URL.

---

## 🛠️ Method 2: Manual Service Creation (Step-by-Step)

If you prefer to configure services individually in the Render UI:

### 1. Create the PostgreSQL Database
1. In Render Dashboard, click **New +** ➔ **PostgreSQL**.
2. **Name**: `autotrust-db`
3. **Database**: `autotrust`
4. **User**: `autotrust_user`
5. **Plan**: Free
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (e.g. `postgresql://...`).

---

### 2. Create the Backend Web Service
1. Click **New +** ➔ **Web Service**.
2. Connect your GitHub repo.
3. Configure the following fields:
   - **Name**: `autotrust-backend`
   - **Region**: Same region as database (e.g., `Oregon (US West)`)
   - **Root Directory**: `autotrust_backend`
   - **Runtime**: `Python`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn autotrust_backend.wsgi:application`
   - **Plan**: Free
4. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |---|---|---|
   | `PYTHON_VERSION` | `3.12.0` | Recommended Python version |
   | `DEBUG` | `False` | Disables debug mode in production |
   | `SECRET_KEY` | *(Click "Generate" or enter a random string)* | Secure Django secret key |
   | `DATABASE_URL` | *(Paste Internal Database URL from Step 1)* | Connects Django to PostgreSQL |
   | `ALLOWED_HOSTS` | `*` | Or Render external hostname |
5. Click **Deploy Web Service**.
6. Copy your backend live URL (e.g. `https://autotrust-backend.onrender.com`).

---

### 3. Create the Frontend Static Site
1. Click **New +** ➔ **Static Site**.
2. Connect your GitHub repo.
3. Configure the following fields:
   - **Name**: `autotrust-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures React Router routes like `/seller`, `/marketplace`, `/login` don't 404 on refresh)*
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<YOUR_BACKEND_NAME>.onrender.com/api/` |
6. Click **Deploy Static Site**.

---

## 🔑 Demo Login Credentials (Auto-Seeded)

Once deployment finishes, open your frontend URL to explore with pre-seeded accounts:

| Role | Username | Password | Access |
|---|---|---|---|
| **Seller** | `demo_seller` | `password123` | Seller Garage, Inventory Management, Buyer Offers |
| **Mechanic** | `demo_mechanic` | `password123` | Diagnostic Studio, 150-Point Inspection, Trust Score |
| **Buyer** | `demo_buyer` | `password123` | Marketplace, Real-time Offers, Escrow Roadmap |

---

## 🔍 Verification & Troubleshooting

- **CORS Issues**: `CORS_ALLOW_ALL_ORIGINS = True` is pre-configured in `settings.py`.
- **Database Connection**: `build.sh` automatically runs `python manage.py migrate` and `python populate.py` on every deploy.
- **Static Assets**: WhiteNoise (`whitenoise.middleware.WhiteNoiseMiddleware`) serves Django admin and static files without requiring an Nginx proxy.
- **Inspect Logs**: Check **Logs** tab in Render Dashboard for both Web Service and Static Site if a build fails.

