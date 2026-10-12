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

If you or a visitor sees an error when clicking "Sign In with Google" on your deployed Vercel site:

> **Why does this happen?**
> Firebase Authentication includes a security whitelist known as **Authorized Domains**. By default, new Firebase projects only authorize `localhost` and Google Cloud preview URLs. Whenever you deploy to Vercel (`*.vercel.app`), Firebase will block Google Sign-In with an `auth/unauthorized-domain` error until you add the domain.

### 60-Second Fix:
1. Copy your Vercel deployment URL (e.g. `ndulu-dealers.vercel.app` — **without** `https://` or trailing `/`).
2. Open the [Firebase Console Authentication Settings](https://console.firebase.google.com/project/ai-studio-ndulugeneraldeal-c0184c7e-e088-456c-bdcb-3ccf481763cc/authentication/settings).
3. Under the **Authorized domains** card, click **Add domain**.
4. Paste your Vercel domain (e.g. `ndulu-dealers.vercel.app`) and click **Save**.
5. Refresh your deployed app — Google Sign-In is now 100% active!

### Note for Visitors & Mining Clients:
- **No login is required for visitors!** Clients can browse mining hardware, explore heavy-duty spares, run safety compliance checks, configure tender scopes, and submit quote requests with zero sign-in.
- Visitors can also click **Continue as Guest Visitor** right from the navigation bar or quote builder.

