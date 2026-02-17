'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { ReactNode } from 'react';

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-500/30 dark:bg-red-900/20">
        <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">
          ⚠️ Google Maps API Key Missing
        </h3>
        <p className="text-sm text-red-700 dark:text-red-400 mb-3">
          To use the Route Planner, you need to set up a Google Maps API key.
        </p>
        <ol className="list-decimal list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
          <li>
            Go to{' '}
            <a
              href="https://console.cloud.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-800 dark:hover:text-red-300"
            >
              Google Cloud Console
            </a>
          </li>
          <li>Enable Maps JavaScript API and Places API</li>
          <li>Create an API key</li>
          <li>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</li>
          <li>Restart the development server</li>
        </ol>
        <p className="text-xs text-red-600 dark:text-red-500 mt-3">
          See SETUP.md for detailed instructions.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geometry']}>
      {children}
    </APIProvider>
  );
}
