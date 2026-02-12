'use client';

import { useState } from 'react';
import { Vehicle } from '@/types';
import HeroSection from './HeroSection';
import QuickSearchBar, { SearchFilters } from './QuickSearchBar';
import FeaturedVehicles from './FeaturedVehicles';
import VehicleGrid from './VehicleGrid';
import ValuePropositions from './ValuePropositions';
import HowItWorks from './HowItWorks';
import CTASection from './CTASection';
import { filterVehicles } from '@/lib/utils';

interface HomePageClientProps {
  vehicles: Vehicle[];
  vehicleCount: number;
  chargerCount: number;
  videoUrl?: string;
}

export default function HomePageClient({ 
  vehicles, 
  vehicleCount, 
  chargerCount,
  videoUrl 
}: HomePageClientProps) {
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleFilterChange = (filters: SearchFilters) => {
    const { searchTerm, priceRange, minRange } = filters;
    
    // Check if any filter is active
    const hasActiveFilters = 
      searchTerm.length > 0 || 
      priceRange < 20000000 || 
      minRange > 0;

    setIsFiltered(hasActiveFilters);

    if (!hasActiveFilters) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = filterVehicles(vehicles, searchTerm, priceRange, minRange);
    setFilteredVehicles(filtered);
  };

  return (
    <main>
      {/* Hero Section */}
      <HeroSection 
        vehicleCount={vehicleCount} 
        chargingStationCount={chargerCount}
        videoUrl={videoUrl}
      />

      {/* Quick Search Bar */}
      <QuickSearchBar onFilterChange={handleFilterChange} />

      {/* Featured Vehicles - Only show if no filters active */}
      {!isFiltered && <FeaturedVehicles vehicles={vehicles} />}

      {/* All Vehicles Grid */}
      <VehicleGrid 
        vehicles={vehicles}
        filteredVehicles={filteredVehicles}
        isFiltered={isFiltered}
      />

      {/* Value Propositions */}
      <ValuePropositions chargingStationCount={chargerCount} />

      {/* How It Works */}
      <HowItWorks />

      {/* Final CTA */}
      <CTASection />
    </main>
  );
}
