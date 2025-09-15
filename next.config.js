/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOLANA_NETWORK: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
    PROGRAM_ID: process.env.NODE_ENV === 'production' 
      ? 'MAINNET_PROGRAM_ID_HERE' 
      : 'HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4'
  },
  images: {
    domains: ['arweave.net', 'ipfs.io'], // For token metadata images
  },
  async rewrites() {
    return [
      {
        source: '/api/rpc/:path*',
        destination: 'https://api.devnet.solana.com/:path*', // Proxy RPC calls
      },
    ];
  },
};

module.exports = nextConfig;