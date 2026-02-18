# 🚀 Quick Start Guide - Component Usage

## Navigation

### Desktop Navigation
```tsx
// Already integrated in layout.tsx
// Active states automatic based on route
```

### Mobile Navigation
```tsx
// Already integrated in layout.tsx
// Bottom navigation hidden on desktop (md:)
```

### Global Search
```tsx
// Triggered from Navbar search button
// Opens overlay with SearchBar component
```

---

## Cards

### Vehicle Card
```tsx
import VehicleCard from '@/components/VehicleCard';

<VehicleCard 
  vehicle={vehicle}
  variant="grid" // 'grid' | 'list' | 'compact'
/>
```

### Station Card
```tsx
import StationCard from '@/components/StationCard';

<StationCard 
  station={station}
  variant="default" // 'default' | 'compact' | 'map'
  distance={2.5}
  onNavigate={(station) => {/* Navigate to Google Maps */}}
/>
```

### Comparison Card
```tsx
import ComparisonCard from '@/components/ComparisonCard';

<ComparisonCard 
  vehicle={vehicle}
  onRemove={(id) => {/* Remove from comparison */}}
  isCompact={false}
/>
```

---

## Forms

### Filter Panel
```tsx
import FilterPanel from '@/components/FilterPanel';

const [filters, setFilters] = useState({
  priceRange: [0, 30000000],
  bodyTypes: [],
  brands: [],
  range: [0, 800],
  batteryCapacity: [0, 150],
  available: true,
});

<FilterPanel 
  filters={filters}
  onChange={setFilters}
  onReset={() => setFilters(initialFilters)}
  variant="sidebar" // or 'modal' for mobile
/>
```

### Calculator Form
```tsx
import CalculatorForm from '@/components/CalculatorForm';

const fields = [
  {
    id: 'vehiclePrice',
    label: 'Vehicle Price',
    type: 'number',
    placeholder: 'Enter price',
    required: true,
    unit: 'LKR',
  },
  // ... more fields
];

const [values, setValues] = useState({});

<CalculatorForm 
  fields={fields}
  values={values}
  onChange={(id, value) => setValues(prev => ({ ...prev, [id]: value }))}
  onSubmit={(e) => {
    e.preventDefault();
    // Handle calculation
  }}
  submitLabel="Calculate TCO"
/>
```

---

## Utilities

### Loading Spinner
```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

// Inline
<LoadingSpinner size="md" text="Loading vehicles..." />

// Full screen
<LoadingSpinner fullScreen size="lg" text="Please wait..." />
```

### Error Message
```tsx
import ErrorMessage from '@/components/ErrorMessage';

<ErrorMessage 
  title="Failed to load vehicles"
  message="Unable to connect to the server. Please try again."
  onRetry={() => refetch()}
  variant="card" // 'inline' | 'card' | 'fullScreen'
/>
```

### Empty State
```tsx
import EmptyState, { NoResultsFound, NoComparison } from '@/components/EmptyState';

// Custom
<EmptyState 
  icon="🔍"
  title="No results found"
  description="Try adjusting your filters"
  action={{
    label: 'Reset Filters',
    onClick: () => resetFilters()
  }}
/>

// Preset
<NoResultsFound onReset={() => resetFilters()} />
<NoComparison onBrowse={() => router.push('/vehicles')} />
```

### Modal
```tsx
import Modal, { ConfirmModal } from '@/components/Modal';

const [isOpen, setIsOpen] = useState(false);

// Standard Modal
<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Vehicle Details"
  size="lg"
>
  <p>Modal content here</p>
</Modal>

// Confirmation Modal
<ConfirmModal 
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={() => deleteVehicle()}
  title="Delete Vehicle"
  message="Are you sure you want to delete this vehicle?"
  confirmLabel="Delete"
  variant="danger"
/>
```

