import React, { useState, useEffect } from 'react';

const DietRecommendationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity_level: '',
    dietary_restrictions: '',
    health_conditions: [],
    health_goals: '',
    allergies: '',
    stress_level: '5',
    sleep_hours: '7',
    apiKey: '' // Add API key field for Groq
  });
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInM = parseFloat(formData.height) / 100;
      const bmi = parseFloat(formData.weight) / (heightInM * heightInM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const downloadPDF = async () => {
    if (!planData) return;
    
    try {
      const response = await fetch('http://localhost:3001/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Health_Plan_${formData.name}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Prepare data for Node.js/Express API (matching your backend structure)
      const apiData = {
        apiKey: formData.apiKey, // Groq API key
        age: parseInt(formData.age),
        gender: formData.gender,
        activity_level: formData.activity_level,
        health_goals: formData.health_goals,
        dietary_restrictions: formData.dietary_restrictions || 'None',
        stress_level: parseInt(formData.stress_level),
        sleep_hours: parseFloat(formData.sleep_hours)
      };

      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recommendations');
      }

      const result = await response.json();
      setPlanData(result);
      setCurrentStep(4); // Move to results step
      setError('');
    } catch (error) {
      console.error('Diet API Error:', error);
      setError(error.message || 'Unable to connect to the server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      weight: '',
      height: '',
      activity_level: '',
      dietary_restrictions: '',
      health_conditions: [],
      health_goals: '',
      allergies: '',
      stress_level: '5',
      sleep_hours: '7',
      apiKey: ''
    });
    setPlanData(null);
    setError('');
    setCurrentStep(1);
  };

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Low-Carb', 'Keto', 'Paleo', 'Mediterranean'
  ];

  const healthConditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
    'PCOS', 'Thyroid Issues', 'Kidney Disease', 'None'
  ];

  const activityLevels = [
    { value: 'Low', label: 'Low (Sedentary, little to no exercise)' },
    { value: 'Moderate', label: 'Moderate (Light exercise 1-3 days/week)' },
    { value: 'High', label: 'High (Moderate exercise 3-5 days/week)' },
    { value: 'Very High', label: 'Very High (Hard exercise 6-7 days/week)' }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-700' : 'text-green-300'}`}>
        Personal Information
      </h3>
      
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white-300' : 'text-gray-700'}`}>
          Groq API Key *
        </label>
        <input
          type="password"
          name="apiKey"
          value={formData.apiKey}
          onChange={handleInputChange}
          placeholder="Enter your Groq API key"
          className={`w-full p-3 rounded-lg border transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
              : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
          }`}
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Get your free API key from <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">groq.com</a>
        </p>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white-300' : 'text-gray-700'}`}>
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className={`w-full p-3 rounded-lg border transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
              : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-800' : 'text-gray-300'}`}>
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Enter your age"
            min="1"
            max="120"
            className={`w-full p-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
                : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-800' : 'text-gray-300'}`}>
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full p-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-green-500/30 text-white focus:ring-2 focus:ring-green-500/50'
                : 'bg-white border-green-300 text-gray-800 focus:ring-2 focus:ring-green-400/50'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-800' : 'text-gray-300'}`}>
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Enter weight in kg"
            className={`w-full p-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
                : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-800' : 'text-gray-300'}`}>
            Height (cm)
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="Enter height in cm"
            className={`w-full p-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
                : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
            }`}
          />
        </div>
      </div>

      {calculateBMI() && (
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700'}`}>
          <span className="font-medium">Your BMI: {calculateBMI()}</span>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
        Activity & Lifestyle
      </h3>

      <div>
        <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Activity Level *
        </label>
        <div className="space-y-2">
          {activityLevels.map((level) => (
            <label key={level.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="activity_level"
                value={level.value}
                checked={formData.activity_level === level.value}
                onChange={handleInputChange}
                className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Stress Level (1-10)
          </label>
          <input
            type="range"
            name="stress_level"
            value={formData.stress_level}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="w-full"
          />
          <div className={`text-center text-sm mt-1 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
            {formData.stress_level}/10
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Average Sleep Hours
          </label>
          <input
            type="number"
            name="sleep_hours"
            value={formData.sleep_hours}
            onChange={handleInputChange}
            placeholder="e.g., 7"
            min="1"
            max="24"
            step="0.5"
            className={`w-full p-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
                : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
            }`}
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Health Goals *
        </label>
        <textarea
          name="health_goals"
          value={formData.health_goals}
          onChange={handleInputChange}
          placeholder="Describe your health and fitness goals (e.g., weight loss, muscle gain, better energy, improved sleep)"
          rows="3"
          className={`w-full p-3 rounded-lg border transition-all duration-200 resize-none ${
            isDarkMode
              ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
              : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
          }`}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
        Dietary Preferences & Health Conditions
      </h3>

      <div>
        <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Dietary Preferences
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dietaryOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={formData.dietary_restrictions.includes(option)}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  setFormData(prev => ({
                    ...prev,
                    dietary_restrictions: checked 
                      ? prev.dietary_restrictions + (prev.dietary_restrictions ? ', ' : '') + value
                      : prev.dietary_restrictions.replace(new RegExp(`${value},?\\s*`), '').replace(/,\s*$/, '')
                  }));
                }}
                className={`w-4 h-4 rounded ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Health Conditions
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {healthConditionOptions.map((condition) => (
            <label key={condition} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={condition}
                checked={formData.health_conditions.includes(condition)}
                onChange={(e) => handleCheckboxChange(e, 'health_conditions')}
                className={`w-4 h-4 rounded ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {condition}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Allergies & Food Restrictions
        </label>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          placeholder="List any food allergies or specific foods to avoid (optional)"
          rows="2"
          className={`w-full p-3 rounded-lg border transition-all duration-200 resize-none ${
            isDarkMode
              ? 'bg-gray-800 border-green-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50'
              : 'bg-white border-green-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400/50'
          }`}
        />
      </div>
    </div>
  );

  const renderResults = () => {
    if (error) {
      return (
        <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'}`}>
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium mb-2">Oops! Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (!planData) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            {formData.name}'s AI-Generated Health Plan
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Generated on: {planData.generated_date}
          </p>
          
          <button
            onClick={downloadPDF}
            className={`mt-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            📄 Download PDF Report
          </button>
        </div>

        {/* Diet Plan */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'}`}>
          <h4 className={`font-semibold mb-3 flex items-center ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            🥗 7-Day Diet Plan
          </h4>
          <div className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {planData.diet_plan}
          </div>
        </div>

        {/* Lifestyle Plan */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
          <h4 className={`font-semibold mb-3 flex items-center ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            🏃 Lifestyle Recommendations
          </h4>
          <div className={`text-sm whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {planData.lifestyle_plan}
          </div>
        </div>

        {/* Profile Summary */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20 border border-purple-700/30' : 'bg-purple-50 border border-purple-200'}`}>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
            📋 Profile Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Name:</span>
              <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{formData.name}</span>
            </div>
            <div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Age:</span>
              <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{planData.user_data.age}</span>
            </div>
            <div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gender:</span>
              <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{planData.user_data.gender}</span>
            </div>
            <div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Activity:</span>
              <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{planData.user_data.activity_level}</span>
            </div>
            <div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Stress:</span>
              <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{planData.user_data.stress_level}/10</span>
            </div>
            <div>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Sleep:</span>
              <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{planData.user_data.sleep_hours}h</span>
            </div>
            {calculateBMI() && (
              <div>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>BMI:</span>
                <span className={`ml-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>{calculateBMI()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.age && formData.gender && formData.apiKey.trim();
      case 2:
        return formData.activity_level && formData.health_goals.trim();
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-green-900/10 border-green-500/20' 
        : 'bg-green-50/80 border-green-200/50'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDarkMode 
          ? 'border-green-500/20 bg-green-900/20' 
          : 'border-green-200/50 bg-green-100/50'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${
            isDarkMode 
              ? 'bg-green-500/20 border border-green-400/30' 
              : 'bg-green-100 border border-green-200'
          }`}>
            <span className="text-2xl">🌟</span>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              AI-Powered Lifestyle & Diet Optimizer
            </h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-green-200/80' : 'text-green-600/80'
            }`}>
              Get personalized health and nutrition recommendations powered by AI
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                currentStep >= step
                  ? isDarkMode
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderResults()}

        {isLoading && (
          <div className="text-center py-8">
            <div className={`w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
              isDarkMode ? 'text-green-400' : 'text-green-500'
            }`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Analyzing your profile and generating personalized recommendations...
            </p>
          </div>
        )}

        {error && currentStep !== 4 && (
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'}`}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={`flex justify-between items-center p-6 border-t ${
        isDarkMode 
          ? 'border-green-500/20 bg-green-900/10' 
          : 'border-green-200/50 bg-green-50/30'
      }`}>
        <button
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : resetForm()}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentStep === 1
              ? isDarkMode
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {currentStep === 1 ? 'Reset' : 'Previous'}
        </button>

        <div className="flex space-x-3">
          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid(currentStep) || isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                !isStepValid(currentStep) || isLoading
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Next
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={submitForm}
              disabled={!isStepValid(1) || !isStepValid(2) || isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                !isStepValid(1) || !isStepValid(2) || isLoading
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
               {isLoading ? 'Generating...' : 'Generate My Plan'}
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={resetForm}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Create New Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Export for integration into your health dashboard
export const dietRecommendationsFeature = {
  title: "Health & Diet Recommendations",
  description: "Get personalized health and nutrition recommendations powered by AI",
  component: DietRecommendationForm,
  documentation: `
    ## AI-Powered Lifestyle & Diet Optimizer
    
    This feature provides personalized health and diet recommendations using advanced AI analysis.
    
    ### Features:
    - Personalized 7-day diet plans
    - Lifestyle recommendations
    - BMI calculation and tracking
    - Stress and sleep analysis
    - Activity level optimization
    - PDF report generation
    
    ### How it works:
    1. Enter your Groq API key (get free at groq.com)
    2. Complete your personal information
    3. Share your activity level and lifestyle
    4. Specify dietary preferences and health conditions
    5. Get your AI-generated personalized plan
    6. Download PDF report
    
    ### Requirements:
    - Groq API key (free tier available)
    - Node.js backend running on port 3000
  `
};

export default DietRecommendationForm;