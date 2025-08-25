import React, { useState } from 'react';

const MedicineReminderFeature = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    medicineName: "",
    startTime: "",
    dosageCount: "",
    interval: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // "https://akg003.app.n8n.cloud/webhook/tallyforms",
        "https://akg003.app.n8n.cloud/webhook/tallyforms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            featureType: "medicine-reminder"
          }),
        }
      );

      if (response.ok) {
        setStatus("✅ Success! Medicine reminder has been set up successfully.");
        setFormData({
          patientName: "",
          phone: "",
          medicineName: "",
          startTime: "",
          dosageCount: "",
          interval: "",
        });
      } else {
        setStatus("❌ Error setting up reminder. Please try again.");
      }
    } catch (error) {
      setStatus("⚠️ Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 mr-3 bg-white/20 rounded-full flex items-center justify-center">
                  💊
                </div>
                <h1 className="text-4xl font-bold">Medicine Reminder Setup</h1>
              </div>
              <p className="text-xl opacity-90">Never miss your medication with AI-powered reminders via phone calls</p>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">

                    <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                      placeholder="Enter patient's full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1234567890"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* Medicine Information */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Aspirin, Paracetamol"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none"
                  />
                </div>

                {/* Schedule Information */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Dosage Count *
                    </label>
                    <input
                      type="number"
                      name="dosageCount"
                      value={formData.dosageCount}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="e.g., 3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Interval *
                    </label>
                    <input
                      type="text"
                      name="interval"
                      value={formData.interval}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 8 hours"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isSubmitting || !formData.patientName || !formData.phone || !formData.medicineName || !formData.startTime || !formData.dosageCount || !formData.interval
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700 text-white hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Setting up reminder...</span>
                      </>
                    ) : (
                      <>
                        <span>Set Medicine Reminder</span>
                        <span>📞</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status Message */}
              {status && (
                <div className={`p-4 rounded-xl text-center font-medium ${
                  status.includes('Success') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {status}
                </div>
              )}

              {/* Feature Info */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">ℹ️</span>
                  How it works
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    You'll receive automated phone calls at the specified times
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    The system will remind you about your medicine and dosage
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    Call reminders will continue based on your interval settings
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    All data is securely processed and privacy-protected
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature configuration for the dashboard
export const medicineReminderFeature = {
  id: 'medicine-reminder',
  title: 'Call to Remind Medicine',
  description: 'Set up automated phone call reminders for medication schedules',
  component: MedicineReminderFeature,
  icon: '💊',
  category: 'medication',
  status: 'active'
};

export default MedicineReminderFeature;