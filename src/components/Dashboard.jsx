import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import HealthContainer from "./HealthContainer";
import { medicineReminderFeature } from "./feature-files/medicine-reminder-feature";
import AppointmentBookingFeature from "./feature-files/appointment-booking-feature";
import { dietRecommendationsFeature } from "./feature-files/diet-recommendations-feature";
import bloodBankFeature from "./feature-files/blood-bank-feature";
import VisionVoiceFeature from "./feature-files/vision-voice-feature";
import findingNearestDoctorFeature from "./feature-files/finding-nearest-doctor-feature";
import ocrPrescriptionFeature from "./feature-files/ocr-prescription-feature";
import MedicinePriceFinder from "./feature-files/medicine-finder-feature";
import medicineSimilarityFeature from "./feature-files/medicine-similarity";
import { medicineComparisonFeature } from "./feature-files/medicine-comparison-feature";

const Dashboard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState("main");

  // Add scroll to features function
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("healthcare-features");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Add scroll to additional features function
  const scrollToAdditionalFeatures = () => {
    const additionalSection = document.getElementById("additional-features");
    if (additionalSection) {
      additionalSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Simple solution: Create new routes and open them in new tabs
  const openFeatureInNewTab = (feature) => {
    // Special case: Vision + Voice + RAG redirects to Google
    if (feature === "Vision + Voice + RAG") {
      window.open("https://rag-vision-voice-doc-hpo4w3q3tjtvoxprevc2vm.streamlit.app/", "_blank");
      return;
    }

    const featureContent = getFeatureContent(feature);

    if (!featureContent) {
      openDevelopmentNoticeTab(feature);
      return;
    }

    // Create feature routes - FIXED: Added medicine-price-finder route
    const featureRoutes = {
      "Vision + Voice": "vision-voice",
      "Health & Diet Recommendations": "diet-recommendations",
      "Blood Bank Automation": "blood-bank",
      "Call to Book Appointment": "appointment-booking",
      "Call to Remind Medicine": "medicine-reminder",
      "Finding Nearest Doctor": "finding-doctor",
      "OCR Prescription Scanning": "ocr-prescription",
      "Medicine Price Finder": "medicine-price", // FIXED: Added this route
      "Find Similar Medicine": "product-search", // FIXED: Added this
      "Medicine Comparison": "medicine-comparison", // Added medicine comparison route
    };

    const routeName = featureRoutes[feature];
    if (routeName) {
      // Create a URL with the feature as a query parameter
      const currentOrigin = window.location.origin;
      const featureUrl = `${currentOrigin}/?feature=${encodeURIComponent(
        routeName
      )}`;
      window.open(featureUrl, "_blank");
    } else {
      openDevelopmentNoticeTab(feature);
    }
  };

  // Function to open development notice in new tab
  const openDevelopmentNoticeTab = (feature) => {
    const newWindow = window.open("", "_blank");

    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${feature} - Under Development</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spin-slow {
              animation: spin 3s linear infinite;
            }
          </style>
        </head>
        <body class="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 min-h-screen">
          <div class="min-h-screen flex items-center justify-center p-8">
            <div class="max-w-2xl mx-auto text-center">
              <div class="bg-white/80 backdrop-blur-lg rounded-3xl border border-amber-200/50 shadow-xl p-12">
                <div class="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span class="text-4xl">🚧</span>
                </div>
                
                <h1 class="text-4xl font-bold text-amber-800 mb-4">${feature}</h1>
                <h2 class="text-2xl font-semibold text-amber-700 mb-6">Under Development</h2>
                
                <div class="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 mb-8 border border-amber-200/60">
                  <p class="text-amber-800 text-lg leading-relaxed">
                    This innovative healthcare feature is currently being developed with cutting-edge AI technology. 
                    Our development team is working diligently to bring you this solution soon!
                  </p>
                </div>
                
                <div class="flex items-center justify-center space-x-3 mb-8">
                  <svg class="w-6 h-6 text-amber-600 spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-amber-700 font-medium">Development in progress...</span>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onclick="window.close()" 
                    class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
                  >
                    Close Tab
                  
                  </button>
                  <button 
                    onclick="window.opener.focus(); window.close();" 
                    class="px-6 py-3 bg-white text-amber-700 border border-amber-300 rounded-xl font-medium hover:bg-amber-50 transition-colors duration-200"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.focus();
    }
  };

  // Main/Core Healthcare Features
  const coreHealthFeatures = [
    "Finding Nearest Doctor",
    "Call to Book Appointment",
    "Medicine Price Finder",
    "Vision + Voice + RAG",
    "OCR Prescription Scanning",
    "Find Similar Medicine",
    "Medicine Comparison",
  ];

  // Additional/Suggested Features
  const additionalFeatures = [
    "Blood Bank Automation",
    "Call to Remind Medicine",
    "Health & Diet Recommendations",
  ];

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  // Function to get feature content for each health feature - FIXED
  const getFeatureContent = (feature) => {
    switch (feature) {
      case "Vision + Voice":
        return VisionVoiceFeature;
      case "RAG Based Doctor":
        return null;
      case "Health & Diet Recommendations":
        return dietRecommendationsFeature;
      case "Blood Bank Automation":
        return bloodBankFeature;
      case "Medicine Price Finder": // FIXED: Changed from "Cheapest Medicine Finder"
        return MedicinePriceFinder;
      case "Cheapest Medicine Finder": // Added for backward compatibility
        return MedicinePriceFinder;
      case "Call to Book Appointment":
        return AppointmentBookingFeature;
      case "Call to Remind Medicine":
        return medicineReminderFeature;
      case "Finding Nearest Doctor":
        return findingNearestDoctorFeature;
      case "OCR Prescription Scanning":
        return ocrPrescriptionFeature;
      case "Find Similar Medicine":
        return medicineSimilarityFeature;
      case "Medicine Comparison":
        return medicineComparisonFeature;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
          : "bg-gradient-to-br from-slate-50 via-white to-gray-50"
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced animated background with cursor following effect */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `
            radial-gradient(1200px circle at ${mousePosition.x}% ${
            mousePosition.y
          }%, ${
            isDarkMode
              ? "rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04), transparent 60%"
              : "rgba(16, 185, 129, 0.06), rgba(6, 182, 212, 0.03), transparent 60%"
          }),
            ${
              isDarkMode
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 50%, rgba(248, 250, 252, 0.9) 100%)"
            }
          `,
        }}
      />

      {/* Enhanced floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float opacity-40 ${
              isDarkMode ? "bg-emerald-400/60" : "bg-teal-500/50"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <Navbar />

      {/* Centered Welcome Section */}
      <div className="flex items-center justify-center min-h-[60vh] pt-8 pb-16">
        <div
          className={`text-center p-8 rounded-2xl backdrop-blur-lg border transition-all duration-300 shadow-lg max-w-4xl mx-auto ${
            isDarkMode
              ? "bg-slate-800/30 border-slate-700/50 shadow-slate-900/20"
              : "bg-white/60 border-white/40 shadow-gray-200/30"
          }`}
        >
          <h1
            className={`text-5xl font-bold mb-6 bg-gradient-to-r ${
              isDarkMode
                ? "from-emerald-400 via-teal-300 to-emerald-400"
                : "from-emerald-600 via-teal-600 to-emerald-600"
            } bg-clip-text text-transparent animate-pulse`}
          >
            Welcome to Health@stic
          </h1>
          <p
            className={`text-xl max-w-3xl mx-auto mb-6 leading-relaxed ${
              isDarkMode ? "text-slate-300" : "text-gray-700"
            }`}
          >
            Built For The Busy.
          </p>

          {/* Navigation buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={scrollToFeatures}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <span>Core Features</span>
            </button>

            <button
              onClick={scrollToAdditionalFeatures}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30"
                  : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              <span>Additional Features</span>
            </button>
          </div>

          {/* Enhanced health tip */}
          <div
            className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
              isDarkMode
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/20"
                : "bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/80"
            }`}
          >
            <svg
              className="w-6 h-6 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>❤ Your health, our priority - AI-powered care solutions</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Health Features Section */}
        <div className="mb-20" id="healthcare-features">
          {/* Features Section Header */}
          <div className="text-center mb-12">
            <h2
              className={`text-4xl font-bold mb-4 bg-gradient-to-r cursor-pointer hover:scale-105 transition-transform duration-300 ${
                isDarkMode
                  ? "from-emerald-400 via-teal-300 to-emerald-400"
                  : "from-emerald-600 via-teal-600 to-emerald-600"
              } bg-clip-text text-transparent`}
              onClick={scrollToFeatures}
            >
              Core Healthcare Solutions
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto mb-4 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Essential healthcare tools for comprehensive patient care
            </p>
          </div>

          {/* Core Health Features Grid */}
          <div className="space-y-10 max-w-7xl mx-auto">
            <div
              className="w-full gap-8"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gridAutoRows: "auto",
              }}
            >
              {coreHealthFeatures.map((feature) => (
                <HealthContainer
                  key={feature}
                  feature={feature}
                  isActive={false}
                  onClick={() => openFeatureInNewTab(feature)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mb-20" id="additional-features">
          {/* Additional Features Section Header */}
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                isDarkMode
                  ? "bg-purple-500/20 border-2 border-purple-400/30"
                  : "bg-purple-100 border-2 border-purple-200"
              }`}
            >
              <svg
                className={`w-8 h-8 ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>

            <h2
              className={`text-4xl font-bold mb-4 bg-gradient-to-r cursor-pointer hover:scale-105 transition-transform duration-300 ${
                isDarkMode
                  ? "from-purple-400 via-pink-300 to-purple-400"
                  : "from-purple-600 via-pink-600 to-purple-600"
              } bg-clip-text text-transparent`}
              onClick={scrollToAdditionalFeatures}
            >
              Additional Features
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto mb-6 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Specialized healthcare tools for enhanced patient management and
              care coordination
            </p>
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                isDarkMode
                  ? "bg-purple-500/15 text-purple-300 border border-purple-400/30"
                  : "bg-purple-50/80 text-purple-700 border border-purple-200/60"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Advanced healthcare automation & management tools</span>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="space-y-10 max-w-7xl mx-auto">
            <div
              className="w-full gap-8"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gridAutoRows: "auto",
              }}
            >
              {additionalFeatures.map((feature) => (
                <div key={feature} className="relative group">
                  {/* Special styling for additional features */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
                      isDarkMode
                        ? "from-purple-500/10 to-pink-500/10 border border-purple-400/20"
                        : "from-purple-100/50 to-pink-100/50 border border-purple-200/30"
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <HealthContainer
                    feature={feature}
                    isActive={false}
                    onClick={() => openFeatureInNewTab(feature)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Features comparison section */}
          <div
            className={`mt-16 p-8 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
              isDarkMode
                ? "bg-slate-800/20 border-slate-700/30"
                : "bg-white/40 border-white/60"
            }`}
          >
            <div className="text-center">
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Why Choose Our Healthcare Solutions?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode
                      ? "bg-emerald-500/10 border border-emerald-400/20"
                      : "bg-emerald-50 border border-emerald-200"
                  }`}
                >
                  <div
                    className={`text-3xl mb-3 ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    🚀
                  </div>
                  <h4
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-emerald-300" : "text-emerald-700"
                    }`}
                  >
                    AI-Powered
                  </h4>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-300" : "text-gray-600"
                    }`}
                  >
                    Cutting-edge artificial intelligence for accurate healthcare
                    solutions
                  </p>
                </div>

                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode
                      ? "bg-blue-500/10 border border-blue-400/20"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div
                    className={`text-3xl mb-3 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    ⚡
                  </div>
                  <h4
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    Real-time Processing
                  </h4>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-300" : "text-gray-600"
                    }`}
                  >
                    Instant results and recommendations for immediate healthcare
                    decisions
                  </p>
                </div>

                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode
                      ? "bg-purple-500/10 border border-purple-400/20"
                      : "bg-purple-50 border border-purple-200"
                  }`}
                >
                  <div
                    className={`text-3xl mb-3 ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    🔒
                  </div>
                  <h4
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    }`}
                  >
                    Secure & Private
                  </h4>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-300" : "text-gray-600"
                    }`}
                  >
                    HIPAA-compliant security ensuring patient data privacy and
                    protection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced corner decorative elements */}
      <div className="fixed top-24 right-24 w-32 h-32 pointer-events-none">
        <div
          className={`w-full h-full rounded-full opacity-20 animate-pulse ${
            isDarkMode
              ? "bg-gradient-to-br from-emerald-400/30 to-teal-400/30"
              : "bg-gradient-to-br from-emerald-400/20 to-teal-400/20"
          }`}
        />
      </div>

      <div className="fixed bottom-24 left-24 w-24 h-24 pointer-events-none">
        <div
          className={`w-full h-full rounded-full opacity-30 animate-bounce ${
            isDarkMode
              ? "bg-gradient-to-br from-teal-400/30 to-cyan-400/30"
              : "bg-gradient-to-br from-teal-400/20 to-cyan-400/20"
          }`}
        />
      </div>

      {/* Additional decorative elements for the new section */}
      <div className="fixed top-1/2 left-8 w-16 h-16 pointer-events-none">
        <div
          className={`w-full h-full rounded-full opacity-25 animate-pulse ${
            isDarkMode
              ? "bg-gradient-to-br from-purple-400/30 to-pink-400/30"
              : "bg-gradient-to-br from-purple-400/20 to-pink-400/20"
          }`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="fixed bottom-1/3 right-8 w-20 h-20 pointer-events-none">
        <div
          className={`w-full h-full rounded-full opacity-20 animate-bounce ${
            isDarkMode
              ? "bg-gradient-to-br from-pink-400/30 to-purple-400/30"
              : "bg-gradient-to-br from-pink-400/20 to-purple-400/20"
          }`}
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Additional decorative grid pattern */}
      <div
        className={`fixed inset-0 pointer-events-none opacity-5 ${
          isDarkMode ? "bg-grid-slate-400/10" : "bg-grid-gray-400/10"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 l 0 -60 l 60 0 z' fill='none' stroke='${
            isDarkMode ? "%23334155" : "%236b7280"
          }' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)'/%3e%3c/svg%3e")`,
        }}
      />

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-lg backdrop-blur-lg border transition-all duration-300 hover:scale-110 z-50 ${
          isDarkMode
            ? "bg-slate-800/80 border-slate-700/50 text-emerald-400 hover:bg-slate-700/80"
            : "bg-white/80 border-white/60 text-emerald-600 hover:bg-white/90"
        }`}
      >
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};

// Enhanced custom animations
if (!document.querySelector("#health-dashboard-animations")) {
  const style = document.createElement("style");
  style.id = "health-dashboard-animations";
  style.textContent = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
        opacity: 0.4;
      }
      33% { 
        transform: translateY(-15px) rotate(120deg); 
        opacity: 0.6;
      }
      66% { 
        transform: translateY(-8px) rotate(240deg); 
        opacity: 0.5;
      }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-slideInUp {
      animation: slideInUp 0.6s ease-out;
    }
    
    .animate-fadeInScale {
      animation: fadeInScale 0.5s ease-out;
    }
    
    /* Custom grid background utility */
    .bg-grid-slate-400\\/10 {
      background-image: url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 l 0 -60 l 60 0 z' fill='none' stroke='%23334155' stroke-width='1' opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)'/%3e%3c/svg%3e");
    }
    .bg-grid-gray-400\\/10 {
      background-image: url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 l 0 -60 l 60 0 z' fill='none' stroke='%236b7280' stroke-width='1' opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)'/%3e%3c/svg%3e");
    }
    
    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }
    
    /* Enhanced hover effects for feature cards */
    .feature-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    /* Loading animation for development notice */
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
    
    .shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
      background-size: 400px 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    /* Additional hover animations */
    @keyframes glow {
      0% {
        box-shadow: 0 0 5px rgba(16, 185, 129, 0.2);
      }
      50% {
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 30px rgba(16, 185, 129, 0.2);
      }
      100% {
        box-shadow: 0 0 5px rgba(16, 185, 129, 0.2);
      }
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }

    /* Pulse animation for buttons */
    @keyframes buttonPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .animate-button-pulse {
      animation: buttonPulse 2s ease-in-out infinite;
    }

    /* Gradient animation for text */
    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
    }

    /* Typing animation for text */
    @keyframes typing {
      from {
        width: 0;
      }
      to {
        width: 100%;
      }
    }
    
    @keyframes blink-caret {
      from, to {
        border-color: transparent;
      }
      50% {
        border-color: currentColor;
      }
    }
    
    .animate-typing {
      overflow: hidden;
      border-right: 2px solid;
      white-space: nowrap;
      animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
    }

    /* Card hover effects */
    .health-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .health-card:hover {
      transform: translateY(-12px) scale(1.03);
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    }
    
    .health-card:hover .card-icon {
      transform: scale(1.1) rotate(5deg);
    }

    /* Ripple effect */
    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .animate-ripple {
      animation: ripple 0.6s linear;
    }

    /* Background pattern animations */
    @keyframes patternMove {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 60px 60px;
      }
    }
    
    .animate-pattern {
      animation: patternMove 20s linear infinite;
    }

    /* Text reveal animation */
    @keyframes textReveal {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-text-reveal {
      animation: textReveal 0.8s ease-out forwards;
    }

    /* Stagger animation for multiple elements */
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }
  `;
  document.head.appendChild(style);
}

export default Dashboard;
