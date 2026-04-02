'use client';

import { useState } from 'react';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    companyName: '',
    dotNumber: '',
    mcNumber: '',
    numberOfTrucks: '',
    numberOfDrivers: '',
    effectiveDate: '',
    currentCarrier: '',
    message: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('loading');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ // Clear form after successful submission
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          companyName: '',
          dotNumber: '',
          mcNumber: '',
          numberOfTrucks: '',
          numberOfDrivers: '',
          effectiveDate: '',
          currentCarrier: '',
          message: '',
        });
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">Get a Free Quote</h1>
      <p className="text-lg text-gray-700 mb-8">Fill out the form below to get a fast, no-obligation trucking insurance quote.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dotNumber" className="block text-sm font-medium text-gray-700">DOT Number (Optional)</label>
            <input
              type="text"
              id="dotNumber"
              name="dotNumber"
              value={formData.dotNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
          <div>
            <label htmlFor="mcNumber" className="block text-sm font-medium text-gray-700">MC Number (Optional)</label>
            <input
              type="text"
              id="mcNumber"
              name="mcNumber"
              value={formData.mcNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="numberOfTrucks" className="block text-sm font-medium text-gray-700">Number of Trucks</label>
            <input
              type="number"
              id="numberOfTrucks"
              name="numberOfTrucks"
              value={formData.numberOfTrucks}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
          <div>
            <label htmlFor="numberOfDrivers" className="block text-sm font-medium text-gray-700">Number of Drivers</label>
            <input
              type="number"
              id="numberOfDrivers"
              name="numberOfDrivers"
              value={formData.numberOfDrivers}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
        </div>

        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">Desired Effective Date</label>
          <input
            type="date"
            id="effectiveDate"
            name="effectiveDate"
            value={formData.effectiveDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
          />
        </div>

        <div>
          <label htmlFor="currentCarrier" className="block text-sm font-medium text-gray-700">Current Carrier (Optional)</label>
          <input
            type="text"
            id="currentCarrier"
            name="currentCarrier"
            value={formData.currentCarrier}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message/Notes (Optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300"
          disabled={submissionStatus === 'loading'}
        >
          {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Quote Request'}
        </button>

        {submissionStatus === 'success' && (
          <p className="text-green-600 text-center font-semibold mt-4">Thank you for your quote request! We will be in touch shortly.</p>
        )}
        {submissionStatus === 'error' && (
          <p className="text-red-600 text-center font-semibold mt-4">There was an error submitting your request. Please try again.</p>
        )}
      </form>
    </div>
  );
}
