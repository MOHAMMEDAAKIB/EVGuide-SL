import Image from 'next/image';

interface HeroSectionProps {
  vehicleCount: number;
  chargingStationCount: number;
  videoUrl?: string;
}

export default function HeroSection({ 
  vehicleCount, 
  chargingStationCount,
  videoUrl = '/videos/hero-background.mp4' // Default video path
}: HeroSectionProps) {
  return (
    <section className="relative bg-linear-to-br from-green-600 to-emerald-600 text-white py-16 md:py-24 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-poster.png" // Optional: Add a poster image
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        {/* Premium Gradient Overlays */}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Gradient overlay for premium look */}
        <div className="absolute inset-0 bg-linear-to-br from-green-900/80 via-emerald-900/70 to-green-800/80"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50"></div>
        
        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Content - Above video */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-2xl">
            Find Your Perfect Electric Vehicle
          </h1>
          <p className="text-sm font-extralight md:text-xl text-white/90 mb-8 md:mb-10 drop-shadow-lg">
            Compare EVs with real Sri Lankan data
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            {/* Primary CTA - Browse EVs */}
            <a 
              href="#vehicles"
              className="group relative px-10 py-5 bg-white/10 text-white rounded-2xl font-bold text-lg
                         overflow-hidden transition-all duration-300 
                         shadow-[0_20px_50px_rgba(34,197,94,0.4)] 
                         hover:shadow-[0_20px_60px_rgba(34,197,94,0.6)]
                         hover:scale-105 hover:-translate-y-1
                         border-2 border-white/30
                         backdrop-blur-xl
                         hover:bg-white/30
                         before:absolute before:inset-0 before:bg-linear-to-r before:from-green-400 before:to-emerald-400 
                         before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-10"
            >
              <span className="relative flex items-center justify-center gap-3">
                <svg 
                  className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Browse EVs</span>
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            </a>

            {/* Secondary CTA - Calculate Savings */}
            <a 
              href="tools/tco-calculator"
              className="group relative px-10 py-5 rounded-2xl font-bold text-lg text-white
                         overflow-hidden transition-all duration-300
                         bg-linear-to-r from-green-500/40/10 to-emerald-600/40/10
                         hover:from-green-500/60/10 hover:to-emerald-600/60/10
                         shadow-[0_20px_50px_rgba(34,197,94,0.4)]
                         hover:shadow-[0_20px_60px_rgba(34,197,94,0.6)]
                         hover:scale-105 hover:-translate-y-1
                         border-2 border-white/30
                         backdrop-blur-xl
                         before:absolute before:inset-0 
                         before:bg-linear-to-r before:from-white/0 before:via-white/20 before:to-white/0
                         before:-translate-x-full before:transition-transform before:duration-700
                         hover:before:translate-x-full"
            >
              <span className="relative flex items-center justify-center gap-3">
                <svg 
                  className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Calculate Savings</span>
              </span>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </a>
          </div>

          {/* Quick Stats */}
          {/*<div className="flex flex-wrap justify-center gap-6 md:gap-8 text-white/95">
            <div className="flex items-center gap-2 text-base md:text-lg backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-2xl">📊</span>
              <span className="font-semibold">{vehicleCount}+ Models</span>
            </div>
            <div className="flex items-center gap-2 text-base md:text-lg backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-2xl">🗺️</span>
              <span className="font-semibold">{chargingStationCount}+ Chargers</span>
            </div>
          </div>*/}
        </div>
      </div>

      {/* Animated bottom wave for premium transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-10">
        <svg
          className="absolute bottom-0 w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="text-white dark:text-slate-800"
          ></path>
        </svg>
      </div>
    </section>
  );
}
