export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Browse & Compare',
      description: 'Explore our database of electric vehicles with real Sri Lankan data',
    },
    {
      number: 2,
      title: 'Calculate Savings',
      description: 'See how much you\'ll save compared to petrol vehicles over time',
    },
    {
      number: 3,
      title: 'Find Chargers',
      description: 'Locate charging stations near you with our interactive map',
    },
  ];

  return (
    <section className="py-16 bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your journey to electric driving in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-linear-to-r from-green-500 to-emerald-500 z-0" />
              )}

              {/* Step Card */}
              <div className="relative z-10 text-center">
                {/* Number Circle */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-green-600 to-emerald-600 text-white text-3xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
