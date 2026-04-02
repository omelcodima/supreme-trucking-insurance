'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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

    // In a real application, you would send this data to an API endpoint.
    // For this example, we'll simulate a successful submission after a short delay.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate success
    setSubmissionStatus('success');
    setFormData({ // Clear form after successful submission
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    // Uncomment and modify for actual API integration:
    /*
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionStatus('error');
    }
    */
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-deep-navy mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">We'd love to hear from you. Reach out through the form below or using our contact details.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-deep-navy mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-2"><strong>Phone:</strong> (360) 936-7196</p>
          <p className="text-lg text-gray-700 mb-6"><strong>Email:</strong> domelco@aicinsagency.com</p>
          <p className="text-gray-600">Our team is ready to assist you with all your trucking insurance needs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
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
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-deep-navy focus:border-deep-navy"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300"
            disabled={submissionStatus === 'loading'}
          >
            {submissionStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {submissionStatus === 'success' && (
            <p className="text-green-600 text-center font-semibold mt-4">Your message has been sent successfully!</p>
          )}
          {submissionStatus === 'error' && (
            <p className="text-red-600 text-center font-semibold mt-4">There was an error sending your message. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
