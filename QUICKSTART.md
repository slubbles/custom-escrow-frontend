# 🚀 Quick Start Guide - Production Ready

## What's New in This Version

### 🎨 **Enhanced UI/UX**
- Modern design system with glass morphism effects
- Smooth animations and transitions
- Professional loading states with shimmer effects
- Mobile-responsive navigation with hamburger menu
- Beautiful gradient buttons and cards

### 🛡️ **Security & Performance**
- Comprehensive input sanitization
- Rate limiting on transactions
- CSRF protection
- XSS prevention
- Optimized caching strategies
- Bundle optimization

### ♿ **Accessibility**
- Full keyboard navigation
- ARIA labels throughout
- Screen reader support
- Focus management
- Reduced motion support

### 📊 **Error Handling**
- User-friendly error messages
- Graceful error recovery
- Transaction error parsing
- Network error handling

---

## 🏃 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_MULTI_PRESALE_PROGRAM_ID=3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🎯 Using New Features

### Error Handling
```typescript
import { showError, showSuccess, withErrorHandling } from '@/lib/error-handler';

// Simple error display
try {
  await operation();
  showSuccess('Success!');
} catch (error) {
  showError(error); // Automatically parses and shows user-friendly message
}

// Wrapper for async operations
const result = await withErrorHandling(
  () => createProject(data),
  'Project created successfully!',
  'Failed to create project'
);
```

### Performance Utilities
```typescript
import { queryClient, CACHE_KEYS, debounce } from '@/lib/performance';

// Use standardized cache keys
useQuery({
  queryKey: CACHE_KEYS.project(projectId),
  ...
});

// Debounce user input
const debouncedSearch = debounce(handleSearch, 300);
```

### Security Features
```typescript
import { 
  sanitizeInput, 
  isValidSolanaAddress,
  transactionRateLimiter 
} from '@/lib/security';

// Sanitize user input
const cleanInput = sanitizeInput(userInput);

// Validate Solana address
if (!isValidSolanaAddress(address)) {
  throw new Error('Invalid address');
}

// Rate limit transactions
if (!transactionRateLimiter.isAllowed(walletAddress)) {
  throw new Error('Too many transactions');
}
```

### Accessibility Helpers
```typescript
import { 
  announceToScreenReader, 
  getFormFieldProps,
  handleKeyboardNav 
} from '@/lib/accessibility';

// Announce to screen readers
announceToScreenReader('Item added to cart', 'polite');

// Get accessible form field props
const { fieldId, labelProps, inputProps, errorProps } = getFormFieldProps(
  'Email',
  error,
  'Enter your email address',
  true // required
);
```

---

## 🎨 New CSS Classes

### Buttons
```html
<!-- Primary action -->
<button className="btn-primary">Launch Sale</button>

<!-- Secondary action -->
<button className="btn-secondary">Save Draft</button>

<!-- Destructive action -->
<button className="btn-danger">Delete</button>

<!-- Outline style -->
<button className="btn-outline">Learn More</button>

<!-- Minimal style -->
<button className="btn-ghost">Cancel</button>
```

### Cards
```html
<!-- Standard card with hover -->
<div className="card">...</div>

<!-- Elevated card -->
<div className="card-elevated">...</div>

<!-- Interactive/clickable card -->
<div className="card-interactive">...</div>

<!-- Glass morphism card -->
<div className="card-glass">...</div>
```

### Badges
```html
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-info">New</span>
<span className="badge badge-danger">Failed</span>
```

### Effects
```html
<!-- Glow effects -->
<div className="glow-sky">...</div>
<div className="glow-forest">...</div>
<div className="glow-golden">...</div>

<!-- Shimmer loading -->
<div className="skeleton h-4 w-full"></div>
```

---

## 📦 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── projects/          # Browse sales
│   ├── create-project/    # Create new project
│   ├── portfolio/         # User portfolio
│   └── admin/             # Admin dashboard
│
├── components/            # Reusable components
│   ├── Navigation.tsx     # Enhanced navigation
│   ├── LoadingStates.tsx  # Shimmer loaders
│   └── ...
│
├── lib/                   # Utilities
│   ├── error-handler.ts   # Error handling ✨ NEW
│   ├── performance.ts     # Performance utils ✨ NEW
│   ├── accessibility.ts   # A11y helpers ✨ NEW
│   ├── security.ts        # Security utils ✨ NEW
│   ├── types.ts           # TypeScript types
│   ├── pdas.ts            # Solana PDAs
│   └── solana.ts          # Solana config
│
├── hooks/                 # React hooks
│   ├── useMultiPresale.ts # Multi-presale hooks
│   ├── useEscrow.ts       # Escrow hooks
│   └── ...
│
└── contexts/              # React contexts
    ├── WalletContext.tsx  # Wallet adapter
    └── Providers.tsx      # Query client
