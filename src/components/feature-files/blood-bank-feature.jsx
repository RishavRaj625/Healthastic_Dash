import React, { useState, useEffect } from "react";

const BloodBankForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bloodGroup: "",
    email: ""
  });
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(""); // "success", "error", or ""

  // Generate sessionId in memory (no localStorage)
  useEffect(() => {
    const newSessionId = "blood_bank_session_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    setSessionId(newSessionId);
  }, []);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    
    // Validation
    if (!formData.name.trim() || !formData.location.trim() || !formData.bloodGroup || !formData.email.trim()) {
      setSubmitMessage("⚠️ Please fill in all fields");
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 3000);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage("⚠️ Please enter a valid email address");
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 3000);
      return;
    }

    setIsLoading(true);
    setSubmitMessage("");
    setSubmitStatus("");

    try {
      const response = await fetch(
        "https://akg003.app.n8n.cloud/webhook/chatbota",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            message: `Blood Bank Registration: Name: ${formData.name}, Location: ${formData.location}, Blood Group: ${formData.bloodGroup}, Email: ${formData.email}`,
            context: "blood_bank_registration",
            formData: formData
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Success response
      setSubmitMessage("✅ Registration successful! Thank you for registering as a blood donor.");
      setSubmitStatus("success");
      
      // Reset form
      setFormData({
        name: "",
        location: "",
        bloodGroup: "",
        email: ""
      });

      setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 5000);

    } catch (error) {
      console.error("Blood Bank Registration Error:", error);
      setSubmitMessage("🔴 Sorry, registration failed. Please try again or contact your local blood bank directly.");
      setSubmitStatus("error");
      
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action buttons for common blood bank queries
  const quickActions = [
    // "Find blood donors near me",
    // "Blood bank locations",
    // "Emergency blood request",
    // "Check blood compatibility"
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-red-900/10 border-red-500/20' 
        : 'bg-red-50/80 border-red-200/50'
    }`}>
      {/* Header */}
      <div className={`flex items-center space-x-3 p-6 border-b ${
        isDarkMode 
          ? 'border-red-500/20 bg-red-900/20' 
          : 'border-red-200/50 bg-red-100/50'
      }`}>
        <div className={`p-3 rounded-full ${
          isDarkMode 
            ? 'bg-red-500/20 border border-red-400/30' 
            : 'bg-red-100 border border-red-200'
        }`}>
          <span className="text-2xl">🩸</span>
        </div>
        <div>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-red-300' : 'text-red-700'
          }`}>
            Blood Donor Registration
          </h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-red-200/80' : 'text-red-600/80'
          }`}>
            Register to save lives through blood donation
          </p>
        </div>
        {isLoading && (
          <div className="ml-auto">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDarkMode ? 'bg-red-400' : 'bg-red-500'
            }`} />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-red-200/30">
        <p className={`text-sm font-medium mb-3 ${
          isDarkMode ? 'text-red-300' : 'text-red-700'
        }`}>
          
        </p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-red-800/30 border-red-600/30 text-red-300 hover:bg-red-700/40' 
                  : 'bg-red-100 border-red-300/50 text-red-700 hover:bg-red-200'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Registration Form */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              disabled={isLoading}
              className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 border-red-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50"
                  : "bg-white border-red-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-red-400/50"
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Location Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your city/area"
              disabled={isLoading}
              className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 border-red-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50"
                  : "bg-white border-red-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-red-400/50"
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Blood Group Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              Blood Group *
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 border-red-500/30 text-white focus:ring-2 focus:ring-red-500/50"
                  : "bg-white border-red-300 text-gray-800 focus:ring-2 focus:ring-red-400/50"
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">Select your blood group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Email Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              disabled={isLoading}
              className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 border-red-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50"
                  : "bg-white border-red-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-red-400/50"
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isLoading
                  ? isDarkMode
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105"
                    : "bg-red-500 text-white hover:bg-red-600 hover:scale-105"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                "Register as Blood Donor"
              )}
            </button>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mt-4 p-3 rounded-xl border ${
            submitStatus === "success"
              ? isDarkMode
                ? "bg-green-900/20 border-green-500/30 text-green-300"
                : "bg-green-100 border-green-300 text-green-700"
              : isDarkMode
                ? "bg-red-900/20 border-red-500/30 text-red-300"
                : "bg-red-100 border-red-300 text-red-700"
          }`}>
            <p className="text-sm">{submitMessage}</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`px-4 pb-4 text-center ${
        isDarkMode ? 'text-red-300/60' : 'text-red-600/60'
      }`}>
        <p className="text-xs">
          🆘 For medical emergencies, call your local emergency services immediately
        </p>
        <p className="text-xs mt-1">
          💝 Your registration helps save lives in your community
        </p>
      </div>
    </div>
  );
};

// Export the feature object with the component, matching the structure from other features
const bloodBankFeature = {
  title: "Blood Bank Automation",
  description: "AI-powered blood bank assistant to help find donors, locate blood banks, and manage blood donation requests efficiently.",
  component: BloodBankForm,
  category: "Emergency Services",
  features: [
    "Register as a blood donor",
    "Find nearby blood donors",
    "Locate blood banks and centers", 
    "Emergency blood requests",
    "Blood type compatibility checking",
    "Donation appointment scheduling"
  ],
  benefits: [
    "Quick emergency blood matching",
    "24/7 blood bank assistance",
    "Streamlined donor registration",
    "Real-time blood availability",
    "Life-saving connections"
  ]
};

export default bloodBankFeature;