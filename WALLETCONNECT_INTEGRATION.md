# WalletConnect Integration Guide

## Overview
WalletConnect has been successfully integrated into the Snarbles platform, allowing users to connect mobile wallets and other WalletConnect-compatible wallets to your Solana dApp.

## Setup Instructions

### 1. Get a WalletConnect Project ID
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new account or sign in
3. Create a new project
4. Copy your Project ID

### 2. Configure Environment Variables
Update your `.env.local` file with your WalletConnect Project ID:

```bash
# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-actual-project-id-here
```

Replace `your-actual-project-id-here` with the Project ID you obtained from WalletConnect Cloud.

### 3. Supported Wallets
The platform now supports:

- **Phantom** (Browser extension & mobile via WalletConnect)
- **Solflare** (Browser extension & mobile via WalletConnect)
- **WalletConnect** (Any WalletConnect-compatible Solana wallet)

### 4. Features
- **Cross-platform**: Works on desktop and mobile
- **QR Code**: Desktop users can scan QR codes with mobile wallets
- **Deep Links**: Mobile users get direct wallet links
- **Fallback**: If WalletConnect fails, standard wallet adapters are still available

## How It Works

### For Desktop Users:
1. Click "Select Wallet" 
2. Choose "WalletConnect"
3. Scan the QR code with your mobile wallet
4. Approve the connection on your mobile device

### For Mobile Users:
1. Click "Select Wallet"
2. Choose "WalletConnect" 
3. Your mobile wallet app will open automatically
4. Approve the connection

## Technical Implementation

### WalletContext Configuration
```typescript
new WalletConnectWalletAdapter({
  network: network,
  options: {
    relayUrl: 'wss://relay.walletconnect.com',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    metadata: {
      name: 'Snarbles',
      description: 'Multi-tiered presale platform for Solana tokens',
      url: window.location.origin,
      icons: [`${window.location.origin}/favicon.svg`],
    },
  },
})
```

### Security Features
- **End-to-end encryption** for all WalletConnect communications
- **Session management** with automatic reconnection
- **Network verification** ensures connections are on the correct Solana network
- **Metadata validation** prevents malicious connection attempts

## Troubleshooting

### Common Issues:

1. **WalletConnect Not Appearing in Wallet List**
   - **Root Cause**: WalletConnect only appears when a valid Project ID is configured
   - **Solution**: Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set to a real Project ID (not the placeholder `your-walletconnect-project-id`)
   - **Check**: Visit `/system-test` to verify WalletConnect configuration status
   - **Restart**: Always restart your dev server after updating `.env.local`

2. **"Invalid Project ID"**
   - Ensure your Project ID is correctly set in `.env.local`
   - Restart your development server after updating environment variables
   - Verify the Project ID is exactly as shown in WalletConnect Cloud (no extra spaces)

3. **QR Code Not Appearing**
   - Check browser console for errors
   - Ensure you have a stable internet connection
   - Try refreshing the page

3. **Mobile Wallet Not Opening**
   - Ensure the wallet app is installed on your mobile device
   - Check that the wallet supports Solana and WalletConnect v2
   - Try using a different mobile wallet

4. **Connection Timeouts**
   - The connection request expires after 5 minutes
   - Click "Connect" again to generate a new QR code
   - Ensure both devices are on stable internet connections

### Development Tips:
- Test on both desktop and mobile devices
- Use the system test page (`/system-test`) to verify WalletConnect functionality
- Check the browser console for detailed connection logs
- Monitor network requests to ensure proper relay communication

## Popular WalletConnect-Compatible Solana Wallets
- **Phantom** (iOS/Android)
- **Solflare** (iOS/Android) 
- **Glow** (iOS/Android)
- **Slope** (iOS/Android)
- **Trust Wallet** (iOS/Android)
- **Coinbase Wallet** (iOS/Android)

## Production Checklist
- [ ] Valid WalletConnect Project ID configured
- [ ] HTTPS enabled (required for WalletConnect)
- [ ] Proper domain configured in WalletConnect Cloud
- [ ] Mobile responsiveness tested
- [ ] QR code functionality verified
- [ ] Deep linking tested on mobile devices
- [ ] Error handling implemented for connection failures
- [ ] Session persistence configured
- [ ] Analytics configured (optional)

Your Snarbles platform now supports the full spectrum of Solana wallets through both direct browser extensions and WalletConnect mobile integration! 📱✨