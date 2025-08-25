import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import FeatureViewer from './components/FeatureViewer';
import { medicineReminderFeature } from './components/feature-files/medicine-reminder-feature';
import AppointmentBookingFeature from './components/feature-files/appointment-booking-feature';
import { dietRecommendationsFeature } from './components/feature-files/diet-recommendations-feature';
import bloodBankFeature from './components/feature-files/blood-bank-feature';
import VisionVoiceFeature from './components/feature-files/vision-voice-feature';
import findingNearestDoctorFeature from './components/feature-files/finding-nearest-doctor-feature';
import ocrPrescriptionFeature from './components/feature-files/ocr-prescription-feature';
import MedicinePriceFinder from './components/feature-files/medicine-finder-feature'; 
import medicineSimilarityFeature from './components/feature-files/medicine-similarity';
import { medicineComparisonFeature } from './components/feature-files/medicine-comparison-feature';
import './App.css';

function App() {
  const [currentFeature, setCurrentFeature] = useState(null);

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const featureParam = urlParams.get('feature');
    
    if (featureParam) {
      const featureMapping = {
        "vision-voice": VisionVoiceFeature,
        "diet-recommendations": dietRecommendationsFeature,
        "blood-bank": bloodBankFeature,
        "appointment-booking": AppointmentBookingFeature,
        "medicine-reminder": medicineReminderFeature,
        "finding-doctor": findingNearestDoctorFeature,
        "ocr-prescription": ocrPrescriptionFeature,
        "medicine-price": MedicinePriceFinder,
        "product-search": medicineSimilarityFeature,
        "medicine-comparison": medicineComparisonFeature,
      };

      const feature = featureMapping[featureParam];
      if (feature) {
        setCurrentFeature(feature);
      }
    }
  }, []);

  // If we're showing a feature, render it in a full-page layout
  if (currentFeature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Header for feature pages */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HD</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Health Dashboard Feature
                  </h1>
                  <p className="text-sm text-gray-600">AI-Powered Healthcare Solution</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    window.history.replaceState({}, '', window.location.pathname);
                    setCurrentFeature(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  ← Back to Dashboard
                </button>
                <button 
                  onClick={() => window.close()}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 shadow-lg overflow-hidden">
            <FeatureViewer feature={currentFeature} isDarkMode={false} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-gray-50/80 backdrop-blur-lg border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>© 2025 Health Dashboard. Powered by AI Healthcare Solutions.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Default: show the dashboard
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;