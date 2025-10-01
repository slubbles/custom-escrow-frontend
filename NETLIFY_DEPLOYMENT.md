# 🚀 Netlify Deployment Guide - Snarbles Token Sale Platform

## Quick Deploy to Netlify

### Method 1: One-Click Deploy (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

---

### Method 2: Netlify CLI

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```

#### Step 3: Initialize Your Site
```bash
netlify init
```

Follow the prompts:
- **Create & configure a new site** → Yes
- **Team** → Select your team
- **Site name** → snarbles-token-sale (or your preferred name)
- **Build command** → `npm run build`
- **Directory to deploy** → `.next`

#### Step 4: Deploy
```bash
# Deploy to production
netlify deploy --prod

# Or deploy a preview
netlify deploy
```

---

### Method 3: GitHub Integration (Best for CI/CD)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository: `slubbles/custom-escrow-frontend`
   - Configure build settings:

3. **Build Settings**
   ```
   Base directory:     (leave empty)
   Build command:      npm run build
   Publish directory:  .next
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

---

## 🔧 Environment Variables Setup

### Required Variables

Go to **Site settings** → **Environment variables** and add:

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program IDs
NEXT_PUBLIC_ESCROW_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
NEXT_PUBLIC_MULTI_PRESALE_PROGRAM_ID=3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5

# Token Configuration
NEXT_PUBLIC_SNRB_TOKEN_MINT=So11111111111111111111111111111111111111112
NEXT_PUBLIC_PAYMENT_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

# Admin
NEXT_PUBLIC_ADMIN_WALLET=YOUR_ADMIN_WALLET_ADDRESS

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Optional: WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

### Production Variables (when ready)

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# Or use premium RPC:
# NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY

NEXT_PUBLIC_ESCROW_PROGRAM_ID=YOUR_MAINNET_PROGRAM_ID
NEXT_PUBLIC_MULTI_PRESALE_PROGRAM_ID=YOUR_MAINNET_PROGRAM_ID
```

---

## 📋 Pre-Deployment Checklist

### 1. Install Dependencies
```bash
npm install @netlify/plugin-nextjs
```

### 2. Verify Build Locally
```bash
npm run build
npm start
```

### 3. Test Production Build
```bash
# Build and serve locally
npm run build
npx serve .next -p 3000
```

### 4. Check Configuration Files
- ✅ `netlify.toml` exists
- ✅ `.env.example` is complete
- ✅ `next.config.js` is optimized

---

## 🔐 Security Setup on Netlify

### 1. Enable HTTPS
- Automatically enabled by Netlify
- Force HTTPS redirect in site settings

### 2. Custom Domain (Optional)
1. Go to **Domain settings**
2. Add custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www (or @)
   Value: your-site.netlify.app
   ```

### 3. Enable Branch Deploys
- Go to **Build & deploy** → **Continuous deployment**
- Enable **Deploy previews** for pull requests
- Enable **Branch deploys** for specific branches

---

## 🚀 Netlify-Specific Optimizations

### 1. Next.js Plugin
Already configured in `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

This enables:
- ✅ Server-side rendering (SSR)
- ✅ Incremental Static Regeneration (ISR)
- ✅ API routes
- ✅ Image optimization
- ✅ Automatic cache optimization

### 2. Build Performance
Add to `package.json`:
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap"
  }
}
```

### 3. Asset Optimization
Headers configured in `netlify.toml`:
- Static assets: 1 year cache
- Images: 7 days cache
- HTML: No cache (for fresh content)

---

## 🔄 Continuous Deployment

### Automatic Deploys
Every push to `main` branch triggers:
1. ✅ Install dependencies
2. ✅ Run build command
3. ✅ Deploy to production
4. ✅ Purge CDN cache

### Deploy Contexts

#### Production
```bash
# Triggered by: Push to main branch
# URL: https://snarbles-token-sale.netlify.app
```

#### Deploy Preview
```bash
# Triggered by: Pull request
# URL: https://deploy-preview-123--snarbles-token-sale.netlify.app
```

#### Branch Deploy
```bash
# Triggered by: Push to other branches (if enabled)
# URL: https://branch-name--snarbles-token-sale.netlify.app
```

---

## 🎯 Post-Deployment Tasks

### 1. Test Deployment
```bash
# Check build logs
netlify open:site

# Test the site
curl -I https://your-site.netlify.app
```

