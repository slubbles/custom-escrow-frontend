'use client';

import { Navigation } from '@/components/Navigation';
import { useProjects } from '@/hooks/useEscrow';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Zap, Users, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: projects, isLoading } = useProjects();
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200">
            <Shield className="text-white w-4 h-4" />
            <span className="text-sm text-white/80 font-medium">Secure Token Launch Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-[-0.02em]">
            Launch Your
            <br />
            <span className="inline-block mt-2">Token Sale</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
            Create your token presale with built-in escrow protection. 
            Set your price, launch your sale, and let investors buy tokens safely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {connected ? (
              <Link 
                href="/create-project"
                className="group bg-white text-black px-8 py-3.5 rounded-lg font-medium hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 inline-flex items-center text-base shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Launch Token Sale
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <WalletMultiButton className="!bg-white !text-black hover:!bg-white/90 !py-3.5 !px-8 !rounded-lg !font-medium !text-base transform hover:!scale-[1.02] active:!scale-[0.98] !transition-all !duration-150 !shadow-sm" />
            )}
            
            <Link 
              href="/projects"
              className="group border border-white/10 bg-white/5 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-white/10 hover:border-white/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 inline-flex items-center text-base backdrop-blur-sm"
            >
              Browse Token Sales
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
              <div className="text-5xl font-bold text-white mb-3 tracking-tight">100%</div>
              <div className="text-base text-white/60 font-medium">Secure Escrow</div>
            </div>
            <div className="group text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
              <div className="text-5xl font-bold text-white mb-3 tracking-tight">&lt;5min</div>
              <div className="text-base text-white/60 font-medium">Setup Time</div>
            </div>
            <div className="group text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
              <div className="text-5xl font-bold text-white mb-3 tracking-tight">24/7</div>
              <div className="text-base text-white/60 font-medium">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-[-0.02em] leading-[1.1]">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-normal">
              Three simple steps to launch your token sale and start raising funds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div className="group relative text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
              {/* Step number */}
              <div className="absolute -top-4 left-8 px-3 py-1 bg-black border border-white/20 rounded-full">
                <span className="text-sm font-bold text-white">01</span>
              </div>
              
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-black" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Create Sale</h3>
              <p className="text-white/60 leading-relaxed text-base">
                Set your token details, pricing, and sale parameters. Launch your presale in minutes with our intuitive wizard.
              </p>
            </div>
            
            <div className="group relative text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
              {/* Step number */}
              <div className="absolute -top-4 left-8 px-3 py-1 bg-black border border-white/20 rounded-full">
                <span className="text-sm font-bold text-white">02</span>
              </div>
              
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-black" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Investors Buy</h3>
              <p className="text-white/60 leading-relaxed text-base">
                Investors discover and purchase tokens from your sale. All funds are held in secure escrow protection.
              </p>
            </div>
            
            <div className="group relative text-center p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
              {/* Step number */}
              <div className="absolute -top-4 left-8 px-3 py-1 bg-black border border-white/20 rounded-full">
                <span className="text-sm font-bold text-white">03</span>
              </div>
              
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-black" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Safe Distribution</h3>
              <p className="text-white/60 leading-relaxed text-base">
                When your sale ends, tokens are automatically distributed to buyers and you receive the funds safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em]">Featured Sales</h2>
              <p className="text-white/60 mt-2 text-base">Discover the latest token offerings</p>
            </div>
            <Link 
              href="/projects"
              className="group text-white/60 hover:text-white font-medium inline-flex items-center gap-2 transition-colors text-base"
            >
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-8 border border-white/10 animate-pulse">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl mb-6"></div>
                  <div className="h-7 bg-white/10 rounded mb-3 w-3/4"></div>
                  <div className="h-5 bg-white/10 rounded mb-2 w-full"></div>
                  <div className="h-5 bg-white/10 rounded mb-6 w-2/3"></div>
                  <div className="h-12 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="group bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 flex flex-col">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-black font-bold text-2xl">{project.name.charAt(0)}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{project.name}</h3>
                  <p className="text-white/60 mb-8 line-clamp-2 leading-relaxed text-base flex-grow">{project.description}</p>
                  
                  <Link 
                    href={`/project/${project.slug}`}
                    className="group/btn w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-all duration-150 inline-flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                  >
                    View Project
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default">
                <Plus className="w-12 h-12 text-white/30" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">No Projects Yet</h3>
              <p className="text-white/60 mb-10 text-lg max-w-md mx-auto">Be the first to launch a token sale on our platform!</p>
              {connected && (
                <Link 
                  href="/create-project"
                  className="group bg-white text-black px-8 py-3.5 rounded-lg font-medium hover:bg-white/90 transition-all duration-150 inline-flex items-center transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-[-0.02em]">Platform Stats</h2>
            <p className="text-white/60 text-base">Real-time metrics from our ecosystem</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="group p-8 lg:p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">{projects?.length || 0}</div>
              <div className="text-sm lg:text-base text-white/60 font-medium">Active Sales</div>
            </div>
            <div className="group p-8 lg:p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">$0</div>
              <div className="text-sm lg:text-base text-white/60 font-medium">Total Raised</div>
            </div>
            <div className="group p-8 lg:p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">0</div>
              <div className="text-sm lg:text-base text-white/60 font-medium">Token Holders</div>
            </div>
            <div className="group p-8 lg:p-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-default text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">100%</div>
              <div className="text-sm lg:text-base text-white/60 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-[-0.02em] leading-[1.1]">
            Ready to Launch?
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            Join the future of token sales with built-in security and trust
          </p>
          {connected ? (
            <Link 
              href="/create-project"
              className="group inline-flex items-center bg-white text-black px-10 py-4 rounded-lg font-medium hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 text-lg shadow-sm"
            >
              <Plus className="w-6 h-6 mr-2" />
              Create Your Token Sale
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          ) : (
            <WalletMultiButton className="!bg-white !text-black hover:!bg-white/90 !py-4 !px-10 !rounded-lg !font-medium !text-lg transform hover:!scale-[1.02] active:!scale-[0.98] !transition-all !duration-150 !shadow-sm" />
          )}
        </div>
      </section>
    </div>
  );
}
