export default function NewVenturePage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">New Venture / New Authority Insurance</h1>
      <p className="text-lg text-gray-700 mb-8">
        Starting a new trucking business or getting new authority can be daunting. We specialize in helping
        new ventures navigate the complex world of trucking insurance, ensuring you meet all federal and state requirements.
      </p>

      <h2 className="text-3xl font-bold text-deep-navy mb-4">What's Covered?</h2>
      <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
        <li><strong>Primary Liability:</strong> Mandatory coverage for all new authority trucking businesses.</li>
        <li><strong>Physical Damage:</strong> Protects your new truck investment from various perils.</li>
        <li><strong>Motor Truck Cargo:</strong> Essential for covering the goods you will be transporting.</li>
        <li><strong>General Liability:</strong> Covers common business risks outside of your truck's operation.</li>
        <li><strong>Federal & State Filings:</strong> We help ensure you have all necessary filings (BOC-3, MCS-90) in place.</li>
      </ul>

      <p className="text-lg text-gray-700 mb-8">
        Get off to a strong start with the right insurance. Contact us for a hassle-free new venture quote.
      </p>

      <a href="/quote" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">
        Get Your New Venture Quote
      </a>
    </div>
  );
}
