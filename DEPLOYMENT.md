# Deploying Ndulu General Dealers to Vercel

This repository is pre-configured for seamless deployment to [Vercel](https://vercel.com).

## Option 1: Deploy with Git (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Ndulu General Dealers"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New…** > **Project**.
   - Select your Git repository and click **Import**.
   - Vercel will automatically detect **Vite**:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
3. **Configure Environment Variables**:
   In the **Environment Variables** section on Vercel:
   - Add `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key if you want live AI Safety Advisor recommendations. (If not provided, the advisor runs with comprehensive offline safety standards).

4. **Click Deploy**:
   - Vercel will build the frontend into static assets and deploy `/api/safety-advisor` as a serverless function.

---

## Option 2: Deploy with Vercel CLI

If you have the [Vercel CLI](https://vercel.com/docs/cli) installed:

```bash
# Login to Vercel
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## Important: Firebase Authentication & Authorized Domains

Because this app uses Google Sign-In with Firebase:

1. Copy your Vercel deployment URL (e.g. `your-app.vercel.app`).
2. Go to the [Firebase Console](https://console.firebase.google.com).
3. Select your project: **`ai-studio-ndulugeneraldeal-c0184c7e-e088-456c-bdcb-3ccf481763cc`**
4. Navigate to **Authentication** > **Settings** > **Authorized domains**.
5. Click **Add domain** and enter your Vercel domain (e.g., `your-app.vercel.app`).
6. Save. Google Sign-In and Admin verification will now work flawlessly on your live Vercel domain!
