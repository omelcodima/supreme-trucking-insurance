export default function OwnerOperatorPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">Owner Operator Insurance</h1>
      <p className="text-lg text-gray-700 mb-8">
        As an owner operator, you need specialized insurance that protects your business, your truck, and your livelihood.
        We understand the unique challenges you face and provide comprehensive coverage tailored to your needs.
      </p>

      <h2 className="text-3xl font-bold text-deep-navy mb-4">What's Covered?</h2>
      <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
        <li><strong>Primary Liability:</strong> Covers damages and injuries to third parties.</li>
        <li><strong>Physical Damage:</strong> Protects your truck from collision, fire, theft, and other perils.</li>
        <li><strong>Non-Trucking Liability (Bobtail):</strong> Coverage when you're driving your truck for personal use.</li>
        <li><strong>Motor Truck Cargo:</strong> Insures the cargo you're hauling against loss or damage.</li>
        <li><strong>General Liability:</strong> Protects against claims of bodily injury or property damage not related to your truck.</li>
      </ul>

      <p className="text-lg text-gray-700 mb-8">
        Don't leave your business exposed. Get a fast, free quote today and ensure you have the best coverage.
      </p>

      <a href="/quote" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">
        Get Your Owner Operator Quote
      </a>
    </div>
  );
}