### Toast Notifications
```tsx
'use client';
import { useToast } from '@/components/Toast';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleAction = () => {
    showToast('Vehicle added to comparison!', 'success', 3000);
    // Types: 'success' | 'error' | 'warning' | 'info'
    // Duration: milliseconds (0 for persistent)
  };
  
  return <button onClick={handleAction}>Add to Compare</button>;
}
```

---

## Responsive Utilities

### Grid Classes
```tsx
// Auto-responsive grid (1/2/3 columns)
<div className="grid grid-responsive gap-6">
  {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
</div>

// 4-column grid on XL screens
<div className="grid grid-responsive-4 gap-6">
  {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
</div>
```

### Breakpoint Usage
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop content</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile content</div>

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">Content</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">Heading</h1>
```

---

## Common Patterns

### Vehicle Browse Page
```tsx
'use client';
import { useState } from 'react';
import VehicleGrid from '@/components/VehicleGrid';
import FilterPanel from '@/components/FilterPanel';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NoResultsFound } from '@/components/EmptyState';

export default function VehiclesPage() {
  const [filters, setFilters] = useState({/* ... */});
  const { data: vehicles, isLoading, error } = useVehicles(filters);
  
  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:block">
        <FilterPanel 
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      </aside>
      
      {/* Main Content */}
      <main>
        {isLoading && <LoadingSpinner size="lg" />}
        {error && <ErrorMessage message={error.message} />}
        {!isLoading && vehicles?.length === 0 && (
          <NoResultsFound onReset={() => setFilters(initialFilters)} />
        )}
        {vehicles && <VehicleGrid vehicles={vehicles} />}
      </main>
    </div>
  );
}
```

### Station Map with Cards
```tsx
'use client';
import { useState } from 'react';
import StationCard from '@/components/StationCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  
  return (
    <div className="grid lg:grid-cols-[400px_1fr] h-screen">
      {/* Station List */}
      <aside className="overflow-y-auto p-4 space-y-4">
        {stations.map(station => (
          <StationCard 
            key={station.id}
            station={station}
            variant="compact"
            onClick={() => setSelectedStation(station)}
          />
        ))}
      </aside>
      
      {/* Map */}
      <div className="relative">
        {/* Google Maps component */}
        {selectedStation && (
          <div className="absolute top-4 left-4 z-10">
            <StationCard 
              station={selectedStation}
              variant="map"
              onNavigate={(s) => {/* Open Google Maps */}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

### Comparison with Toast
```tsx
'use client';
import { useState } from 'react';
import ComparisonCard from '@/components/ComparisonCard';
import { useToast } from '@/components/Toast';
import { NoComparison } from '@/components/EmptyState';

export default function ComparePage() {
  const [vehicles, setVehicles] = useState([]);
  const { showToast } = useToast();
  
  const removeVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    showToast('Vehicle removed from comparison', 'info');
  };
  
  if (vehicles.length === 0) {
    return <NoComparison onBrowse={() => router.push('/vehicles')} />;
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <ComparisonCard 
          key={vehicle.id}
          vehicle={vehicle}
          onRemove={removeVehicle}
        />
      ))}
    </div>
  );
}
```

---

## API Integration

### Search Vehicles
```tsx
// Using the /api/vehicles endpoint
const searchVehicles = async (query: string) => {
  const response = await fetch(`/api/vehicles?search=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
};
```

---

## Styling Best Practices

### Consistent Spacing
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Section spacing
<section className="py-8 md:py-12 lg:py-16">

// Card spacing
<div className="p-4 md:p-6">
```

### Dark Mode
```tsx
// Always include dark: variants
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Transitions
```tsx
// Smooth color transitions
<button className="transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
```

---

## Troubleshooting

### Toast not working?
Make sure `<ToastProvider>` wraps your app in `layout.tsx`.

### Modal not closing on ESC?
Check that `isOpen` state is properly managed.

### Filters not updating?
Ensure `onChange` handler is updating state correctly.

### Dark mode not working?
Verify `dark:` classes are present and theme toggle is functional.

---

**Need Help?** Check `/COMPONENT_ARCHITECTURE.md` for detailed documentation.
