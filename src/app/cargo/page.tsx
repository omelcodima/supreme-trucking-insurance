export default function CargoPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">Cargo Insurance</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your cargo is your business. Protect the goods you transport against loss or damage due to collision,
        fire, theft, and other covered perils with our reliable motor truck cargo insurance.
      </p>

      <h2 className="text-3xl font-bold text-deep-navy mb-4">What's Covered?</h2>
      <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
        <li><strong>Collision:</strong> Damages to cargo resulting from an accident.</li>
        <li><strong>Fire:</strong> Loss or damage to cargo due to fire.</li>
        <li><strong>Theft:</strong> Protection against theft of your transported goods.</li>
        <li><strong>Vandalism:</strong> Covers damage caused by malicious acts.</li>
        <li><strong>Loading/Unloading:</strong> Coverage for cargo during the loading and unloading process.</li>
        <li><strong>Debris Removal:</strong> Costs associated with removing cargo debris after an accident.</li>
      </ul>

      <p className="text-lg text-gray-700 mb-8">
        Don't risk uninsured losses. Get comprehensive cargo insurance that gives you peace of mind.
      </p>

      <a href="/quote" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">
        Get Your Cargo Insurance Quote
      </a>
    </div>
  );
}
