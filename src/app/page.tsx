import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-gradient-landscape">Snarbles</span>
                <br />
                <span className="text-mountain-900">$SNRB Token Sale</span>
              </h1>
              <p className="text-xl text-mountain-600 mb-8 leading-relaxed">
                Join the Snarbles ecosystem and unlock exclusive NFT creation tools across Solana and Algorand networks. 
                Get your $SNRB tokens and be part of the next generation of no-code blockchain tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sale/snrb" className="btn-primary text-center">
                  Buy $SNRB Tokens
                </Link>
                <a 
                  href="https://snarbles.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary text-center"
                >
                  Visit Snarbles.xyz
                </a>
              </div>
            </div>
            
            <div className="relative">
              {/* Mountain-inspired geometric design */}
              <div className="relative h-96 lg:h-[500px] animate-float">
                <div className="absolute inset-0 bg-gradient-sky rounded-3xl transform -rotate-3 shadow-2xl"></div>
                <div className="absolute inset-4 bg-gradient-mountain rounded-3xl transform rotate-2 shadow-xl"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-golden-400 to-forest-500 rounded-3xl transform -rotate-1 shadow-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-4">�</div>
                    <div className="text-2xl font-semibold">$SNRB</div>
                    <div className="text-lg">Snarbles Token</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-mountain-900 mb-6">
              Why Join Snarbles?
            </h2>
            <p className="text-xl text-mountain-600 max-w-3xl mx-auto">
              $SNRB token holders unlock exclusive access to cutting-edge NFT creation tools and multi-chain capabilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* NFT Tools Feature */}
            <div className="card animate-fade-in">
              <div className="w-12 h-12 bg-coral-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">NFT Creation Tools</h3>
              <p className="text-mountain-600 leading-relaxed">
                Access our no-code NFT creation platform across multiple blockchain networks with exclusive $SNRB holder benefits.
              </p>
            </div>
            
            {/* Multi-chain Feature */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">Multi-Chain Support</h3>
              <p className="text-mountain-600 leading-relaxed">
                Deploy on Solana Devnet and Algorand Mainnet with upcoming expansion to additional blockchain networks.
              </p>
            </div>
            
            {/* Ecosystem Access */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-forest-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">�</span>
              </div>
              <h3 className="text-2xl font-bold text-mountain-900 mb-4">Exclusive Access</h3>
              <p className="text-mountain-600 leading-relaxed">
                $SNRB holders get early access to new features, reduced fees, and premium tools in the Snarbles ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-mountain mb-2">2</div>
              <div className="text-mountain-600">Blockchain Networks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-landscape mb-2">No-Code</div>
              <div className="text-mountain-600">NFT Creation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-mountain mb-2">$SNRB</div>
              <div className="text-mountain-600">Utility Token</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient-landscape mb-2">24/7</div>
              <div className="text-mountain-600">Platform Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-mountain">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-shadow-lg">
            Join the Snarbles Ecosystem
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-shadow">
            Get your $SNRB tokens now and unlock exclusive access to our growing suite of blockchain creation tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sale/snrb" className="bg-white text-coral-600 px-8 py-4 rounded-lg font-semibold hover:bg-cream-50 transform transition-all duration-200 hover:scale-105">
              Buy $SNRB Tokens
            </Link>
            <a 
              href="https://snarbles.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transform transition-all duration-200 hover:scale-105"
            >
              Explore Snarbles.xyz
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mountain-900 text-white">
        <div className="max-w-7xl mx-auto container-padding py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-mountain rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold">Escrow</span>
              </div>
              <p className="text-mountain-300">
                Secure, fast, and transparent token sales on Solana.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-mountain-300">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/create" className="hover:text-white transition-colors">Create Sale</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-mountain-300">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-mountain-300">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-mountain-700 mt-8 pt-8 text-center text-mountain-400">
            <p>&copy; 2025 Custom Escrow. Built with ❤️ on Solana.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}