'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplaceRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the SNRB token sale page
    router.replace('/sale/snrb');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-mountain-900 mb-4">
          Redirecting to $SNRB Token Sale...
        </div>
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockSales = [
  {
    id: 1,
    tokenName: 'DegenCoin',
    tokenSymbol: 'DEGEN',
    pricePerToken: 0.001,
    totalTokens: 1000000,
    tokensAvailable: 750000,
    saleEndTime: Date.now() + 86400000 * 3, // 3 days from now
    seller: '7XaL...kE9S',
    participants: 234,
    raised: 250,
  },
  {
    id: 2,
    tokenName: 'MoonShot',
    tokenSymbol: 'MOON',
    pricePerToken: 0.05,
    totalTokens: 500000,
    tokensAvailable: 320000,
    saleEndTime: Date.now() + 86400000 * 7, // 7 days from now
    seller: '9pQ2...vR8X',
    participants: 156,
    raised: 9000,
  },
  {
    id: 3,
    tokenName: 'GreenEnergy',
    tokenSymbol: 'GREEN',
    pricePerToken: 0.1,
    totalTokens: 2000000,
    tokensAvailable: 1800000,
    saleEndTime: Date.now() + 86400000 * 5, // 5 days from now
    seller: 'BxF4...nM7Q',
    participants: 89,
    raised: 20000,
  },
];

function SaleCard({ sale }: { sale: typeof mockSales[0] }) {
  const progress = ((sale.totalTokens - sale.tokensAvailable) / sale.totalTokens) * 100;
  const timeRemaining = sale.saleEndTime - Date.now();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="card hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-mountain-900">{sale.tokenName}</h3>
          <p className="text-mountain-600">${sale.tokenSymbol}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-landscape rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{sale.tokenSymbol[0]}</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-mountain-600">Price per token</span>
          <span className="font-semibold text-mountain-900">${sale.pricePerToken}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-mountain-600">Total raised</span>
          <span className="font-semibold text-forest-600">${sale.raised.toLocaleString()}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-mountain-600">Progress</span>
            <span className="font-semibold text-mountain-900">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-mountain-200 rounded-full h-2">
            <div 
              className="bg-gradient-landscape rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-mountain-600 mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{daysRemaining}d {hoursRemaining}h left</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{sale.participants} participants</span>
        </div>
      </div>
      
      <button className="btn-primary w-full">
        View Details
      </button>
    </div>
  );
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trending');

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-sky py-16">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg">
            Token Sale Marketplace
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto text-shadow">
            Discover and participate in the latest token sales from innovative projects
          </p>
        </div>
      </section>
      
      {/* Filters and Search */}
      <section className="py-8 bg-white/30 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mountain-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search token sales..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Sort and Filter */}
            <div className="flex gap-4">
              <select 
                className="input-field"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="ending">Ending Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <button className="btn-outline flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-8 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-mountain mb-1">24</div>
              <div className="text-mountain-600 text-sm">Active Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-landscape mb-1">$2.3M</div>
              <div className="text-mountain-600 text-sm">24h Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-mountain mb-1">1.2K</div>
              <div className="text-mountain-600 text-sm">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-landscape mb-1">95%</div>
              <div className="text-mountain-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sales Grid */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-mountain-900">Active Token Sales</h2>
            <div className="flex items-center space-x-2 text-mountain-600">
              <TrendingUp className="w-5 h-5" />
              <span>Showing {mockSales.length} results</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-secondary">
              Load More Sales
            </button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-spacing bg-gradient-mountain">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-4xl font-bold text-white mb-6 text-shadow-lg">
            Ready to Launch Your Token?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-shadow">
            Create your own token sale with our secure and easy-to-use platform
          </p>
          <button className="bg-white text-coral-600 px-8 py-4 rounded-lg font-semibold hover:bg-cream-50 transform transition-all duration-200 hover:scale-105">
            Create Token Sale
          </button>
        </div>
      </section>
    </main>
  );
}