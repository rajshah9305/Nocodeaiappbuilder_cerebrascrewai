# Deployment Guide - AI App Builder Pro

This guide covers deploying the AI App Builder Pro application to various platforms.

## Frontend Deployment

### 1. Vercel Deployment (Recommended)

#### Prerequisites
- Vercel account
- Git repository (GitHub, GitLab, or Bitbucket)

#### Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: pnpm build
   Output Directory: dist
   Install Command: pnpm install
   ```

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=https://zlxdgosmhxjirkcnlrrq.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your deployment URL

#### CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd ai-app-builder-pro
vercel

# Follow prompts to configure
# Production deployment
vercel --prod
```

### 2. Netlify Deployment

#### Via Git Repository

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your Git provider and repository

2. **Build Settings**
   ```
   Build command: pnpm build
   Publish directory: dist
   ```

3. **Environment Variables**
   Go to Site settings → Environment variables:
   ```
   VITE_SUPABASE_URL=https://zlxdgosmhxjirkcnlrrq.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy

#### CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
pnpm build

# Deploy
netlify deploy --prod --dir=dist
```

## Backend (Supabase)

The backend is already deployed on Supabase. No additional deployment needed.

### Edge Functions Status

✅ All edge functions are deployed and active:

- `api-key-management` - https://zlxdgosmhxjirkcnlrrq.supabase.co/functions/v1/api-key-management
- `ai-app-generation` - https://zlxdgosmhxjirkcnlrrq.supabase.co/functions/v1/ai-app-generation
- `chat-assistant` - https://zlxdgosmhxjirkcnlrrq.supabase.co/functions/v1/chat-assistant
- `project-management` - https://zlxdgosmhxjirkcnlrrq.supabase.co/functions/v1/project-management

### Database Status

✅ All required tables are created with proper RLS policies.

---

**Your application is now ready for production use!**