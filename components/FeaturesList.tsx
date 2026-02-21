'use client';

import { Sun, Video, Zap, Car, Target, StopCircle, Apple, Lightbulb, Armchair, CloudRain, RotateCw, Mic, Sparkles, Key, Bot, Volume2, GlassWater, Smartphone, CheckCircle2, Shield, Star, Leaf } from 'lucide-react';

interface FeaturesListProps {
  features: string[];
}

const getFeatureIcon = (feature: string): React.ReactNode => {
  const featureUpper = feature.toUpperCase();
  
  if (featureUpper.includes('SUNROOF')) return <Sun className="w-5 h-5 text-yellow-500" />;
  if (featureUpper.includes('CAMERA')) return <Video className="w-5 h-5 text-purple-500" />;
  if (featureUpper.includes('CHARGING') || featureUpper.includes('SUPERCHARGER')) return <Zap className="w-5 h-5 text-yellow-500" />;
  if (featureUpper.includes('CRUISE CONTROL')) return <Car className="w-5 h-5 text-blue-500" />;
  if (featureUpper.includes('ASSIST') || featureUpper.includes('PROPILOT')) return <Target className="w-5 h-5 text-red-500" />;
  if (featureUpper.includes('PEDAL')) return <StopCircle className="w-5 h-5 text-red-600" />;
  if (featureUpper.includes('CARPLAY') || featureUpper.includes('APPLE')) return <Apple className="w-5 h-5 text-gray-700" />;
  if (featureUpper.includes('HEADLIGHT') || featureUpper.includes('LED')) return <Lightbulb className="w-5 h-5 text-amber-400" />;
  if (featureUpper.includes('SEAT') || featureUpper.includes('LEATHER')) return <Armchair className="w-5 h-5 text-brown-600" />;
  if (featureUpper.includes('WIPER') || featureUpper.includes('RAIN')) return <CloudRain className="w-5 h-5 text-blue-400" />;
  if (featureUpper.includes('SCREEN') || featureUpper.includes('ROTATING')) return <RotateCw className="w-5 h-5 text-indigo-500" />;
  if (featureUpper.includes('VOICE')) return <Mic className="w-5 h-5 text-pink-500" />;
  if (featureUpper.includes('AMBIENT') || featureUpper.includes('LIGHTING')) return <Sparkles className="w-5 h-5 text-purple-400" />;
  if (featureUpper.includes('KEYLESS') || featureUpper.includes('KEY')) return <Key className="w-5 h-5 text-orange-500" />;
  if (featureUpper.includes('AUTOPILOT')) return <Bot className="w-5 h-5 text-cyan-500" />;
  if (featureUpper.includes('AUDIO') || featureUpper.includes('SOUND')) return <Volume2 className="w-5 h-5 text-green-500" />;
  if (featureUpper.includes('ROOF') || featureUpper.includes('GLASS')) return <GlassWater className="w-5 h-5 text-blue-300" />;
  if (featureUpper.includes('UPDATE') || featureUpper.includes('OTA')) return <Smartphone className="w-5 h-5 text-teal-500" />;
  
  return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
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
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-7 h-7 text-amber-500" /> Features & Equipment
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const icon = getFeatureIcon(feature);

          return (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-linear-to-br from-slate-50 to-slate-50/50 px-4 py-3 transition hover:border-emerald-200 hover:from-emerald-50 hover:to-emerald-50/50 dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-800/30 dark:hover:border-emerald-500/30 dark:hover:from-emerald-900/20 dark:hover:to-emerald-900/10"
            >
              {icon}
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
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Safety & Assistance
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This vehicle includes advanced driver assistance features for safer driving.
            </p>
          </div>
        )}

        {/* Comfort & Convenience */}
        {features.some((f) => f.includes('Sunroof') || f.includes('Leather') || f.includes('Screen')) && (
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-500/30 dark:bg-green-900/20">
            <h3 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5" /> Comfort & Convenience
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Premium comfort features designed for an enjoyable driving experience.
            </p>
          </div>
        )}

        {/* Charging & Technology */}
        {features.some((f) => f.includes('Charging') || f.includes('CarPlay') || f.includes('Updates')) && (
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-500/30 dark:bg-purple-900/20">
            <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Charging & Technology
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Modern tech features for convenient connectivity and charging.
            </p>
          </div>
        )}

        {/* Environmental */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/30 dark:bg-emerald-900/20">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
            <Leaf className="w-5 h-5" /> Electric Vehicle
          </h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            Zero-emission driving with sustainable, eco-friendly technology.
          </p>
        </div>
      </div>

      {/* Comparison Tip */}
      <div className="mt-6 rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4 dark:border-slate-500 dark:bg-slate-800/50">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"><Lightbulb className="w-4 h-4 inline mr-1" /> Feature Tip</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Compare features with similar vehicles to find the best value for your needs. Consider which features are essential for your daily driving.
        </p>
      </div>
    </div>
  );
}
