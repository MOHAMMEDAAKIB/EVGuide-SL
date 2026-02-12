export default function CTASection() {
  return (
    <section className="py-16 bg-linear-to-br from-green-500 to-emerald-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Go Electric?
        </h2>
        <p className="text-lg md:text-xl text-green-50 mb-8">
          Join the electric revolution and start saving money while helping the environment. 
          Browse our complete vehicle database and find your perfect EV today.
        </p>
        
        <a 
          href="#vehicles"
          className="inline-block px-10 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors shadow-xl hover:shadow-2xl"
        >
          Start Browsing
        </a>

        <p className="mt-8 text-green-100 text-sm">
          Have questions? Check out our comprehensive guides and resources
        </p>
      </div>
    </section>
  );
}
