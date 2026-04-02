import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-deep-navy text-white text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">Trucking Insurance. Fast Quotes. No Runaround.</h1>
        <p className="text-xl mb-8">We specialize in owner operators, small fleets, and new authority. Get a quote in minutes.</p>
        <a href="/quote" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">Get a Free Quote</a>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto flex flex-wrap justify-around items-center text-center text-gray-700">
          <p className="text-lg font-semibold m-2">Licensed in 48 states (excl. HI & AK)</p>
          <p className="text-lg font-semibold m-2">10+ carriers</p>
          <p className="text-lg font-semibold m-2">Fast turnaround</p>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-deep-navy mb-4">Fast Quotes</h2>
            <p className="text-gray-600">Time is money. We provide quick and accurate quotes so you can get back on the road.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-deep-navy mb-4">Trucking Specialists</h2>
            <p className="text-gray-600">Our team understands the unique needs of the trucking industry, from owner operators to small fleets.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-deep-navy mb-4">All Coverage Types</h2>
            <p className="text-gray-600">From liability to cargo, we offer comprehensive coverage options tailored for your business.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
