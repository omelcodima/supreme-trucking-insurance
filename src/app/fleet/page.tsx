export default function FleetPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">Small Fleet Insurance (2-10 Trucks)</h1>
      <p className="text-lg text-gray-700 mb-8">
        Managing a small fleet comes with its own set of challenges. We offer comprehensive insurance solutions
        designed to protect your multiple vehicles, drivers, and the cargo they carry.
      </p>

      <h2 className="text-3xl font-bold text-deep-navy mb-4">What's Covered?</h2>
      <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
        <li><strong>Primary Auto Liability:</strong> Essential coverage for your entire fleet.</li>
        <li><strong>Physical Damage:</strong> Protects all your trucks from damage.</li>
        <li><strong>Motor Truck Cargo:</strong> Insures the goods transported by your fleet.</li>
        <li><strong>General Liability:</strong> Broad protection for your business operations.</li>
        <li><strong>Workers' Compensation:</strong> Crucial for protecting your drivers (if applicable).</li>
      </ul>

      <p className="text-lg text-gray-700 mb-8">
        Ensure your small fleet is fully protected with a tailored insurance policy. Get a free quote today!
      </p>

      <a href="/quote" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">
        Get Your Small Fleet Quote
      </a>
    </div>
  );
}
