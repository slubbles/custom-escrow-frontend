# Snarbles Token Sale Platform

> Production-ready Solana token sale platform with smart contract integration

## Quick Setup

```bash
# Clone & Install
git clone https://github.com/slubbles/custom-escrow-frontend.git
cd custom-escrow-frontend
npm install

# Configure Environment
cp .env.example .env.local
# Edit .env.local with your values

# Run Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_ADMIN_WALLET=your_wallet_address

# Program IDs (pre-configured)
NEXT_PUBLIC_ESCROW_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
NEXT_PUBLIC_MULTI_PRESALE_PROGRAM_ID=3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5

# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Stack

- **Framework**: Next.js 14 + TypeScript
- **Blockchain**: Solana (Web3.js + Anchor)
- **Styling**: Tailwind CSS + Custom Design System
- **State**: React Query + Context API
- **Wallets**: Phantom, Solflare, WalletConnect

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & configurations
└── contexts/            # React contexts
```

## Key Features

- ✅ **Multi-tier Token Sales** - Tiered pricing & vesting
- ✅ **Wallet Integration** - Multiple wallet support
- ✅ **Admin Dashboard** - Sale management & analytics
- ✅ **Portfolio Tracking** - Investment monitoring
- ✅ **Responsive Design** - Mobile-optimized
- ✅ **Production Ready** - Security, performance, accessibility

## Deployment

### Netlify (Recommended)
```bash
# Auto-deploy
git push origin main

# Manual
npm run build
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

## Smart Contracts

- **Escrow Program**: `HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4`
- **Multi-Presale**: `3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5`
- **Network**: Solana Devnet

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start           # Production server
npm run lint        # ESLint check
```

## Documentation

- `QUICKSTART.md` - Quick start guide
- `DEPLOYMENT.md` - Deployment instructions
- `NETLIFY_DEPLOYMENT.md` - Netlify-specific setup

## License

MIT © Snarbles
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

## 🧪 Testing

### Development Testing
1. Connect a Solana wallet with Devnet SOL
2. Browse the marketplace
3. Create a test sale
4. Purchase tokens
5. Check portfolio

### Wallet Setup
1. Install Phantom or Solflare wallet
2. Switch to Devnet
3. Get Devnet SOL from faucet
4. Connect to the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the blockchain infrastructure
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for hosting and deployment platform

## 🔗 Links

- [Solana Documentation](https://docs.solana.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Anchor Framework](https://anchor-lang.com/)

---

Built with ❤️ for the Solana ecosystem 🌄