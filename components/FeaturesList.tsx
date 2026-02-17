'use client';

interface FeaturesListProps {
  features: string[];
}

const featureIcons: Record<string, string> = {
  'Panoramic Sunroof': '🌞',
  'Sunroof': '🌞',
  '360 Camera': '📹',
  '360° Camera': '📹',
  'Camera': '📹',
  'Wireless Charging': '⚡',
  'Charging': '⚡',
  'Adaptive Cruise Control': '🚗',
  'Cruise Control': '🚗',
  'ProPilot Assist': '🎯',
  'Assist': '🎯',
  'e-Pedal': '🛑',
  'Apple CarPlay': '🍎',
  'CarPlay': '🍎',
  'LED Headlights': '💡',
  'Headlights': '💡',
  'Leather Seats': '🪑',
  'Seats': '🪑',
  'Fast Charging': '⚡',
  'Rain Sensing Wipers': '🌧️',
  'Wipers': '🌧️',
  'Rotating Screen': '🔄',
  'Screen': '🔄',
  'Voice Control': '🎤',
  'LED Ambient Lighting': '💫',
  'Ambient Lighting': '💫',
  'Keyless Entry': '🔑',
  'Entry': '🔑',
  'Autopilot': '🤖',
  'Premium Audio': '🔊',
  'Audio': '🔊',
  'Glass Roof': '🪟',
  'Roof': '🪟',
  'Supercharger Access': '⚡',
  'OTA Updates': '📲',
  'Updates': '📲',
};

export default function FeaturesList({ features }: FeaturesListProps) {
  if (!features || features.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Features</h2>
        <p className="text-slate-600 dark:text-slate-400">No features listed for this vehicle.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">✨ Features & Equipment</h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const icon = featureIcons[feature] || '✓';

          return (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-linear-to-br from-slate-50 to-slate-50/50 px-4 py-3 transition hover:border-emerald-200 hover:from-emerald-50 hover:to-emerald-50/50 dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-800/30 dark:hover:border-emerald-500/30 dark:hover:from-emerald-900/20 dark:hover:to-emerald-900/10"
            >
              <span className="text-xl">{icon}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{feature}</span>
            </div>
          );
        })}
      </div>

      {/* Feature Categories */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Safety Features */}
        {features.some((f) => f.includes('Camera') || f.includes('Assist') || f.includes('Control')) && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-500/30 dark:bg-blue-900/20">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">🛡️ Safety & Assistance</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This vehicle includes advanced driver assistance features for safer driving.
            </p>
          </div>
        )}

        {/* Comfort & Convenience */}
        {features.some((f) => f.includes('Sunroof') || f.includes('Leather') || f.includes('Screen')) && (
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-500/30 dark:bg-green-900/20">
            <h3 className="font-bold text-green-900 dark:text-green-300 mb-2">🌟 Comfort & Convenience</h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Premium comfort features designed for an enjoyable driving experience.
            </p>
          </div>
        )}

        {/* Charging & Technology */}
        {features.some((f) => f.includes('Charging') || f.includes('CarPlay') || f.includes('Updates')) && (
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-500/30 dark:bg-purple-900/20">
            <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">⚡ Charging & Technology</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Modern tech features for convenient connectivity and charging.
            </p>
          </div>
        )}

        {/* Environmental */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/30 dark:bg-emerald-900/20">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">🌍 Electric Vehicle</h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            Zero-emission driving with sustainable, eco-friendly technology.
          </p>
        </div>
      </div>

      {/* Comparison Tip */}
      <div className="mt-6 rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4 dark:border-slate-500 dark:bg-slate-800/50">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">💡 Feature Tip</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Compare features with similar vehicles to find the best value for your needs. Consider which features are essential for your daily driving.
        </p>
      </div>
    </div>
  );
}
