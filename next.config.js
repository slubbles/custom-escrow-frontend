/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment configuration
  env: {
    SOLANA_NETWORK: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
    PROGRAM_ID: process.env.NODE_ENV === 'production' 
      ? 'MAINNET_PROGRAM_ID_HERE' 
      : 'HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4'
  },

  // Image optimization
  images: {
    domains: ['arweave.net', 'ipfs.io', 'gateway.pinata.cloud'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },

  // URL rewrites for backward compatibility
  async rewrites() {
    return [
      {
        source: '/api/rpc/:path*',
        destination: 'https://api.devnet.solana.com/:path*',
      },
    ];
  },

  // Redirects for old routes
  async redirects() {
    return [
      {
        source: '/marketplace',
        destination: '/projects',
        permanent: false,
      },
      {
        source: '/create',
        destination: '/create-project',
        permanent: false,
      },
    ];
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration
  output: 'standalone',
};

module.exports = nextConfig;