import React, { useState } from 'react';

const AppointmentBookingComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
    // preferredDate: "",
    // preferredTime: "",
    // appointmentType: "",
    // additionalNotes: ""
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appointmentTypes = [
    "General Consultation",
    "Emergency Consultation", 
    "Follow-up Appointment",
    "Specialist Referral",
    "Health Checkup",
    "Vaccination",
    "Other"
  ];

  // Function to open the OCR Prescription feature
  const openOCRFeature = () => {
    const currentOrigin = window.location.origin;
    const featureUrl = `${currentOrigin}/?feature=${encodeURIComponent('ocr-prescription')}`;
    window.open(featureUrl, '_blank');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        // "https://akg003.app.n8n.cloud/webhook-test/tallyforms",
        // "https://akg003.app.n8n.cloud/webhook-test/tallyforms",
        // "https://akg003.app.n8n.cloud/webhook/tallyforms",
        // "https://akg003.app.n8n.cloud/webhook-test/tallyforms",
        "https://akg003.app.n8n.cloud/webhook/tallyforms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            featureType: "appointment-booking",
            submittedAt: new Date().toISOString()
          }),
        }
      );

      if (response.ok) {
        setStatus("✅ Success! We'll call you shortly to confirm your appointment.");
        setFormData({
          name: "",
          phone: "",
          email: ""
          // preferredDate: "",
          // preferredTime: "",
          // appointmentType: "",
          // additionalNotes: ""
        });
      } else {
        setStatus("❌ Error booking appointment. Please try again.");
      }
    } catch (error) {
      setStatus("⚠️ Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          📅 Book Medical Appointment
        </h2>
        <p className="'text-white' : 'text-gray-900'">
          Schedule your consultation with our healthcare professionals via phone call
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white-700 dark:text-white-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white-700 dark:text-white-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white-700 dark:text-white-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200"
          />
        </div>

        {/* Appointment Details */}
        

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Booking appointment...</span>
            </>
          ) : (
            <>
              <span>Book Appointment</span>
              <span>📞</span>
            </>
          )}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
          status.includes('Success') 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
        }`}>
          {status}
        </div>
      )}

      {/* OCR Prescription Button */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-300 dark:text-green-800 mb-1 flex items-center">
              <span className="mr-2">📋</span>
              Need to scan a prescription?
            </h3>
            <p className="text-sm text-green-300 dark:text-green-800">
              Extract text from prescription images using AI-powered OCR technology
            </p>
          </div>
          <button
            onClick={openOCRFeature}
            className="flex-shrink-0 ml-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 text-sm"
          >
            <span>📋</span>
            <span>Scan Prescription</span>
          </button>
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-semibold text-blue-300 dark:text-blue-800 mb-2 flex items-center">
          <span className="mr-2">ℹ️</span>
          How appointment booking works
        </h3>
        <ul className="text-sm text-blue-300 dark:text-blue-800 space-y-1">
          <li>• Our team will call you within 3 mins to confirm your appointment</li>
          <li>• We'll find the best available doctor based on your needs</li>
          <li>• You'll receive appointment details via SMS and email</li>
          <li>• Emergency consultations are prioritized and handled immediately</li>
          <li>• All personal information is kept strictly confidential</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg text-center">
          <div className="text-orange-600 dark:text-orange-400 font-semibold mb-1">🚨 Emergency?</div>
          <div className="text-orange-700 dark:text-orange-300 text-xs">Call directly: <strong>911</strong></div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg text-center">
          <div className="text-purple-600 dark:text-purple-400 font-semibold mb-1">⏰ Quick Consult</div>
          <div className="text-purple-700 dark:text-purple-300 text-xs">Same-day appointments available</div>
        </div>
        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors duration-200" onClick={openOCRFeature}>
          <div className="text-teal-600 dark:text-teal-400 font-semibold mb-1">📋 Prescription</div>
          <div className="text-teal-700 dark:text-teal-300 text-xs">Scan with OCR</div>
        </div>
      </div>
    </div>
  );
};

// Export the feature as an object with the proper structure that FeatureViewer expects
const AppointmentBookingFeature = {
  title: "Call to Book Appointment",
  description: "Easily schedule medical appointments through our intelligent booking system that connects you with the right healthcare professionals.",
  icon: "📅",
  category: "Healthcare Booking",
  component: AppointmentBookingComponent  // This is the key - pass the component here
};

export default AppointmentBookingFeature;