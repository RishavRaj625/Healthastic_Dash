import React, { useState, useEffect } from 'react';

const OCRPrescriptionFeature = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');
    setExtractedText('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // const response = await fetch('http://localhost:3001/api/ocr', {
        const response = await fetch('http://localhost:3000/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setExtractedText(result.text || 'No text found in the image');
      } else {
        setError(result.error || 'Failed to extract text');
      }
    } catch (err) {
      setError('Network error. Make sure the backend server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setExtractedText('');
    setError('');
    const fileInput = document.getElementById('ocr-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText).then(() => {
      // Create a temporary success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Text copied to clipboard!';
      successMsg.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isDarkMode 
          ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
          : 'bg-green-50 border border-green-500 text-green-800'
      }`;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    }).catch((err) => {
      console.error('Failed to copy text:', err);
    });
  };

  // Function to open the Medicine Similarity feature
  const openMedicineSimilarity = () => {
    const currentOrigin = window.location.origin;
    const featureUrl = `${currentOrigin}/?feature=${encodeURIComponent('product-search')}`;
    window.open(featureUrl, '_blank');
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 transition-all duration-300 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`}>
      {/* Header Section */}
      <div className={`text-center mb-8 p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/60 border-gray-200'
      }`}>
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${
            isDarkMode 
              ? 'bg-blue-500/20 border border-blue-400/30' 
              : 'bg-blue-100 border border-blue-300'
          }`}>
            <svg className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          OCR Prescription Scanner
        </h2>
        <p className={`text-lg max-w-2xl mx-auto font-medium ${
          isDarkMode ? 'text-gray' : 'text-gray-700'
        }`}>
          Upload prescription images and extract text instantly using AI-powered OCR technology
        </p>
      </div>

      {/* Main OCR Interface */}
      <div className={`backdrop-blur-xl border rounded-2xl p-8 mb-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/60 border-gray-200'
      }`}>
        
        {/* File Upload Section */}
        <div className="mb-8">
          <label htmlFor="ocr-file-input" className={`block text-lg font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Select Prescription Image:
          </label>
          
          <div className="relative">
            <input
              id="ocr-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="ocr-file-input"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'border-gray-500 hover:border-blue-400 bg-gray-800/20 hover:bg-gray-700/30' 
                  : 'border-gray-400 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
              }`}
            >
              <svg className={`w-10 h-10 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                Click to upload or drag and drop
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                PNG, JPG, GIF up to 5MB
              </p>
            </label>
          </div>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="mb-8">
            <h3 className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Preview:
            </h3>
            <div className={`relative rounded-xl overflow-hidden border-2 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <img 
                src={preview} 
                alt="Prescription Preview" 
                className="max-w-full max-h-96 mx-auto object-contain bg-white"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            className={`flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
              (!selectedFile || loading)
                ? 'opacity-50 cursor-not-allowed bg-gray-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Extract Text
              </>
            )}
          </button>
          
          {selectedFile && (
            <button
              onClick={handleReset}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-red-500 hover:bg-red-600'
              } shadow-md hover:shadow-lg transform hover:scale-105`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          )}

          <button
            onClick={openMedicineSimilarity}
            className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Similar Medicines
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            isDarkMode 
              ? 'bg-red-500/10 border-red-400/30 text-red-300' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">{error}</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            <div className="inline-flex items-center space-x-2">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-bold">Processing image... This may take a few moments.</span>
            </div>
          </div>
        )}

        {/* Extracted Text Display */}
        {extractedText && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Extracted Text:
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={openMedicineSimilarity}
                  className={`flex items-center px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300'
                      : 'bg-purple-100 hover:bg-purple-200 border-2 border-purple-500 text-purple-800'
                  } transform hover:scale-105`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find Similar Medicines
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300'
                      : 'bg-green-100 hover:bg-green-200 border-2 border-green-500 text-green-800'
                  } transform hover:scale-105`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Text
                </button>
              </div>
            </div>
            
            <textarea
              value={extractedText}
              readOnly
              className={`w-full min-h-[200px] p-4 rounded-xl border-2 font-mono text-sm resize-y transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 text-gray-200 placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-400 text-gray-900 placeholder-gray-600'
              }`}
              placeholder="Extracted text will appear here..."
            />
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className={`backdrop-blur-xl border rounded-2xl p-6 text-center transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/60 border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {/* <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}> */}
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Supported: JPG, PNG, GIF, BMP, TIFF
            </span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {/* <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}> */}
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              
              AI-Powered OCR
            </span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {/* <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}> */}
            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Maximum 5MB file size
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the feature object in the format expected by your dashboard
const ocrPrescriptionFeature = {
  id: 'ocr-prescription',
  title: 'OCR Prescription Scanning',
  description: 'Extract text from prescription images using AI-powered OCR technology',
  component: OCRPrescriptionFeature,
  icon: '📋',
  category: 'medical',
  status: 'active'
};

export default ocrPrescriptionFeature;