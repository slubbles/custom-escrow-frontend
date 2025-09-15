'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="section-spacing min-h-[80vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto container-padding text-center">
          <div className="card-elevated">
            {/* 404 Illustration */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-landscape rounded-full flex items-center justify-center">
              <span className="text-6xl font-bold text-white text-shadow-lg">404</span>
            </div>
            
            {/* Error Message */}
            <h1 className="text-4xl lg:text-5xl font-bold text-mountain-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-mountain-600 mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital wilderness. 
              Don't worry, we'll help you find your way back.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-primary flex items-center justify-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              
              <Link href="/marketplace" className="btn-secondary flex items-center justify-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Browse Marketplace</span>
              </Link>
              
              <button 
                onClick={() => window.history.back()} 
                className="btn-outline flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>
            
            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-mountain-200">
              <h3 className="text-lg font-semibold text-mountain-900 mb-4">
                Popular Destinations
              </h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  href="/marketplace" 
                  className="text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                >
                  Token Marketplace
                </Link>
                <Link 
                  href="/create" 
                  className="text-forest-600 hover:text-forest-700 hover:underline transition-colors"
                >
                  Create Sale
                </Link>
                <Link 
                  href="/portfolio" 
                  className="text-golden-600 hover:text-golden-700 hover:underline transition-colors"
                >
                  My Portfolio
                </Link>
              </div>
            </div>
          </div>
          
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-golden-200/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </main>
  );
}