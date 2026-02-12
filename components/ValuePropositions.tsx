interface ValuePropositionsProps {
  chargingStationCount: number;
}

export default function ValuePropositions({ chargingStationCount }: ValuePropositionsProps) {
  const propositions = [
    {
      icon: '🔋',
      title: 'Real Range Estimates',
      description: 'Based on Sri Lankan driving conditions, not just manufacturer claims',
    },
    {
      icon: '💰',
      title: 'True Cost Analysis',
      description: 'Total cost of ownership compared to petrol vehicles',
    },
    {
      icon: '🗺️',
      title: 'Charging Network',
      description: `${chargingStationCount}+ stations mapped across Sri Lanka`,
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose EVGuide SL?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We provide data that matters for Sri Lankan EV buyers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propositions.map((prop, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-8 border border-green-100 dark:border-slate-600 hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{prop.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {prop.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
