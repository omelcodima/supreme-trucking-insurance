export default function AboutPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">About Supreme Trucking Insurance</h1>
      <p className="text-lg text-gray-700 mb-8">
        At Supreme Trucking Insurance, we are dedicated to providing comprehensive and reliable insurance solutions
        specifically designed for the trucking industry. We understand the demanding nature of your work and the
        critical need for robust protection.
      </p>

      <p className="text-lg text-gray-700 mb-8">
        Our agency specializes in serving owner operators, small fleets, and new authority trucking businesses.
        We pride ourselves on offering fast quotes, clear communication, and no unnecessary runaround,
        ensuring you get the coverage you need efficiently.
      </p>

      <p className="text-lg text-gray-700 mb-8 font-semibold">
        Based in California, we are licensed across the US, ready to serve truckers nationwide.
        Our expertise ensures that you receive tailored advice and policies that truly meet your operational requirements.
      </p>

      <a href="/quote" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">
        Get Your Free Quote Today
      </a>
    </div>
  );
}
