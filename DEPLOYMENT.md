# 🚀 Deployment Guide - Snarbles Token Sale Platform

## Production Deployment Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Vercel account (recommended) or alternative hosting
- [ ] Solana mainnet program deployed
- [ ] Environment variables configured
- [ ] Domain name (optional)

---

## 📋 Pre-Deployment Steps

### 1. Environment Configuration

Create a production `.env.production` file:

```bash
# Copy example and update values
cp .env.example .env.production
```

**Required Production Variables:**
```env
# Solana Network (MAINNET for production)
NEXT_PUBLIC_SOLANA_NETWORK=mainnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Or use premium RPC for better performance
# NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY

# Production Program IDs
NEXT_PUBLIC_ESCROW_PROGRAM_ID=YOUR_MAINNET_PROGRAM_ID
NEXT_PUBLIC_MULTI_PRESALE_PROGRAM_ID=YOUR_MAINNET_PROGRAM_ID

# Production Token Mints
NEXT_PUBLIC_SNRB_TOKEN_MINT=YOUR_TOKEN_MINT_ADDRESS
NEXT_PUBLIC_PAYMENT_MINT=YOUR_PAYMENT_TOKEN_ADDRESS

# Admin Wallet
NEXT_PUBLIC_ADMIN_WALLET=YOUR_ADMIN_WALLET_ADDRESS

# Analytics (Optional but recommended)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_DEVNET=false
NEXT_PUBLIC_ENABLE_MAINNET=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### 2. Code Optimization

```bash
# Install dependencies
npm install

# Build and test locally
npm run build

# Start production server locally to test
npm start
```

### 3. Security Audit

- [ ] Review all API keys and secrets
- [ ] Ensure no sensitive data in client-side code
- [ ] Verify CORS settings
- [ ] Check CSP headers
- [ ] Test wallet connection security
- [ ] Verify transaction signing flow

---

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended)

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/custom-escrow-frontend)

#### Manual Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# Production deployment
vercel --prod

# Or use npm script
npm run deploy:vercel
```

4. **Configure Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all variables from `.env.production`
- Redeploy after adding variables

#### Vercel Configuration (`vercel.json`)
Already configured with:
- Security headers
- URL rewrites
- Redirects
- Build optimization

---

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Build for Netlify**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=.next
```

4. **Configure**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

### Option 3: AWS Amplify

1. **Connect Repository**
- Go to AWS Amplify Console
- Connect your GitHub repository
- Select the production branch

2. **Build Settings**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

### Option 4: Custom VPS (DigitalOcean, Linode, etc.)

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**
```bash
npm install -g pm2
```

3. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/yourusername/custom-escrow-frontend.git
cd custom-escrow-frontend

# Install dependencies
npm ci --production

# Build
npm run build

# Start with PM2
pm2 start npm --name "snarbles-frontend" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Post-Deployment Security

### 1. Enable HTTPS
- Use Let's Encrypt for free SSL
- Configure automatic renewal
- Force HTTPS redirects

### 2. Set up Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

### 3. Configure Analytics
- Set up Google Analytics
- Configure conversion tracking
- Monitor user flows

### 4. Set up Monitoring
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Vercel Analytics, New Relic
- **Error Tracking**: Sentry
- **Logs**: Papertrail, Loggly

---

## 🧪 Testing Production

### Pre-launch Checklist
- [ ] Test wallet connection (Phantom, Solflare)
- [ ] Test project creation flow
- [ ] Test token purchase flow
- [ ] Test all navigation links
- [ ] Test mobile responsiveness
- [ ] Test error handling
- [ ] Verify transaction confirmations
- [ ] Test with real SOL (small amounts)
- [ ] Check all environment variables
- [ ] Verify analytics tracking

### Load Testing
```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

### Performance Testing
- Run Lighthouse audit
- Check Core Web Vitals
- Test on slow 3G connection
- Verify bundle sizes

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check error rates in Sentry
- [ ] Monitor uptime status
- [ ] Review transaction volumes
- [ ] Check RPC endpoint health

### Weekly Reviews
- [ ] Analyze user analytics
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Review security alerts

### Monthly Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature updates
- [ ] User feedback review

---

## 🔄 CI/CD Setup

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SOLANA_NETWORK: ${{ secrets.SOLANA_NETWORK }}
          NEXT_PUBLIC_PROGRAM_ID: ${{ secrets.PROGRAM_ID }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🆘 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment Variables Not Working**
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after changing variables
- Check variable names match exactly

**RPC Errors**
- Switch to premium RPC provider
- Check rate limits
- Verify network status

**Wallet Connection Issues**
- Clear browser cache
- Check wallet adapter versions
- Verify network matches

---

## 📱 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate

### Cloudflare (Optional)
1. Add site to Cloudflare
2. Update nameservers
3. Enable proxy (orange cloud)
4. Configure SSL to "Full (strict)"

---

## 📈 Optimization Tips

1. **Use Premium RPC** - Better reliability and speed
2. **Enable CDN** - Faster global access
3. **Image Optimization** - Use WebP/AVIF formats
4. **Code Splitting** - Dynamic imports for large components
5. **Caching** - Configure aggressive caching headers
6. **Compression** - Enable Brotli/Gzip
7. **Database** - Consider adding for metadata

---

## 🎯 Launch Strategy

1. **Soft Launch** (Week 1)
   - Deploy to production
   - Test with small user group
   - Monitor performance
   - Fix critical issues

2. **Beta Launch** (Week 2-3)
   - Expand user access
   - Gather feedback
   - Optimize based on usage
   - Add requested features

3. **Full Launch** (Week 4)
   - Public announcement
   - Marketing push
   - Full support team ready
   - Monitor closely

---

## 📞 Support

- **Documentation**: [Link to docs]
- **Discord**: [Community link]
- **Email**: support@snarbles.io
- **Status Page**: status.snarbles.io

---

## ✅ Final Production Checklist

- [ ] All environment variables set correctly
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Analytics tracking working
- [ ] Error tracking active
- [ ] Monitoring dashboards set up
- [ ] Backup strategy in place
- [ ] Support channels ready
- [ ] Documentation complete
- [ ] Team trained on tools
- [ ] Rollback plan prepared
- [ ] Performance benchmarks met

**Ready to launch! 🚀**
