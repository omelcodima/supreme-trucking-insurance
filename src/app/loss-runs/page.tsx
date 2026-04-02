import React from 'react';

export default function LossRunsPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">Loss Run Help</h1>

      <section className="mb-10">
        <h2 className="text-3xl font-bold text-deep-navy mb-4">What are Loss Runs?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Loss runs are a report from your previous insurance carrier detailing your claims history over a specific period,
          typically the last three to five years. Think of it like a credit report for your insurance.
        </p>
        <p className="text-lg text-gray-700">
          They include important information such as the date of loss, type of loss, amount paid by the insurer,
          and any reserves set aside for open claims.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-bold text-deep-navy mb-4">Why Do Carriers Need Them?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Insurance carriers use loss runs to assess your risk profile and determine your premium.
          A clean loss run history can significantly lower your insurance costs.
          Without them, new carriers will often quote higher rates because they can't properly evaluate your risk.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-bold text-deep-navy mb-4">How We Help</h2>
        <p className="text-lg text-gray-700 mb-4">
          Navigating the process of obtaining loss runs can be time-consuming. We can assist you by:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>Explaining what information is needed from your previous carrier.</li>
          <li>Providing templates or guidance for requesting your loss runs.</li>
          <li>Reviewing your loss runs to ensure accuracy and help you understand them.</li>
          <li>Working with new carriers to get the best rates based on your claims history.</li>
        </ul>
        <p className="text-lg text-gray-700">
          Let us help you streamline the process and potentially save you money on your trucking insurance.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-deep-navy mb-4">Need Assistance? Contact Us!</h2>
        <p className="text-lg text-gray-700 mb-6">
          If you need help with your loss runs or have any questions, please reach out.
        </p>
        <a href="/contact" className="bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300">
          Contact Us for Loss Run Help
        </a>
      </section>
    </div>
  );
}
