# 🌐 ApexFit Studio OS — Production Deployment Manual

This step-by-step manual covers deploying both the **Frontend** and **Backend** to production cloud platforms.

---

## 🎯 Architecture Summary

- **Frontend**: React 19 + Vite 6 Single Page Application (SPA)
  - *Recommended Platform*: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
  - *Output Directory*: `dist`
- **Backend**: Node.js v22 + Express REST API
  - *Recommended Platform*: [Render](https://render.com) or [Railway](https://railway.app)
  - *Port*: `5000` (or `$PORT` assigned by host)
- **Database**: Cloud MongoDB
  - *Recommended Service*: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free M0 Shared Cluster)

---

## 📋 Step 1: Set Up Cloud Database (MongoDB Atlas)

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a new **M0 (Free)** cluster (choose AWS / GCP / Azure in your closest region).
3. Under **Security → Database Access**:
   - Create a database user with username and password (e.g. `apexfit_admin` : `<your_password>`).
4. Under **Security → Network Access**:
   - Click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so cloud backend instances can connect.
5. Under **Deployment → Database → Connect**:
   - Select **Drivers** (Node.js).
   - Copy the connection string:
     ```
     mongodb+srv://apexfit_admin:<your_password>@cluster0.xxxx.mongodb.net/apexfit_production_db?retryWrites=true&w=majority
     ```

*(Note: If you skip MongoDB Atlas, the backend automatically engages its resilient high-speed in-memory store!)*

---

## 🚀 Step 2: Deploy Backend API (Render.com)

1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub / GitLab repository containing `apexfit-studio-os`.
4. Configure service parameters:
   - **Name**: `apexfit-backend-api`
   - **Region**: Closest to your users
   - **Root Directory**: `production/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | *Your MongoDB Atlas connection URI from Step 1* |
   | `API_SECRET_KEY` | `Bearer apexfit-secret-key-2026` |
   | `CORS_ORIGIN` | `*` (or your frontend domain once deployed) |
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://apexfit-backend-api.onrender.com`).
8. Verify it works by opening:  
   `https://apexfit-backend-api.onrender.com/api/v1/system/health`

---

## ⚡ Step 3: Deploy Frontend Client (Vercel)

1. Sign in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your Git repository.
4. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`production/frontend`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://apexfit-backend-api.onrender.com` *(Your backend URL from Step 2, without trailing slash)* |
6. Click **Deploy**.
7. Vercel will build the frontend in ~15 seconds. Once finished, visit your live URL!

> **Note on Client-Side Routing**:  
> The file [`production/frontend/vercel.json`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/vercel.json) and [`production/frontend/public/_redirects`](file:///d:/Web%20Tech%20Experiments/apexfit-studio-os/production/frontend/public/_redirects) are pre-configured to redirect all subroutes (`/athletes`, `/session`, `/analytics`, `/equipment`, `/engine`) to `index.html` so page refreshes never return 404.

---

## 🐳 Alternative: 1-Click Containerized Deployment (Docker / VPS)

If deploying to a VPS (e.g. DigitalOcean, AWS EC2, Linode, or Hetzner):

1. SSH into your server and clone the repository:
   ```bash
   git clone <your-repo-url>
   cd apexfit-studio-os/production
   ```
2. Run Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. This spins up:
   - **`apexfit-mongodb`** on port `27017` with persistent volumes
   - **`apexfit-backend`** on port `5000` connected to MongoDB

---

## ✅ Post-Deployment Verification Checklist

1. [ ] **Health Check**: Open `https://<backend-url>/api/v1/system/health`. Should return status `Operational` and `MongoDB Live`.
2. [ ] **Athlete Intake**: Open `https://<frontend-url>/athletes`, fill out an intake registration, and verify the live BMI metric and database enrollment.
3. [ ] **Live Training Floor**: Open `/session`, click `+ Log Set`, and verify that the set appears in the `/analytics` registry.
4. [ ] **Stream Piping**: On `/analytics`, click `⚡ Pipe Stream to Archive` to test the native Node.js stream pipeline.
5. [ ] **Equipment Inventory**: On `/equipment`, test adding or toggling equipment availability.
