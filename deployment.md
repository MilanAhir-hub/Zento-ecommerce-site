# 🚀 Zento E-Commerce Deployment Guide

This document provides a comprehensive overview of the environment variables required for both the **Frontend (Vercel)** and **Backend (Render)**, as well as a detailed step-by-step deployment guide.

---

## 🔑 Environment Keys Summary

### 📱 Client (Vercel) Environment Variables
These keys must be added to your **Vercel Project Settings > Environment Variables** page.

| Key | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-render-app.onrender.com/api` | The base API URL pointing to your Render backend web service. |
| `VITE_GOOGLE_CLIENT_ID` | `[YOUR_GOOGLE_CLIENT_ID].apps.googleusercontent.com` | Google Developer Console Client ID for frontend Google Authentication. |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_...` or `rzp_live_...` | Razorpay Key ID used on the frontend. *Must match the key configured on the server.* |

> [!WARNING]
> **Razorpay Key Mismatch:** Ensure that both client and server use the exact same Razorpay account credentials in production!

---

### 🖥️ Server (Render) Environment Variables
These keys must be added to your **Render Web Service > Environment** tab.

| Key | Recommended Value / Source | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | *Optional.* Render dynamically sets the `PORT` env variable for you, but keeping it set to `5000` is fine as a fallback. |
| `MONGO_URI` | `mongodb+srv://[username]:[password]@cluster.mongodb.net/database` | MongoDB Atlas connection string. |
| `JWT_SECRET` | `[YOUR_JWT_SECRET_STRING]` | Secret token signing string for user JWT authorization. |
| `CLIENT_URL` | `https://your-vercel-site.vercel.app` | The production URL of your Vercel-deployed frontend. Used for CORS authorization rules in `server/index.ts`. |
| `EMAIL_HOST` | `smtp-relay.brevo.com` | Brevo SMTP Relay server host name. |
| `EMAIL_PORT` | `2525` | SMTP Relay Port. |
| `EMAIL_USER` | `[YOUR_EMAIL_USER]` | Brevo SMTP authenticated user login. |
| `EMAIL_PASS` | `[YOUR_EMAIL_SMTP_KEY]` | Brevo SMTP authenticated user password / API key. |
| `EMAIL_FROM_NAME` | `ZENTO` | Sender name shown in transactional emails. |
| `EMAIL_FROM_ADDRESS` | `[YOUR_AUTHORIZED_SENDER_EMAIL]` | Authorized sender email address. |
| `GOOGLE_CLIENT_ID` | `[YOUR_GOOGLE_CLIENT_ID].apps.googleusercontent.com` | Google Console OAuth 2.0 Client ID (must match client). |
| `GOOGLE_CLIENT_SECRET` | `[YOUR_GOOGLE_CLIENT_SECRET]` | Google Console OAuth 2.0 Client Secret. |
| `CLOUDINARY_CLOUD_NAME`| `[YOUR_CLOUDINARY_CLOUD_NAME]` | Cloudinary storage account name. |
| `CLOUDINARY_API_KEY` | `[YOUR_CLOUDINARY_API_KEY]` | Cloudinary access API key. |
| `CLOUDINARY_API_SECRET` | `[YOUR_CLOUDINARY_API_SECRET]` | Cloudinary access API secret key. |
| `GEMINI_API_KEY` | `[YOUR_GEMINI_API_KEY]` | Gemini Google Generative AI key for models, image description, and semantic embeddings. |
| `REMOVE_BG_API_KEY` | `[YOUR_REMOVE_BG_API_KEY]` | API key for remove.bg image background removal. |
| `REPLICATE_API_TOKEN` | `[YOUR_REPLICATE_API_TOKEN]` | Replicate token for visual/image generation tools. |
| `RAZORPAY_KEY_ID` | `[YOUR_RAZORPAY_KEY_ID]` | Razorpay merchant API Key ID. |
| `RAZORPAY_KEY_SECRET` | `[YOUR_RAZORPAY_KEY_SECRET]` | Razorpay merchant API Key Secret. |
| `HF_TOKEN` | `[YOUR_HUGGING_FACE_TOKEN]` | Hugging Face Access Token for FLUX model-based banner generation. |

---

## 💻 Step-by-Step Server Deployment on Render

