# Snarbles Token Sale Frontend �

The official frontend for the Snarbles ($SNRB) token sale. Built with Next.js 14, TypeScript, and Tailwind CSS, featuring a landscape-inspired design system and full Solana smart contract integration.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Solana](https://img.shields.io/badge/Solana-Devnet-purple?style=flat-square&logo=solana)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 About Snarbles

Snarbles is the next generation of no-code blockchain creation tools. The $SNRB token powers our ecosystem and provides holders with:

- **🎨 Exclusive NFT Creation Tools**: Access our no-code NFT creation platform
- **🌐 Multi-Chain Support**: Deploy on Solana Devnet and Algorand Mainnet  
- **🔑 Premium Access**: Reduced fees and early access to new features
- **⚡ Ecosystem Benefits**: Governance rights and priority support

## 🌟 Features

### 🎨 Design System
- **Nature-Inspired Palette**: Sky blues, coral/salmon, golden yellows, forest greens, and charcoal grays
- **Landscape Aesthetics**: Mountain gradients, flowing animations, and organic shapes
- **Responsive Design**: Mobile-first approach with beautiful breakpoints
- **Glass Morphism**: Backdrop blur effects and translucent cards

### 🔗 Solana Integration
- **Wallet Connection**: Support for Phantom, Solflare, and other popular wallets
- **Smart Contract**: Full integration with deployed escrow program
- **Real-time Updates**: Live sale data and transaction status
- **Devnet Ready**: Deployed on Solana Devnet for testing

### 💼 Core Functionality
- **Token Sale Marketplace**: Browse and discover active token sales
- **Sale Creation**: Multi-step wizard for creating new token sales
- **Purchase Interface**: Intuitive token purchasing with cost breakdowns
- **Portfolio Tracking**: Track purchases, P&L, and transaction history
- **Sale Management**: View detailed sale information and statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)
- Some Devnet SOL for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd custom-escrow-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_ESCROW_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles and Tailwind config
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── marketplace/             # Token sale marketplace
│   ├── create/                  # Sale creation wizard
│   ├── portfolio/               # User portfolio tracking
│   └── sale/[id]/               # Individual sale details
├── components/                   # Reusable UI components
│   └── Navigation.tsx           # Main navigation bar
├── contexts/                     # React contexts
│   ├── WalletContext.tsx        # Solana wallet adapter setup
│   └── Providers.tsx            # Query client and toast providers
├── hooks/                        # Custom React hooks
│   └── useEscrow.ts             # Smart contract interaction hooks
└── lib/                         # Utility libraries
    └── solana.ts                # Solana connection and utilities
```

## 🎨 Design System

### Color Palette
The application uses a carefully crafted nature-inspired color palette:

- **Sky**: Light blues reminiscent of clear mountain skies
- **Coral**: Warm salmon and coral tones for accents
- **Golden**: Rich yellows like autumn leaves and sunlight
- **Forest**: Deep greens from mountain forests
- **Mountain**: Charcoal grays representing stone and peaks
- **Cream**: Soft whites and off-whites for backgrounds

### Components
- **Buttons**: Three variants (primary, secondary, outline) with hover animations
- **Cards**: Glass morphism effects with backdrop blur
- **Forms**: Consistent input styling with focus states
- **Navigation**: Responsive design with mobile menu

### Gradients
- **Landscape**: Multi-color gradient spanning the full palette
- **Mountain**: Dramatic dark gradients for headers and CTAs

## 🔧 Smart Contract Integration

### Deployed Program
- **Program ID**: `HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4`
- **Network**: Solana Devnet
- **Features**: Token escrow, sale management, buyer protection

### Key Functions
- `createSale`: Create new token sale with escrow
- `buyTokens`: Purchase tokens from active sales
- `activateSale`: Activate a created sale
- `pauseSale`: Pause/unpause sales
- `withdrawTokens`: Seller token withdrawal

### Data Structures
```typescript
interface TokenSale {
  tokenName: string;
  tokenSymbol: string;
  pricePerToken: number;
  totalTokens: number;
  tokensAvailable: number;
  saleStartTime: number;
  saleEndTime: number;
  maxTokensPerBuyer?: number;
  platformFeeBps: number;
  isActive: boolean;
  isPaused: boolean;
}
```

## 📱 Pages Overview

### 🏠 Landing Page (`/`)
- Hero section with animated gradients
- Feature showcase
- Platform statistics
- Call-to-action sections

### 🛒 Marketplace (`/marketplace`)
- Browse active token sales
- Search and filtering
- Sale cards with key metrics
- Quick purchase options

### ➕ Create Sale (`/create`)
- 4-step creation wizard
- Form validation
- Real-time calculations
- Preview functionality

### 💰 Portfolio (`/portfolio`)
- Purchase history
- P&L tracking
- Active positions
- Transaction details

### 🔍 Sale Details (`/sale/[id]`)
- Comprehensive sale information
- Real-time purchase interface
- Progress tracking
- Cost breakdowns

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Key Dependencies
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **@solana/web3.js**: Solana blockchain interaction
- **@coral-xyz/anchor**: Solana program framework
- **@solana/wallet-adapter**: Wallet connection management
- **@tanstack/react-query**: Server state management
- **react-hot-toast**: Toast notifications
- **lucide-react**: Beautiful icon library

### Environment Variables
```env
# Required
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ESCROW_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Optional
NEXT_PUBLIC_DEFAULT_TOKEN_MINT=So11111111111111111111111111111111111111112
NEXT_PUBLIC_DEFAULT_PAYMENT_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

## 🔧 Configuration

### Tailwind Configuration
The project includes a comprehensive Tailwind configuration with:
- Custom color palette
- Extended spacing scale
- Custom gradients
- Glass morphism utilities
- Responsive breakpoints

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*` → `./src/*`)
- Next.js plugin integration
- Comprehensive type checking

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
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