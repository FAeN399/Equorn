import React, { useState } from 'react';
import Head from 'next/head';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const templates = trpc.getTemplates.useQuery();

  return (
    <>
      <Head>
        <title>Equorn - Generative Myth Engine</title>
        <meta name="description" content="An open-source generative myth-engine that turns structured narrative blueprints into playable prototypes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-primary-800/30 backdrop-blur-sm bg-dark-900/80 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-glow-pulse">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Equorn
              </span>
            </div>

            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'dashboard'
                    ? 'text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'templates'
                    ? 'text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Templates
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'docs'
                    ? 'text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Documentation
              </button>
            </div>

            <div>
              <button className="btn btn-primary hidden md:block">
                New Project
              </button>
              <button className="md:hidden text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background cosmic effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 -left-24 w-72 h-72 bg-secondary-900/20 rounded-full blur-3xl"></div>
            <div className="absolute w-1.5 h-1.5 bg-primary-400 rounded-full top-24 left-1/4 animate-pulse"></div>
            <div className="absolute w-2 h-2 bg-secondary-400 rounded-full bottom-32 right-1/3 animate-pulse"></div>
            <div className="absolute w-1 h-1 bg-white rounded-full top-1/2 right-1/4 animate-pulse"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Craft Mythic Worlds
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
                An open-source generative myth-engine that turns structured narrative 
                blueprints into playable prototypes in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }}>
                <button className="btn btn-primary px-8 py-3 text-lg">
                  Get Started
                </button>
                <button className="btn btn-outline px-8 py-3 text-lg">
                  Explore Templates
                </button>
              </div>
            </div>
            
            {/* Feature preview */}
            <div className="mt-20 bg-dark-800/60 border border-dark-700 rounded-xl p-6 shadow-xl transform hover:scale-[1.01] transition-all duration-300 animate-slide-up opacity-0" style={{ animationDelay: '0.6s' }}>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-dark-900 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="text-2xl font-serif text-primary-400 mb-4">Seed to World Builder</div>
                  <div className="w-full max-w-2xl mx-auto p-4 bg-dark-800 rounded-md text-sm font-mono text-gray-300 text-left">
                    <pre>
                      {`# 1 — Bootstrap your first project
$ pnpm equorn seed my-myth.yaml

# 2 — Launch the dev dashboard
$ pnpm dev

# 3 — Open http://localhost:3000
# and watch your world come alive`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-dark-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Craft Worlds Without Friction
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card group hover:border-primary-500/50 hover:bg-dark-800">
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-gray-100">Declarative Myth Seeds</h3>
                <p className="text-gray-400">
                  Describe your world in simple YAML or JSON. Define entities, relationships, environments, and quests in a structured format.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card group hover:border-primary-500/50 hover:bg-dark-800">
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-gray-100">Multi-Target Export</h3>
                <p className="text-gray-400">
                  Generate playable scenes for Godot, Unity, or beautiful documentation hubs with a single command.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card group hover:border-primary-500/50 hover:bg-dark-800">
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-gray-100">Real-Time Preview</h3>
                <p className="text-gray-400">
                  Watch your myth come to life in the dashboard as you refine your seed. Interactive visualization lets you iterate rapidly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Gallery */}
        {activeTab === 'templates' && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-serif font-bold mb-8">Templates Gallery</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.isLoading ? (
                  <div className="col-span-3 text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading templates...</p>
                  </div>
                ) : templates.error ? (
                  <div className="col-span-3 text-center py-12 text-red-400">
                    Failed to load templates. Please try again.
                  </div>
                ) : (
                  templates.data?.map((template: { id: string; name: string; description: string }) => (
                    <div key={template.id} className="card hover:border-primary-500/50">
                      <h3 className="text-xl font-serif font-bold mb-2">{template.name}</h3>
                      <p className="text-gray-400 mb-4">{template.description}</p>
                      <button className="btn btn-outline text-sm">Use Template</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto py-12 border-t border-dark-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <span className="text-xl font-serif font-bold text-gray-200">Equorn</span>
                </div>
                <p className="text-gray-500 mt-2 text-sm">
                  Grow the code, guard the myth.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-12">
                <div className="mb-6 md:mb-0">
                  <h4 className="font-bold text-gray-200 mb-4">Links</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-primary-400">Documentation</a></li>
                    <li><a href="#" className="hover:text-primary-400">GitHub</a></li>
                    <li><a href="#" className="hover:text-primary-400">Examples</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-200 mb-4">Community</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-primary-400">Discord</a></li>
                    <li><a href="#" className="hover:text-primary-400">Twitter</a></li>
                    <li><a href="#" className="hover:text-primary-400">Contributors</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-dark-800 mt-12 pt-6 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Equorn. MIT License.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
