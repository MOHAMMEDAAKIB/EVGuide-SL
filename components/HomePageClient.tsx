'use client';

import { useEffect, useMemo, useState } from 'react';
import { Vehicle } from '@/types';
import HeroSection from './HeroSection';
import QuickSearchBar, { SearchFilters } from './QuickSearchBar';
import FeaturedVehicles from './FeaturedVehicles';
import VehicleGrid from './VehicleGrid';
import ValuePropositions from './ValuePropositions';
import HowItWorks from './HowItWorks';
import CTASection from './CTASection';

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
  const priceBounds = useMemo(() => {
    if (vehicles.length === 0) {
      return { minPrice: 0, maxPrice: 0 };
    }

    const prices = vehicles.map((vehicle) => vehicle.price_lkr);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [vehicles]);

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    priceRange: priceBounds.maxPrice,
    minRange: 0,
  });

  useEffect(() => {
    setFilteredVehicles(vehicles);
    setFilters((current) => ({
      ...current,
      priceRange:
        current.priceRange > priceBounds.maxPrice || current.priceRange <= 0
          ? priceBounds.maxPrice
          : current.priceRange,
    }));
  }, [priceBounds.maxPrice, vehicles]);

  const handleFilterChange = (filters: SearchFilters) => {
    setFilters(filters);
  };

  useEffect(() => {
    const trimmedSearch = filters.searchTerm.trim();
    const hasActiveFilters =
      trimmedSearch.length > 0 ||
      (priceBounds.maxPrice > 0 && filters.priceRange < priceBounds.maxPrice) ||
      filters.minRange > 0;

    setIsFiltered(hasActiveFilters);

    if (!hasActiveFilters) {
      setFilteredVehicles(vehicles);
      return;
    }

    const controller = new AbortController();
    const fetchFilteredVehicles = async () => {
      try {
        const params = new URLSearchParams();
        if (trimmedSearch) {
          params.set('search', trimmedSearch);
        }
        if (filters.priceRange > 0) {
          params.set('priceMax', String(filters.priceRange));
        }
        if (filters.minRange > 0) {
          params.set('minRange', String(filters.minRange));
        }

        const response = await fetch(`/api/vehicles?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch filtered vehicles');
        }

        const data: Vehicle[] = await response.json();
        setFilteredVehicles(data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Quick search fetch error:', error);
        }
      }
    };

    fetchFilteredVehicles();

    return () => controller.abort();
  }, [filters, priceBounds.maxPrice, vehicles]);

  return (
    <main>
      {/* Hero Section */}
      <HeroSection 
        vehicleCount={vehicleCount} 
        chargingStationCount={chargerCount}
        videoUrl={videoUrl}
      />

      {/* Quick Search Bar */}
      <QuickSearchBar
        onFilterChange={handleFilterChange}
        minPrice={priceBounds.minPrice}
        maxPrice={priceBounds.maxPrice}
      />

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
