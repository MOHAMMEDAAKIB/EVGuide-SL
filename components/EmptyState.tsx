import { ReactNode } from 'react';
import { Inbox, Search, Heart, GitCompare, MapPin } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode | string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';
}

export default function EmptyState({
  icon = <Inbox className="w-12 h-12 text-gray-400" />,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="mb-3">{icon}</div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-green-600 dark:text-green-500 font-medium hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">{description}</p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Preset variants for common use cases
export function NoResultsFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12 text-blue-500" />}
      title="No results found"
      description="We couldn't find any vehicles matching your criteria. Try adjusting your filters."
      action={onReset ? { label: 'Reset Filters', onClick: onReset } : undefined}
    />
  );
}

export function NoSavedVehicles({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={<Heart className="w-12 h-12 text-pink-500" />}
      title="No saved vehicles"
      description="You haven't saved any vehicles yet. Start browsing to find your perfect EV!"
      action={{ label: 'Browse Vehicles', onClick: onBrowse }}
    />
  );
}

export function NoComparison({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={<GitCompare className="w-12 h-12 text-purple-500" />}
      title="No vehicles to compare"
      description="Select at least 2 vehicles to start comparing their features and specifications."
      action={{ label: 'Browse Vehicles', onClick: onBrowse }}
    />
  );
}

export function NoStationsNearby({ onExpand }: { onExpand?: () => void }) {
  return (
    <EmptyState
      icon={<MapPin className="w-12 h-12 text-red-500" />}
      title="No charging stations nearby"
      description="We couldn't find any charging stations in your immediate area. Try expanding your search radius."
      action={onExpand ? { label: 'Expand Search', onClick: onExpand } : undefined}
    />
  );
}
