import React, { useState } from 'react';
import { Search, DollarSign, Shield, Clock, AlertTriangle, Loader, ExternalLink, MapPin, Star } from 'lucide-react';

const MedicinePriceFinder = () => {
  const [medicineName, setMedicineName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockResults = {
    'paracetamol': {
      medicine_name: 'Paracetamol 500mg',
      timestamp: new Date().toISOString(),
      results: `**Best Prices Found for Paracetamol 500mg:**

**1. Apollo Pharmacy - ₹12.50** ⭐
• Strip of 10 tablets
• *Free delivery above ₹300*
• Available in stock
• Trusted pharmacy chain

**2. Netmeds - ₹13.20**
• Strip of 10 tablets  
• *Same day delivery in metro cities*
• 15% discount on first order
• Prescription required

**3. 1mg - ₹14.00**
• Strip of 10 tablets
• *Express delivery available*
• Cashback offers available
• Digital prescription accepted

**4. PharmEasy - ₹14.50**
• Strip of 10 tablets
• *24/7 customer support*
• Subscription discounts available
• Pan-India delivery

**Generic Alternatives:**
• *Crocin 500mg* - ₹11.80 (Apollo)
• *Dolo 650mg* - ₹16.20 (Netmeds)
• *Paracip 500mg* - ₹13.50 (1mg)

**💡 Money-Saving Tips:**
• Compare prices across platforms before ordering
• Look for bulk purchase discounts
• Check for cashback and coupon offers
• Consider generic alternatives for better savings`
    },
    'aspirin': {
      medicine_name: 'Aspirin 75mg',
      timestamp: new Date().toISOString(),
      results: `**Best Prices Found for Aspirin 75mg:**

**1. 1mg - ₹18.40** ⭐
• Strip of 14 tablets
• *Express delivery in 2 hours*
• Digital prescription accepted
• Lowest price guarantee

**2. Netmeds - ₹19.20**
• Strip of 14 tablets
• *Free delivery above ₹199*
• 20% off on first order
• Available pan-India

**3. Apollo Pharmacy - ₹20.10**
• Strip of 14 tablets
• *Same day delivery*
• Store pickup available
• Trusted brand

**4. PharmEasy - ₹21.50**
• Strip of 14 tablets
• *Subscribe & Save 15%*
• 24/7 customer support
• Easy returns

**Generic Options:**
• *Ecosprin 75mg* - ₹17.80 (1mg)
• *Aspizol 75mg* - ₹18.90 (Netmeds)
• *Loprin 75mg* - ₹19.40 (Apollo)

**⚠️ Important Notes:**
• Prescription required for purchase
• Consult doctor before use
• Check for drug interactions
• Follow dosage instructions carefully`
    },
    'crocin': {
      medicine_name: 'Crocin 650mg',
      timestamp: new Date().toISOString(),
      results: `**Best Prices Found for Crocin 650mg:**

**1. Netmeds - ₹16.80** ⭐
• Strip of 15 tablets
• *Free shipping available*
• Fastest delivery option
• Genuine products guaranteed

**2. Apollo Pharmacy - ₹17.50**
• Strip of 15 tablets
• *Store collection available*
• Member discounts
• Wide availability

**3. PharmEasy - ₹18.20**
• Strip of 15 tablets
• *Auto-refill options*
• Bulk order discounts
• Quality assured

**4. 1mg - ₹18.90**
• Strip of 15 tablets
• *Medicine reminder app*
• Cashback rewards
• Easy reorders

**Bundle Offers:**
• *Buy 3 strips* - Save ₹5 (Netmeds)
• *Family pack* - 20% off (Apollo)
• *Monthly subscription* - 15% off (PharmEasy)

**💊 About Crocin 650mg:**
• Effective fever and pain relief
• Suitable for adults and children above 12
• Can be taken with or without food
• Fast-acting formula`
    }
  };

  const searchMedicine = async (e) => {
    e.preventDefault();
    
    if (!medicineName.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    // Simulate API delay
    setTimeout(() => {
      const searchKey = medicineName.toLowerCase().trim();
      const foundResult = mockResults[searchKey];
      
      if (foundResult) {
        setResults(foundResult);
      } else {
        // Generate a generic result for any medicine not in our mock data
        setResults({
          medicine_name: medicineName,
          timestamp: new Date().toISOString(),
          results: `**Price Search Results for ${medicineName}:**

**Sorry, specific pricing data for "${medicineName}" is not available in our demo.**

**🔍 How our real system works:**
• Searches 15+ verified online pharmacies
• Compares prices across major platforms
• Finds the best deals and offers
• Provides direct purchase links
• Shows generic alternatives
• Includes delivery options

**📱 Supported Pharmacy Partners:**
• Apollo Pharmacy
• Netmeds  
• 1mg
• PharmEasy
• Tata 1mg
• Myra Medicines
• And many more...

**💡 Try searching for:**
• *Paracetamol* - Common pain reliever
• *Aspirin* - Heart medication  
• *Crocin* - Fever reducer

**Note:** This is a demo version. The full system would provide real-time pricing data from actual pharmacy APIs.`
        });
      }
      setLoading(false);
    }, 1500);
  };

  const formatResults = (text) => {
    if (!text) return '';
    
    let formatted = text;
    
    // Replace double asterisks with strong tags first
    while (formatted.includes('**')) {
      const firstIndex = formatted.indexOf('**');
      const secondIndex = formatted.indexOf('**', firstIndex + 2);
      if (secondIndex !== -1) {
        const before = formatted.substring(0, firstIndex);
        const content = formatted.substring(firstIndex + 2, secondIndex);
        const after = formatted.substring(secondIndex + 2);
        formatted = before + '<strong>' + content + '</strong>' + after;
      } else {
        break;
      }
    }
    
    // Replace single asterisks with em tags
    while (formatted.includes('*') && !formatted.includes('**')) {
      const firstStar = formatted.indexOf('*');
      const nextStar = formatted.indexOf('*', firstStar + 1);
      
      if (nextStar !== -1) {
        const before = formatted.substring(0, firstStar);
        const content = formatted.substring(firstStar + 1, nextStar);
        const after = formatted.substring(nextStar + 1);
        
        if (!content.includes('\n')) {
          formatted = before + '<em>' + content + '</em>' + after;
        } else {
          formatted = before + '&#42;' + content + '*' + after;
        }
      } else {
        break;
      }
    }
    
    // Replace newlines
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Convert back escaped asterisks
    formatted = formatted.replace(/&#42;/g, '*');
    
    return formatted;
  };

  const FeatureCard = ({ icon: Icon, title, description, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600", 
      purple: "bg-purple-100 text-purple-600"
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses[color]} rounded-full mb-4`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    );
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
                <h1 className="text-4xl font-bold">Medicine Price Finder</h1>
              </div>
              <p className="text-xl opacity-90">Find the cheapest prices for medicines across India with verified links</p>
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm">
                <Star className="w-4 h-4 mr-2" />
                <span>Demo Version - Try: Paracetamol, Aspirin, or Crocin</span>
              </div>
            </div>

            {/* Search Section */}
            <div className="p-8">
              <div className="mb-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full max-w-2xl">
                    <label htmlFor="medicine-input" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Medicine Name
                    </label>
                    <input
                      id="medicine-input"
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchMedicine(e)}
                      placeholder="Enter medicine name (e.g., Paracetamol, Aspirin, Crocin)"
                                             className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-gray-500 focus:ring-4 focus:ring-gray-200 transition-all duration-300 outline-none text-center"
                      required
                    />
                  </div>
                                     <button
                     onClick={searchMedicine}
                     disabled={loading}
                     className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-full hover:from-gray-700 hover:to-gray-600 focus:ring-4 focus:ring-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                   >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Find Best Price
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* OCR Prescription Button */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="mr-4">
                    <h3 className="font-semibold text-green-800 mb-1 flex items-center justify-center">
                      <span className="mr-2">📄</span>
                      Have a prescription?
                    </h3>
                    <p className="text-sm text-green-700">
                      Scan your prescription to find medicines automatically
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const currentOrigin = window.location.origin;
                      const featureUrl = `${currentOrigin}/?feature=${encodeURIComponent('ocr-prescription')}`;
                      window.open(featureUrl, '_blank');
                    }}
                    className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>📄</span>
                    <span>Scan Prescription</span>
                  </button>
                </div>
              </div>

              {/* Quick Search Suggestions */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-3">Quick searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Paracetamol', 'Aspirin', 'Crocin', 'Ibuprofen', 'Amoxicillin'].map((medicine) => (
                    <button
                      key={medicine}
                      onClick={() => setMedicineName(medicine)}
                                             className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 rounded-full transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                    >
                      {medicine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                                 <div className="text-center py-12 bg-gray-50 rounded-2xl">
                   <Loader className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">Searching for the best prices...</p>
                  <p className="text-gray-500 text-sm">Comparing prices across multiple pharmacies</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {results && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                        💊
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{results.medicine_name}</h3>
                        <p className="text-sm text-gray-500">
                          Search completed at: {new Date(results.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-full">
                      <Shield className="w-4 h-4" />
                      <span>Verified Results</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div 
                      className="prose prose-blue max-w-none text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatResults(results.results) }}
                    />
                  </div>

                  {/* Action Buttons */}
                                     <div className="mt-6 flex flex-wrap gap-3">
                     <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                       <ExternalLink className="w-4 h-4 mr-2" />
                       Visit Pharmacy
                     </button>
                     <button className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                       <MapPin className="w-4 h-4 mr-2" />
                       Find Nearby Store
                     </button>
                     <button className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
                       <Star className="w-4 h-4 mr-2" />
                       Save to Favorites
                     </button>
                   </div>
                </div>
              )}

              {/* Features Section */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                  Why Choose Our Medicine Finder?
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                  Get the best deals on medicines with our comprehensive price comparison platform
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <FeatureCard
                    icon={DollarSign}
                    title="Best Prices"
                    description="Compare prices across 15+ trusted pharmacies to find the lowest rates and save up to 30% on medicines"
                    color="green"
                  />
                  <FeatureCard
                    icon={Shield}
                    title="Verified Sources"
                    description="Only search from reputable and licensed online pharmacy websites with genuine products guarantee"
                    color="blue"
                  />
                  <FeatureCard
                    icon={Clock}
                    title="Real-time Results"
                    description="Get up-to-date pricing information with active working links and fastest delivery options"
                    color="purple"
                  />
                </div>
              </div>

              {/* Demo Notice */}
              {/* <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-amber-600">ℹ️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-amber-800">Demo Version</h3>
                </div>
                <p className="text-amber-700 leading-relaxed">
                  This is a demonstration version with sample data. The full production system would integrate with real pharmacy APIs 
                  to provide live pricing, availability, and direct purchase links. Try searching for <strong>Paracetamol</strong>, <strong>Aspirin</strong>, 
                  or <strong>Crocin</strong> to see sample results.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the feature object with the component, matching the structure from other features
const medicineFinderFeature = {
  title: "Medicine Price Finder",
  description: "AI-powered medicine price comparison tool to find the cheapest prices across verified online pharmacies in India with real-time results.",
  component: MedicinePriceFinder,
  category: "Healthcare Shopping",
  features: [
    "Compare prices across 15+ pharmacies",
    "Find generic alternatives",
    "Real-time price updates",
    "Direct purchase links",
    "Delivery options comparison",
    "Money-saving recommendations",
    "Prescription medicine search",
    "Bulk purchase discounts"
  ],
  benefits: [
    "Save up to 30% on medicines",
    "Quick price comparison",
    "Verified pharmacy sources",
    "Time-saving search",
    "Budget-friendly alternatives",
    "Transparent pricing",
    "Convenient online ordering",
    "Reliable medicine sourcing"
  ]
};

export default medicineFinderFeature;
export { MedicinePriceFinder };