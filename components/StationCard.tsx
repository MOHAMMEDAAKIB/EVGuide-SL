'use client';

import Link from 'next/link';

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  connector_types?: string[];
  power_kw?: number;
  available_ports?: number;
  total_ports?: number;
  status?: 'available' | 'busy' | 'offline';
  price_per_kwh?: number;
  operator?: string;
  is_24_7?: boolean;
}

interface StationCardProps {
  station: ChargingStation;
  variant?: 'default' | 'compact' | 'map';
  onNavigate?: (station: ChargingStation) => void;
  distance?: number; // in km
}

export default function StationCard({ 
  station, 
  variant = 'default',
  onNavigate,
  distance 
}: StationCardProps) {
  const getStatusColor = () => {
    switch (station.status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'busy':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'offline':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusText = () => {
    if (!station.available_ports || !station.total_ports) return station.status || 'Unknown';
    if (station.status === 'offline') return 'Offline';
    return `${station.available_ports}/${station.total_ports} Available`;
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all cursor-pointer">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">{station.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{station.address}</p>
          </div>
        </div>
        {distance && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">
            {distance.toFixed(1)} km
          </span>
        )}
      </div>
    );
  }

  if (variant === 'map') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">{station.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {station.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{station.address}</p>
          
          {station.connector_types && station.connector_types.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {station.connector_types.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          )}

          {station.power_kw && (
            <p className="text-sm text-gray-600 dark:text-gray-400">⚡ {station.power_kw} kW</p>
          )}
        </div>

        <button
          onClick={() => onNavigate?.(station)}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Get Directions
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <Link href={`/stations/${station.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all overflow-hidden group">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                {station.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{station.address}</p>
            </div>
            {distance && (
              <div className="ml-4 text-right">
                <div className="text-xl font-bold text-green-600 dark:text-green-500">
                  {distance.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">km away</div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
              {getStatusText()}
            </span>
            {station.is_24_7 && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                24/7
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Connectors */}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Connectors</div>
              {station.connector_types && station.connector_types.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {station.connector_types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">N/A</span>
              )}
            </div>

            {/* Power */}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Power</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {station.power_kw ? `${station.power_kw} kW` : 'N/A'}
              </div>
            </div>

            {/* Operator */}
            {station.operator && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Operator</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {station.operator}
                </div>
              </div>
            )}

            {/* Price */}
            {station.price_per_kwh && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Price</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Rs. {station.price_per_kwh}/kWh
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(station);
            }}
            className="flex items-center space-x-2 text-sm font-medium text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Navigate</span>
          </button>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
