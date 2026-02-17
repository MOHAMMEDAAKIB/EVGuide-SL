// Major Sri Lankan locations for route planning
// Coordinates verified from OpenStreetMap

export interface SLLocation {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  category: 'major' | 'city' | 'town'; // For filtering/grouping
}

export const SRI_LANKAN_LOCATIONS: SLLocation[] = [
  // Western Province
  {
    id: 'colombo-fort',
    name: 'Colombo, Fort',
    district: 'Colombo',
    lat: 6.9319,
    lng: 79.8478,
    category: 'major',
  },
  {
    id: 'colombo-city',
    name: 'Colombo City Centre',
    district: 'Colombo',
    lat: 6.9271,
    lng: 79.8612,
    category: 'major',
  },
  {
    id: 'negombo',
    name: 'Negombo',
    district: 'Gampaha',
    lat: 7.2089,
    lng: 79.8358,
    category: 'city',
  },
  {
    id: 'gampaha',
    name: 'Gampaha',
    district: 'Gampaha',
    lat: 7.0917,
    lng: 80.0167,
    category: 'city',
  },
  {
    id: 'kaduwela',
    name: 'Kaduwela',
    district: 'Colombo',
    lat: 6.9333,
    lng: 79.9833,
    category: 'town',
  },

  // Central Province
  {
    id: 'kandy',
    name: 'Kandy City Centre',
    district: 'Kandy',
    lat: 7.2906,
    lng: 80.6337,
    category: 'major',
  },
  {
    id: 'peradeniya',
    name: 'Peradeniya',
    district: 'Kandy',
    lat: 7.2667,
    lng: 80.6000,
    category: 'town',
  },
  {
    id: 'matale',
    name: 'Matale',
    district: 'Matale',
    lat: 7.4667,
    lng: 80.6231,
    category: 'city',
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    district: 'Nuwara Eliya',
    lat: 6.9497,
    lng: 80.7891,
    category: 'city',
  },
  {
    id: 'kegalle',
    name: 'Kegalle',
    district: 'Kegalle',
    lat: 7.2528,
    lng: 80.3433,
    category: 'city',
  },

  // Southern Province
  {
    id: 'galle',
    name: 'Galle',
    district: 'Galle',
    lat: 6.0535,
    lng: 80.2210,
    category: 'major',
  },
  {
    id: 'matara',
    name: 'Matara',
    district: 'Matara',
    lat: 5.9549,
    lng: 80.5550,
    category: 'city',
  },
  {
    id: 'hambantota',
    name: 'Hambantota',
    district: 'Hambantota',
    lat: 6.1244,
    lng: 81.1185,
    category: 'city',
  },
  {
    id: 'hikkaduwa',
    name: 'Hikkaduwa',
    district: 'Galle',
    lat: 6.1408,
    lng: 80.1036,
    category: 'town',
  },

  // Northern Province
  {
    id: 'jaffna',
    name: 'Jaffna',
    district: 'Jaffna',
    lat: 9.6615,
    lng: 80.0255,
    category: 'major',
  },
  {
    id: 'vavuniya',
    name: 'Vavuniya',
    district: 'Vavuniya',
    lat: 8.7542,
    lng: 80.4982,
    category: 'city',
  },

  // Eastern Province
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    district: 'Trincomalee',
    lat: 8.5874,
    lng: 81.2152,
    category: 'major',
  },
  {
    id: 'batticaloa',
    name: 'Batticaloa',
    district: 'Batticaloa',
    lat: 7.7310,
    lng: 81.6747,
    category: 'city',
  },
  {
    id: 'ampara',
    name: 'Ampara',
    district: 'Ampara',
    lat: 7.2969,
    lng: 81.6681,
    category: 'city',
  },

  // North Central Province
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    district: 'Anuradhapura',
    lat: 8.3114,
    lng: 80.4037,
    category: 'major',
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa',
    district: 'Polonnaruwa',
    lat: 7.9403,
    lng: 81.0188,
    category: 'city',
  },

  // North Western Province
  {
    id: 'kurunegala',
    name: 'Kurunegala',
    district: 'Kurunegala',
    lat: 7.4867,
    lng: 80.3647,
    category: 'city',
  },
  {
    id: 'puttalam',
    name: 'Puttalam',
    district: 'Puttalam',
    lat: 8.0362,
    lng: 79.8283,
    category: 'city',
  },

  // Sabaragamuwa Province
  {
    id: 'ratnapura',
    name: 'Ratnapura',
    district: 'Ratnapura',
    lat: 6.6828,
    lng: 80.4014,
    category: 'city',
  },
  {
    id: 'embilipitiya',
    name: 'Embilipitiya',
    district: 'Ratnapura',
    lat: 6.3431,
    lng: 80.8500,
    category: 'town',
  },

  // Uva Province
  {
    id: 'badulla',
    name: 'Badulla',
    district: 'Badulla',
    lat: 6.9934,
    lng: 81.0550,
    category: 'city',
  },
  {
    id: 'monaragala',
    name: 'Monaragala',
    district: 'Monaragala',
    lat: 6.8728,
    lng: 81.3506,
    category: 'city',
  },
];

// Helper function to get location by ID
export function getLocationById(id: string): SLLocation | undefined {
  return SRI_LANKAN_LOCATIONS.find((loc) => loc.id === id);
}

// Helper function to search locations by name
export function searchLocations(query: string): SLLocation[] {
  const lowerQuery = query.toLowerCase();
  return SRI_LANKAN_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.district.toLowerCase().includes(lowerQuery)
  );
}

// Get locations grouped by district
export function getLocationsByDistrict(): Record<string, SLLocation[]> {
  const grouped: Record<string, SLLocation[]> = {};
  
  SRI_LANKAN_LOCATIONS.forEach((loc) => {
    if (!grouped[loc.district]) {
      grouped[loc.district] = [];
    }
    grouped[loc.district].push(loc);
  });
  
  return grouped;
}

// Calculate straight-line distance between two locations (in km)
// Using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