### Step 1: Push Repository to GitHub
Ensure all your backend changes are pushed to your GitHub repository:
```bash
git push origin main
```

### Step 2: Create a Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and sign in.
2. Click **New +** at the top right and select **Web Service**.
3. Link your GitHub account and select your repository (`Zento-ecommerce-site`).

### Step 3: Configure Web Service Settings
Fill in the configuration details as follows:
- **Name**: `zento-ecommerce-backend` (or similar)
- **Region**: Select the region closest to your users.
- **Branch**: `main`
- **Root Directory**: `server` 
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
  *(This installs dependencies and compiles TypeScript to JavaScript using `tsc`)*
- **Start Command**: `node dist/index.js`
  *(This executes the compiled backend Javascript entrypoint)*
- **Plan**: Select **Free** (or your preferred tier)

### Step 4: Add Environment Variables
1. Scroll down to the **Environment Variables** section (or navigate to the **Environment** tab after creating the service).
2. Click **Add Environment Variable** and enter the keys listed in the [Server Environment Variables](#-server-render-environment-variables) section.
3. Once all variables are entered, click **Save Changes** or **Create Web Service**.

### Step 5: Configure MongoDB Atlas IP Access List
Render services (especially Free tier) use dynamic outbound IPs.
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to **Network Access** under the Security menu.
3. Click **Add IP Address**.
4. Since Render's outbound IPs are dynamic, add `0.0.0.0/0` (Allow Access from Anywhere) or use Render's premium outbound static IPs if you are on a paid Render plan.
5. Click **Confirm**.

---

## 🌐 Step-by-Step Client Deployment on Vercel

### Step 1: Create a Vercel Account & Import
1. Go to [Vercel](https://vercel.com/) and sign in using your GitHub account.
2. Click **Add New...** and select **Project**.
3. Import the `Zento-ecommerce-site` repository.

### Step 2: Configure Project Settings
In the configuration screen, expand the settings and configure:
- **Project Name**: `zento-ecommerce-site`
- **Framework Preset**: `Vite` (Vercel should automatically detect this)
- **Root Directory**: `client` *(Make sure to edit this so it points to the client folder rather than the root directory of the repo!)*
- **Build and Output Settings**:
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Install Command**: `npm install`

### Step 3: Add Environment Variables
Before deploying, expand the **Environment Variables** accordion and add the following:
- `VITE_API_URL`: Use the Render backend URL from your newly deployed backend (e.g., `https://zento-ecommerce-site-fdxa.onrender.com/api`).
- `VITE_GOOGLE_CLIENT_ID`: `[YOUR_GOOGLE_CLIENT_ID].apps.googleusercontent.com`
- `VITE_RAZORPAY_KEY_ID`: `[YOUR_RAZORPAY_KEY_ID]`

### Step 4: Click Deploy
1. Click **Deploy**.
2. Once complete, copy the generated Vercel production URL (e.g., `https://zento-ecommerce-site.vercel.app`).

---

## 🛠️ Post-Deployment Configurations

### 1. Update Google Developer Console (Authorized Origins)
Since you are using client-side Google OAuth, you must authorize your new Vercel domain:
1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Edit your OAuth 2.0 Client ID.
3. Under **Authorized JavaScript origins**, click **Add URI** and add your Vercel URL (e.g. `https://zento-ecommerce-site.vercel.app`).
4. Click **Save**.

### 2. Verify CORS Settings in Server
In [index.ts](file:///c:/Users/Milan%20Gagiya/Documents/PROJECT%20RESUME/ECOMMERCE/server/index.ts#L66), the CORS configuration already includes the default client production URL:
```typescript
const allowedOrigins = [
    "http://localhost:5173",
    "http://10.27.247.152:8081",
    "https://zento-ecommerce-site.vercel.app", // Matches your production Vercel deployment URL
];
```
If your Vercel deployment URL is different, make sure to update this list in `server/index.ts` and push the change to GitHub.

---

## 📝 Troubleshooting & Logs
- **Vercel Builds**: If the build fails on Vercel, check the Vercel deployment log. Ensure `client` is set as the root folder.
- **Render Web Service Startup**: If Render fails during startup, verify the start command is `node dist/index.js` and that `npm run build` completed without TypeScript errors. Check the logs in the Render console for details.
