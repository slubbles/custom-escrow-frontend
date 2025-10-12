# Snarbles Token Sale Platform

A decentralized platform that allows projects to launch multi-tier token sales with built-in escrow protection and vesting schedules on Solana.

<img width="1460" alt="Snarbles Platform Screenshot" src="https://github.com/user-attachments/assets/placeholder-screenshot.png" />

## Features

- **Multi-Tier Token Sales**: Launch Seed, Private, and Public sale rounds with different pricing
- **Escrow Protection**: All funds secured in smart contract escrow until sale completion
- **Vesting Schedules**: Configure cliff periods and linear vesting for token distribution
- **Project Management**: Complete dashboard for creators to manage sales and analytics
- **Portfolio Tracking**: Real-time investment monitoring with P&L calculations
- **Wallet Integration**: Seamless connection with Phantom, Solflare, and WalletConnect
- **Responsive Design**: Clean, modern UI that works on all devices
- **Admin Controls**: Project approval and platform management features

## Prerequisites

Before using the platform, ensure you have:

- A Solana wallet (Phantom, Solflare, or WalletConnect-compatible)
- Sufficient SOL for transaction fees (Devnet SOL for testing)
- Node.js 20+ for local development

## Usage Guide

### For Investors

#### 1. Connect Your Wallet
- Visit the platform
- Click "Connect Wallet" in the navigation
- Select your wallet provider and approve the connection

#### 2. Browse Token Sales
- Explore featured projects on the homepage
- Visit the marketplace to see all active sales
- Filter by category, price, or sale type

#### 3. Purchase Tokens
- Select a project you're interested in
- Choose a sale round (Seed/Private/Public)
- Enter the amount of tokens you want to purchase
- Review the price, fees, and vesting schedule
- Approve the transaction in your wallet

#### 4. Track Your Investments
- Visit your portfolio to see all investments
- Monitor vesting progress and unlock schedules
- Claim vested tokens when available
- View P&L and transaction history

### For Project Creators

#### 1. Create a Project
- Connect your wallet
- Navigate to "Create Project"
- Fill in project details:
  - Name, description, and category
  - Social links (website, Twitter, Discord)
  - Token mint address
  - Target fundraising amount

#### 2. Configure Sale Rounds
- Set up multiple sale rounds with different parameters:
  - Sale type (Seed/Private/Public)
  - Price per token
  - Token allocation
  - Start and end dates
  - Max purchase limits
  - Whitelist requirements

#### 3. Set Vesting Schedule
- Configure token vesting parameters:
  - Cliff duration (e.g., 6 months)
  - Vesting duration (e.g., 18 months)
  - TGE unlock percentage
  - Linear or milestone-based release

#### 4. Launch and Monitor
- Submit for admin approval
- Once approved, your sale goes live
- Monitor sales in your creator dashboard
- Track buyer count, funds raised, and progress
- Funds are held in escrow until sale completion

### For Administrators

- Approve or reject project submissions
- Verify token contracts and project details
- Monitor platform-wide analytics
- Manage platform configuration
- Emergency pause controls

## Technical Details

The platform is built using:

- **Frontend**: Next.js 14 with App Router and TypeScript
- **Blockchain**: Solana blockchain with Anchor framework
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query and Context API
- **Wallet Adapters**: Solana wallet adapter with multi-wallet support

## Smart Contracts

- **Multi-Presale Program**: `3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5`
- **Escrow Program**: `HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4`
- **Network**: Solana Devnet (Mainnet ready)

## Platform Fees

- **Platform Fee**: 2.5% on successful token sales
- **Transaction Fees**: Standard Solana network fees apply

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/slubbles/custom-escrow-frontend.git

# Navigate to project directory
cd custom-escrow-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program IDs
NEXT_PUBLIC_ESCROW_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
NEXT_PUBLIC_MULTI_PRESALE_PROGRAM_ID=3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5

# Admin Configuration
NEXT_PUBLIC_ADMIN_WALLET=your_admin_wallet_address

# Optional: WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Build Commands

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm start            # Run production server
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx           # Homepage
│   ├── projects/          # Project browsing and details
│   ├── portfolio/         # Investor portfolio
│   ├── create-project/    # Project creation
│   └── dashboard/         # Creator dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Navigation.tsx    # Main navigation
│   └── PurchaseDialog.tsx # Token purchase modal
├── hooks/                 # Custom React hooks
│   ├── useEscrow.ts      # Escrow contract interactions
│   ├── useMultiPresale.ts # Presale contract interactions
│   └── usePortfolio.ts   # Portfolio data fetching
├── lib/                   # Utilities and configurations
│   ├── solana.ts         # Solana connection setup
│   ├── types.ts          # TypeScript types
│   └── pdas.ts           # Program Derived Addresses
└── contexts/              # React context providers
    └── WalletContext.tsx # Wallet state management
```

## Deployment

### Netlify (Recommended)

```bash
# Automatic deployment on git push
git push origin main

# Or manual deployment
npm run build
netlify deploy --prod
```

### Vercel

```bash
vercel --prod
```

For detailed deployment instructions, see:
- `DEPLOYMENT.md` - General deployment guide
- `NETLIFY_DEPLOYMENT.md` - Netlify-specific setup

## Troubleshooting

Common issues and solutions:

- **Wallet Connection Failed**: Ensure your wallet extension is installed and unlocked
- **Transaction Error**: Check that you have sufficient SOL for gas fees
- **RPC Error**: The public RPC may be rate-limited; consider using a premium RPC provider
- **Program Not Found**: Verify you're connected to the correct network (Devnet/Mainnet)

## Documentation

- `QUICKSTART.md` - Quick start guide
- `DEPLOYMENT.md` - Deployment instructions  
- `EXPECTED_USER_EXPERIENCE.md` - Complete user journey documentation
- `SMART_CONTRACT_REQUIREMENTS.md` - Smart contract specifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Live Demo](https://your-netlify-url.netlify.app) *(coming soon)*
- [Solana Documentation](https://docs.solana.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Anchor Framework](https://anchor-lang.com/)

---

Built with ❤️ for the Solana ecosystem