'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const html = document.documentElement;
    const body = document.body;
    
    if (stored === 'dark' || (!stored && prefersDark)) {
      setIsDark(true);
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      body.style.backgroundColor = '#0a0a0a';
      body.style.color = '#ededed';
    } else {
      setIsDark(false);
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#171717';
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    console.log('Theme toggled to:', newIsDark ? 'dark' : 'light');
    
    const html = document.documentElement;
    const body = document.body;
    
    if (newIsDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      body.style.backgroundColor = '#0a0a0a';
      body.style.color = '#ededed';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#171717';
      localStorage.setItem('theme', 'light');
    }
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30"></div>
    );
  }

  return (
    <button 
      onClick={toggleTheme}
      className="group relative w-14 h-14 rounded-full 
                 bg-white/10 hover:bg-white/20 
                 backdrop-blur-xl 
                 border-2 border-white/30
                 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]
                 transition-all duration-500
                 hover:scale-110 hover:rotate-12
                 before:absolute before:inset-0 before:rounded-full
                 before:bg-linear-to-br before:from-white/20 before:to-transparent
                 before:opacity-0 hover:before:opacity-100
                 before:transition-opacity before:duration-500
                 overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* 3D Inner Circle */}
      <div className="absolute inset-2 rounded-full bg-linear-to-br from-white/10 to-transparent"></div>
      
      {/* Animated Icon */}
      <div className="relative w-full h-full">
        {/* Sun Icon (Light Mode) */}
        <svg 
          className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     transition-all duration-500
                     drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
                     ${isDark ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg 
          className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     transition-all duration-500
                     drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
                     ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>

      {/* Sparkle effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <span className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-ping"></span>
        <span className="absolute bottom-3 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '100ms' }}></span>
        <span className="absolute top-4 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></span>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent 
                     -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>
  );
}
