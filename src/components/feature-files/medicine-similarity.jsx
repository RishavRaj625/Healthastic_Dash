import React, { useState, useEffect } from "react";

const ProductSearchApp = () => {
  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // Convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  // Process image with Gemini API directly
  const processImageWithGemini = async () => {
    if (!selectedImage) return;

    setProcessingImage(true);
    setExtractedText("");

    try {
      const base64Image = await convertImageToBase64(selectedImage);
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = base64Image.split(',')[1];
      
      // Call Gemini API directly for OCR
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDR_74P12MU4cHV3mPlzencfWNFUQa9L4Y`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Extract all the text content from this medicine package/label image. Please provide only the text content without any additional formatting or explanation."
                },
                {
                  inline_data: {
                    mime_type: selectedImage.type,
                    data: base64Data
                  }
                }
              ]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const extractedContent = data.candidates[0].content.parts[0].text;
        setExtractedText(extractedContent);
        setInput(extractedContent); // Auto-fill the text box
      } else {
        alert("Could not extract text from the image. Please try again.");
        console.error("Gemini API response:", data);
      }

    } catch (error) {
      console.error("Error processing image with Gemini:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setProcessingImage(false);
    }
  };

  // Clear image selection
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText("");
  };

  // Function to open the Medicine Comparison feature
  const openMedicineComparison = () => {
    const currentOrigin = window.location.origin;
    const featureUrl = `${currentOrigin}/?feature=${encodeURIComponent('medicine-comparison')}`;
    window.open(featureUrl, '_blank');
  };

  // Generate session ID once
  useEffect(() => {
    const newSessionId = "session_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    setSessionId(newSessionId);
  }, []);

  const handleSearch = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setProducts([]);

    // Setup AbortController with 60s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(
        "https://akg003.app.n8n.cloud/webhook/similar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            message: input,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Raw response data:", data); // Debug log

      // Handle different response formats from n8n
      let productsArray = [];
      
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data && typeof data === "object") {
        // If it's an object, check for common n8n response patterns
        if (data.items && Array.isArray(data.items)) {
          productsArray = data.items;
        } else if (data.data && Array.isArray(data.data)) {
          productsArray = data.data;
        } else if (data.output && Array.isArray(data.output)) {
          productsArray = data.output;
        } else if (data.result && Array.isArray(data.result)) {
          productsArray = data.result;
        } else if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
        } else {
          // Single item response
          productsArray = [data];
        }
      }

      // Validate and set products
      if (productsArray.length > 0) {
        // Check if the first item has the expected product structure
        const firstItem = productsArray[0];
        if (firstItem && (firstItem.name || firstItem.medicine_name) && 
            (firstItem.price || firstItem['price(₹)'] || firstItem.cost) && 
            (firstItem.total_composition || firstItem.composition)) {
          setProducts(productsArray);
        } else {
          console.error("Unexpected data format:", productsArray);
          console.log("First item structure:", firstItem);
          setProducts([]);
          alert("Received data in unexpected format. Please check the n8n webhook response structure.");
        }
      } else {
        console.log("No products found in response");
        setProducts([]);
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error fetching products:", error);
      setProducts([]);
      
      if (error.name === 'AbortError') {
        alert("Search request timed out. Please try again.");
      } else if (error.message.includes('Failed to fetch')) {
        alert("Network error. Please check your internet connection and try again.");
      } else {
        alert("An error occurred while searching. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 mr-3 bg-white/20 rounded-full flex items-center justify-center">
                  💊
                </div>
                <h1 className="text-4xl font-bold">Medicine Similarity Search</h1>
              </div>
              <p className="text-xl opacity-90">AI-powered medicine search with OCR capabilities</p>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">
              {/* Text Input Box */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Medicine Information
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type medicine name, composition, or other details here... Or upload an image below to auto-extract text"
                  className={`w-full min-h-[100px] p-4 text-base border-2 border-gray-200 rounded-xl resize-vertical outline-none transition-all duration-300 focus:border-gray-500 focus:ring-4 focus:ring-gray-200 ${
                    extractedText ? 'bg-blue-50' : 'bg-white'
                  }`}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer font-medium transition-colors duration-200 inline-flex items-center gap-2">
                    📷 Upload Medicine Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {selectedImage && (
                    <>
                      <button
                        onClick={processImageWithGemini}
                        disabled={processingImage}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processingImage ? "🔄 Processing..." : "🔍 Extract Text"}
                      </button>
                      
                      <button
                        onClick={clearImage}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        ❌ Clear
                      </button>
                    </>
                  )}
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-48">
                      <img
                        src={imagePreview}
                        alt="Medicine preview"
                        className="w-full h-36 object-cover rounded-xl border-2 border-gray-200"
                      />
                    </div>
                    
                    {/* Extracted Text Display */}
                    {extractedText && (
                      <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Extracted Text:</h4>
                        <div className="text-sm text-gray-600 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                          {extractedText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="text-center pt-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleSearch}
                    disabled={loading || !input.trim()}
                    className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      !input.trim() || loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700 text-white hover:scale-105'
                    }`}
                  >
                    {loading ? "⏳ Searching..." : "🔍 Search Similar Medicines"}
                  </button>
                  
                  <button
                    onClick={openMedicineComparison}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <span>🔍</span>
                    <span>Compare Medicines</span>
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="min-h-[400px] bg-gray-50 rounded-2xl p-6">
                {loading && (
                  <div className="text-center py-16">
                    <div className="text-2xl mb-4">🔄</div>
                    <p className="text-lg text-gray-600">Searching for similar medicines...</p>
                  </div>
                )}

                {processingImage && (
                  <div className="text-center py-16">
                    <div className="text-2xl mb-4">🤖</div>
                    <p className="text-lg text-gray-600">Gemini AI is reading your medicine image...</p>
                  </div>
                )}

                {!loading && !processingImage && products.length === 0 && input && (
                  <div className="text-center py-16">
                    <div className="text-2xl mb-4">🔍</div>
                    <p className="text-lg text-gray-600">No similar medicines found. Try different search terms or check spelling.</p>
                  </div>
                )}

                {!loading && !processingImage && products.length === 0 && !input && (
                  <div className="text-center py-16">
                    <div className="text-2xl mb-4">💊</div>
                    <p className="text-lg text-gray-600">Type medicine details above or upload an image to extract text automatically and find similar medicines.</p>
                  </div>
                )}

                {!loading && !processingImage && products.length > 0 && (
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gray-700 text-white p-4 text-lg font-semibold">
                      Found {products.length} similar medicine{products.length > 1 ? "s" : ""}:
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Medicine Name</th>
                            <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Price (₹)</th>
                            <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Manufacturer</th>
                            <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Composition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="p-4 font-medium text-gray-800 border-b border-gray-100">
                                {product.name || product.medicine_name}
                              </td>
                              <td className="p-4 font-bold text-gray-600 border-b border-gray-100">
                                ₹{product.price || product['price(₹)'] || product.cost}
                              </td>
                              <td className="p-4 text-gray-700 border-b border-gray-100">
                                {product.manufacturer_name || product.manufacturer}
                              </td>
                              <td className="p-4 text-xs text-gray-600 leading-relaxed border-b border-gray-100">
                                {product.total_composition || product.composition}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature wrapper object to match your project structure
const medicineSimilarityFeature = {
  title: "Find Similar Medicines",
  description: "AI agent-powered medicine similarity search tool with OCR capabilities to find similar medicines, compare prices, and analyze compositions using advanced text processing and image recognition.",
  component: ProductSearchApp,
  category: "Healthcare Search & Analysis",
  features: [
    "OCR text extraction from medicine images",
    "AI-powered similarity matching",
    "Real-time medicine search across databases",
    "Composition analysis and comparison",
    "Price comparison across multiple sources",
    "Generic and brand medicine matching",
    "Image-to-text conversion using Gemini AI",
    "Session-based search tracking",
    "Advanced filtering and sorting",
    "Mobile-friendly responsive design"
  ],
  benefits: [
    "Find cheaper alternatives to expensive medicines",
    "Quick OCR scanning of medicine packages",
    "Comprehensive database search capabilities",
    "AI-powered accuracy in medicine matching",
    "Time-saving automated text extraction",
    "Cost-effective medicine discovery",
    "Easy comparison of multiple options",
    "Reliable manufacturer information",
    "Real-time price updates",
    "User-friendly search interface"
  ],
  technologies: [
    "Google Gemini AI for OCR",
    "N8N workflow automation",
    "React.js frontend",
    "RESTful API integration",
    "Base64 image processing",
    "Session management",
    "Real-time data fetching",
    "Responsive web design"
  ],
  useCases: [
    "Finding generic alternatives to brand medicines",
    "Scanning medicine packages for quick search",
    "Price comparison before purchasing",
    "Verifying medicine composition details",
    "Discovering similar therapeutic options",
    "Budget-conscious medicine shopping",
    "Medical research and analysis",
    "Pharmacy inventory management"
  ]
};

// Export both the component and the feature object
export default medicineSimilarityFeature;
export { ProductSearchApp };