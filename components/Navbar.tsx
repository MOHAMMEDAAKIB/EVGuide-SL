'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { DollarSign, Map } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                <img src="/images/ev-logo.png" alt="EVGuide SL Logo" className="w-12 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                EVGuide <span className="text-green-600 dark:text-green-500">SL</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/vehicles"
                className={`text-sm font-medium transition-colors ${
                  isActive('/vehicles')
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                }`}
              >
                Vehicles
              </Link>

              <Link
                href="/compare"
                className={`text-sm font-medium transition-colors ${
                  isActive('/compare')
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                }`}
              >
                Compare
              </Link>

              {/* Tools Dropdown */}
              <div className="relative group">
                <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors flex items-center space-x-1">
                  <span>Tools</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/tools/tco-calculator"
                    className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" /> TCO Calculator
                  </Link>
                  <Link
                    href="/tools/route-planner"
                    className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                  >
                    <Map className="w-4 h-4" /> Route Planner
                  </Link>
                </div>
              </div>

              <Link
                href="/map"
                className={`text-sm font-medium transition-colors ${
                  isActive('/map')
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500'
                }`}
              >
                Map
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700 dark:text-gray-300" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowSearch(false)}>
          <div className="max-w-2xl mx-auto mt-20 px-4" onClick={(e) => e.stopPropagation()}>
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}
    </>
  );
}
