# Vercel Deployment Steps for CRM Dashboard (React + Vite)

1. **Login to Vercel**
   - Go to https://vercel.com and log in (or sign up) with your GitHub/GitLab/Bitbucket account.

2. **Import Project**
   - Click "Add New Project" and import your GitHub repo (or drag-and-drop the folder if deploying manually).

3. **Configure Project**
   - Set the **Framework Preset** to `Vite` (Vercel auto-detects this).
   - Set the **Build Command** to `npm run build` (default for Vite).
   - Set the **Output Directory** to `dist` (default for Vite).

4. **Environment Variables** (if needed)
   - If you use any, add them in the Vercel dashboard under Project Settings > Environment Variables.

5. **Routing for SPA**
   - The provided `vercel.json` ensures all routes are rewritten to `index.html` for React SPA routing.

6. **Deploy**
   - Click "Deploy". Vercel will install dependencies, build, and deploy your app.

7. **Production URL**
   - After deployment, Vercel provides a live URL for your app.

---

## Manual Deploy (Optional)
If you want to deploy from your local machine (not recommended for production):

1. Install Vercel CLI:
   ```sh
   npm i -g vercel
   ```
2. Run:
   ```sh
   vercel
   ```
   Follow the prompts to deploy.

---

## Useful Commands
- `npm install`      # Install dependencies
- `npm run dev`      # Start local dev server
- `npm run build`    # Build for production
- `npm run preview`  # Preview production build locally
- `vercel`           # Deploy using Vercel CLI (optional)
