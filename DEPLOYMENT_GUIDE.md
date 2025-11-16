# MediGo - Deployment Guide 🚀

This guide will help you create a GitHub repository, push your code, and deploy your MediGo application.

## 📋 Prerequisites

- GitHub account
- Git installed on your machine
- All environment variables configured

---

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: **`MediGo`**
4. Description: `AI-powered medical appointment booking platform`
5. Choose **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

---

## Step 2: Prepare and Push Code

### 2.1 Stage All Changes

```bash
cd /Users/jiyaarora/DOCTOR-APPOINTMENT-WEBSITE
git add .
```

### 2.2 Commit Changes

```bash
git commit -m "Initial commit: MediGo - AI-powered medical appointment platform with AI symptom checker"
```

### 2.3 Add Remote Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/MediGo.git
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### 2.4 Push to GitHub

```bash
git branch -M main
git push -u origin main
```

---

## Step 3: Deployment Options

### Option A: Vercel (Recommended for Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel):

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your **MediGo** repository
4. Select the **`frontend`** folder as the root directory
5. Add environment variable:
   - `VITE_BACKEND_URL` = Your backend URL (e.g., `https://your-backend.railway.app`)
6. Click **"Deploy"**

#### Backend Deployment (Railway):

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select **MediGo** repository
4. Select the **`backend`** folder
5. Add environment variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `AI_API_KEY` = Your Groq API key
   - `AI_MODEL` = `llama-3.1-8b-instant`
   - `JWT_SECRET` = Your JWT secret
   - `PORT` = `4000` (or leave default)
   - `ADMIN_EMAIL` = Your admin email
   - `ADMIN_PASSWORD` = Your admin password
6. Click **"Deploy"**

---

### Option B: Render (Full Stack)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Create **Web Service** for backend:
   - Connect **MediGo** repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables
3. Create **Static Site** for frontend:
   - Connect **MediGo** repository
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add `VITE_BACKEND_URL` environment variable

---

### Option C: Netlify (Frontend) + Railway (Backend)

#### Frontend (Netlify):

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **MediGo** repository
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add environment variable: `VITE_BACKEND_URL`
6. Click **"Deploy site"**

---

## Step 4: Update Frontend Environment Variable

After backend deployment:

1. Get your backend URL (e.g., `https://medigo-backend.railway.app`)
2. Update frontend environment variable in Vercel/Netlify:
   - `VITE_BACKEND_URL` = `https://your-backend-url.com`

---

## Step 5: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if not already done)
3. Get your connection string
4. Add it to your backend environment variables as `MONGODB_URI`

---

## 🔒 Important: Environment Variables

### Backend (.env):
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_groq_api_key
AI_MODEL=llama-3.1-8b-instant
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_admin_password
```

### Frontend (.env):
```
VITE_BACKEND_URL=https://your-backend-url.com
```

**⚠️ Never commit .env files to GitHub!**

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and accessible
- [ ] Frontend can connect to backend (check browser console)
- [ ] MongoDB connection is working
- [ ] AI diagnosis feature is working
- [ ] User registration/login works
- [ ] Doctor booking works

---

## 🐛 Troubleshooting

### Backend not connecting:
- Check CORS settings in `backend/server.js`
- Verify environment variables are set correctly
- Check backend logs for errors

### Frontend can't reach backend:
- Verify `VITE_BACKEND_URL` is correct
- Check if backend URL has trailing slash (shouldn't)
- Verify CORS allows your frontend domain

### MongoDB connection issues:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
- Check connection string format
- Verify database name matches

---

## 📝 Notes

- Free tiers on Vercel, Netlify, and Railway are great for getting started
- Consider upgrading for production use
- Always keep your `.env` files secure and never commit them

Good luck with your deployment! 🎉