### 2. Verify Functionality
- [ ] Homepage loads correctly
- [ ] Wallet connection works
- [ ] Navigation functions properly
- [ ] Forms submit successfully
- [ ] Images load correctly
- [ ] All routes accessible

### 3. Performance Testing
```bash
# Run Lighthouse audit
npx lighthouse https://your-site.netlify.app --view

# Check Core Web Vitals
```

### 4. Security Testing
- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] CSP configured
- [ ] No mixed content warnings

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** `Module not found` errors
```bash
# Solution: Clear cache and rebuild
netlify build --clear-cache
```

**Issue:** `Out of memory` during build
```bash
# Solution: Increase Node memory in netlify.toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Runtime Errors

**Issue:** `404` on dynamic routes
```bash
# Solution: Ensure [[redirects]] in netlify.toml includes SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Issue:** Environment variables not working
- Check they're prefixed with `NEXT_PUBLIC_` for client-side
- Redeploy after adding new variables
- Clear cache if needed

### Performance Issues

**Issue:** Slow initial load
```bash
# Solution: Enable split chunks in next.config.js
webpack: (config) => {
  config.optimization.splitChunks = {
    chunks: 'all',
  }
  return config
}
```

---

## 📊 Monitoring & Analytics

### 1. Netlify Analytics
Enable in Site settings → Analytics
- Real-time visitors
- Bandwidth usage
- Top pages
- 404 errors

### 2. Build Notifications
Set up in Site settings → Build & deploy → Deploy notifications:
- Slack
- Email
- Webhook

### 3. Error Tracking
Install Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to environment variables:
```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_auth_token
```

---

## 🔄 Update Deployment

### Via Git (Recommended)
```bash
git add .
git commit -m "Update: feature description"
git push origin main
# Automatically triggers deployment
```

### Via CLI
```bash
npm run build
netlify deploy --prod
```

### Rollback
```bash
# List deploys
netlify deploy:list

# Restore a previous deploy
netlify rollback
```

---

## 🌐 Custom Domain Setup

### 1. Add Domain
```bash
netlify domains:add yourdomain.com
```

### 2. Configure DNS
For **Netlify DNS**:
```
A record:    yourdomain.com → 75.2.60.5
CNAME:       www → your-site.netlify.app
```

For **External DNS** (Cloudflare, GoDaddy, etc.):
```
CNAME:       yourdomain.com → your-site.netlify.app
CNAME:       www → your-site.netlify.app
```

### 3. Enable SSL
- Automatic with Netlify (Let's Encrypt)
- Or upload custom certificate

---

## 🚦 Performance Optimization

### 1. Image Optimization
```bash
# Install next-image-export-optimizer
npm install next-image-export-optimizer

# Or use Netlify Large Media
netlify lm:install
```

### 2. Enable Post Processing
In Site settings → Build & deploy → Post processing:
- ✅ Asset optimization
- ✅ Pretty URLs
- ✅ Prerendering

### 3. Edge Functions (Advanced)
Create `netlify/edge-functions/hello.ts`:
```typescript
export default async (request: Request) => {
  return new Response("Hello from the edge!");
};
```

---

## 📈 Scaling Considerations

### Free Tier Limits
- 100 GB bandwidth/month
- 300 build minutes/month
- 1 concurrent build

### Pro Tier Benefits
- 1 TB bandwidth
- 25,000 build minutes
- 3 concurrent builds
- Background functions
- Analytics

### Enterprise
- Unlimited bandwidth
- SSO
- SLA
- Priority support

---

## ✅ Final Checklist

Before production launch:
- [ ] All environment variables set
- [ ] Custom domain configured
- [ ] HTTPS enabled and forced
- [ ] Security headers active
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Forms working correctly
- [ ] Wallet integration tested
- [ ] Performance optimized (Lighthouse > 90)
- [ ] SEO meta tags added
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] 404 page customized
- [ ] Redirects working
- [ ] Cache headers optimized

---

## 🎉 Success!

Your Snarbles Token Sale Platform is now live on Netlify!

### Quick Commands
```bash
# Open admin panel
netlify open:admin

# Open site
netlify open:site

# View logs
netlify logs

# Check status
netlify status
```

### Support Resources
- [Netlify Docs](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Community](https://answers.netlify.com)
- [Status Page](https://netlifystatus.com)

---

**🚀 Your token sale platform is production-ready and deployed!**

Happy launching! 🎊
