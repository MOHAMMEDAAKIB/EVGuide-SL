'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/vehicles', icon: '🚗', label: 'Browse' },
    { href: '/compare', icon: '🔀', label: 'Compare' },
    { href: '/map', icon: '🗺️', label: 'Map' },
  ];

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive(item.href)
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}

          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 dark:text-gray-400"
          >
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Modal */}
      {showMore && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">More Options</h3>
                <button
                  onClick={() => setShowMore(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <Link
                  href="/tools/tco-calculator"
                  onClick={() => setShowMore(false)}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">💰</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">TCO Calculator</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Calculate ownership costs</div>
                  </div>
                </Link>

                <Link
                  href="/tools/route-planner"
                  onClick={() => setShowMore(false)}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">🗺️</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Route Planner</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Plan your EV journey</div>
                  </div>
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                <Link
                  href="/about"
                  onClick={() => setShowMore(false)}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">ℹ️</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">About</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Learn about EVGuide SL</div>
                  </div>
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setShowMore(false)}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-3xl">❓</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">FAQ</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Frequently asked questions</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom navigation */}
      <div className="md:hidden h-16" aria-hidden="true"></div>
    </>
  );
}