```

---

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Or use the deploy button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

See `DEPLOYMENT.md` for complete deployment guide including:
- Environment setup
- Multiple platforms (Vercel, Netlify, AWS, VPS)
- Security checklist
- Monitoring setup
- CI/CD examples

---

## 🧪 Testing Your Changes

### Manual Testing Checklist
- [ ] Connect wallet (Phantom/Solflare)
- [ ] Create a new project
- [ ] Browse projects
- [ ] View project details
- [ ] Test mobile responsiveness
- [ ] Test keyboard navigation
- [ ] Check error handling
- [ ] Verify loading states

### Performance Testing
```bash
# Build for production
npm run build

# Run production server
npm start

# Run Lighthouse audit in Chrome DevTools
```

---

## 🔒 Security Features

### Active Protection
✅ **XSS Prevention** - Input sanitization  
✅ **CSRF Protection** - Token validation  
✅ **Rate Limiting** - Transaction throttling  
✅ **Clickjacking Prevention** - Frame options  
✅ **Secure Headers** - CSP, HSTS, etc.  
✅ **Input Validation** - Type checking  

### Rate Limits
- **Transactions**: 10 per minute
- **Wallet Connections**: 5 per 30 seconds
- **API Calls**: 30 per minute

---

## 📊 Performance Optimizations

### Query Caching
- **Stale Time**: 5 minutes
- **Cache Time**: 10 minutes
- **Auto Retry**: 3 attempts with exponential backoff

### Build Optimizations
- SWC minification enabled
- Console logs removed in production
- Image optimization (AVIF/WebP)
- Standalone output for Docker

### Bundle Size
Run `npm run build` to see bundle analysis

---

## ♿ Accessibility Features

### Keyboard Navigation
- `Tab` / `Shift+Tab` - Navigate elements
- `Enter` / `Space` - Activate buttons
- `Escape` - Close modals
- `Arrow keys` - Navigate lists

### Screen Reader Support
- ARIA labels on all interactive elements
- Semantic HTML structure
- Status announcements
- Error announcements

### Visual Accessibility
- High contrast support
- Reduced motion support
- Focus indicators
- Text scaling support

---

## 🐛 Troubleshooting

### Wallet Won't Connect
1. Check you're on the correct network (devnet/mainnet)
2. Ensure RPC endpoint is accessible
3. Try a different RPC provider
4. Clear browser cache

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
# Regenerate types
npm run build
```

### CSS Not Loading
The `@tailwind` and `@apply` warnings in globals.css are normal - Tailwind processes these at build time.

---

## 📚 Documentation

- `README.md` - This file
- `DEPLOYMENT.md` - Complete deployment guide
- `PRODUCTION_READY.md` - Implementation summary
- `DEVELOPMENT_STATUS.md` - Feature status
- `.env.example` - Environment variables reference

---

## 🤝 Contributing

### Code Style
- Use TypeScript for type safety
- Follow existing patterns
- Add comments for complex logic
- Use semantic HTML
- Include ARIA labels

### Before Submitting
- [ ] Test all functionality
- [ ] Check TypeScript errors
- [ ] Verify mobile responsiveness
- [ ] Test accessibility
- [ ] Update documentation

---

## 📈 Monitoring

### Error Tracking
Configure Sentry in `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Analytics
Configure Google Analytics:
```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Performance
Use Vercel Analytics or similar for:
- Core Web Vitals
- Page load times
- User interactions
- Error rates

---

## 🎯 Production Checklist

Before going live:
- [ ] Set production environment variables
- [ ] Enable HTTPS
- [ ] Configure custom domain
- [ ] Enable error tracking
- [ ] Set up monitoring
- [ ] Test all user flows
- [ ] Security audit complete
- [ ] Performance benchmarks met
- [ ] Backup strategy in place

---

## 💬 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Discord**: [Community Link]
- **Email**: support@snarbles.io

---

## 📝 License

[Your License Here]

---

**Built with ❤️ using Next.js, Solana, and TypeScript**

🎉 **You're ready to launch!** 🚀
