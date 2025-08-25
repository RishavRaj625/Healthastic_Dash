import React, { useState, useEffect } from 'react';

// Enhanced Demo Component with better dark mode integration
const DemoComponent = ({ demoType, demoContent, isDarkMode: propIsDarkMode }) => {
  const [demoState, setDemoState] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode || false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const checkDarkMode = () => {
      const darkModeActive = document.documentElement.classList.contains('dark');
      setIsDarkMode(propIsDarkMode !== undefined ? propIsDarkMode : darkModeActive);
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, [propIsDarkMode]);

  const handleDemo = () => {
    setDemoState('Demo activated! Feature coming soon...');
    setTimeout(() => setDemoState(''), 3000);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div 
      className="relative overflow-hidden rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-[1.02] group shadow-lg"
      onMouseMove={handleMouseMove}
    >
      <div className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/40 border-slate-600/50' 
          : 'bg-white/80 border-white/60'
      }`} />
      
      <div 
        className="absolute inset-0 opacity-20 rounded-2xl transition-all duration-300"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
            isDarkMode 
              ? 'rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.10)' 
              : 'rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08)'
          }, transparent 70%)`
        }}
      />

      <div className="relative z-10">
        <div className={`flex items-center justify-between px-6 py-4 ${
          isDarkMode
            ? 'bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-emerald-700/90'
            : 'bg-gradient-to-r from-emerald-500/95 via-teal-500/95 to-emerald-600/95'
        } backdrop-blur-lg`}>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-sm text-white font-semibold uppercase tracking-wider drop-shadow-sm">
              {demoType} Demo
            </span>
          </div>
          <button
            onClick={handleDemo}
            className="px-5 py-2.5 bg-white/95 text-emerald-700 rounded-full text-xs font-semibold hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-white/40"
          >
            <span className="flex items-center space-x-2">
              <span>Try Demo</span>
              <span className="text-emerald-500">⚡</span>
            </span>
          </button>
        </div>
        
        <div className="relative p-6">
          <div className={`rounded-xl backdrop-blur-lg border transition-all duration-300 overflow-hidden shadow-lg ${
            isDarkMode
              ? 'bg-slate-700/30 border-slate-600/40 shadow-slate-900/20'
              : 'bg-white/90 border-white/50 shadow-emerald-500/5'
          }`}>
            <div className="p-6">
              <div className={`text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-200' : 'text-gray-700'
              }`}>
                {demoContent}
              </div>
              {demoState && (
                <div className={`mt-4 p-4 backdrop-blur-lg border rounded-xl animate-pulse ${
                  isDarkMode
                    ? 'bg-green-500/20 border-green-400/40'
                    : 'bg-green-400/20 border-green-400/30'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className={`font-semibold text-sm ${
                      isDarkMode ? 'text-green-300' : 'text-green-700'
                    }`}>
                      {demoState}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 w-1 h-1 bg-emerald-400/60 rounded-full animate-float delay-500"></div>
      <div className="absolute bottom-6 left-6 w-2 h-2 bg-teal-400/60 rounded-full animate-float delay-1000"></div>
    </div>
  );
};

const FeatureViewer = ({ feature, isDarkMode: propIsDarkMode }) => {
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode || false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const checkDarkMode = () => {
      const darkModeActive = document.documentElement.classList.contains('dark');
      setIsDarkMode(propIsDarkMode !== undefined ? propIsDarkMode : darkModeActive);
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, [propIsDarkMode]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  if (!feature) {
    return (
      <div 
        className="relative overflow-hidden rounded-2xl backdrop-blur-lg border transition-all duration-300 shadow-xl"
        onMouseMove={handleMouseMove}
      >
        <div className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/20 border-slate-700/40' 
            : 'bg-white/70 border-white/50'
        }`} />
        
        <div 
          className="absolute inset-0 opacity-30 rounded-2xl transition-all duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
              isDarkMode 
                ? 'rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.08)' 
                : 'rgba(16, 185, 129, 0.10), rgba(5, 150, 105, 0.08)'
            }, transparent 70%)`
          }}
        />
        

        <div className="absolute top-10 left-10 w-3 h-3 bg-emerald-400/60 rounded-full animate-float delay-1000">
          <div className="absolute inset-0 bg-emerald-400/40 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-teal-400/60 rounded-full animate-float delay-2000">
          <div className="absolute inset-0 bg-teal-400/40 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-cyan-400/40 rounded-full animate-float delay-3000"></div>
        <div className="absolute bottom-10 right-10 text-emerald-400/60 animate-float delay-1500">💊</div>
      </div>
    );
  }

  // Check if feature has a component (functional feature) vs sections (documentation feature)
  if (feature.component) {
    // Render functional component with enhanced styling
    const FeatureComponent = feature.component;
    
    return (
      <div 
        className="relative overflow-hidden rounded-2xl backdrop-blur-lg border transition-all duration-300 shadow-xl"
        onMouseMove={handleMouseMove}
      >
        <div className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/20 border-slate-700/40' 
            : 'bg-white/70 border-white/50'
        }`} />
        
        <div 
          className="absolute inset-0 opacity-20 rounded-2xl transition-all duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
              isDarkMode 
                ? 'rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.10)' 
                : 'rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08)'
            }, transparent 70%)`
          }}
        />

        {/* Enhanced Feature Header */}
        <div className="relative z-10">
          {/* <div className={`p-6 border-b transition-all duration-300 ${
            isDarkMode ? 'border-slate-600/50' : 'border-gray-200/50'
          }`}> */}
          <div className="p-6">
            <div 
              className={`absolute inset-0 backdrop-blur-lg ${
                isDarkMode
                  ? 'bg-gradient-to-br from-emerald-600/85 via-teal-600/85 to-emerald-700/85'
                  : 'bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-emerald-600/90'
              }`}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50"></div>
                <div className="text-white/90 text-sm font-medium uppercase tracking-wider">
                  {feature.category || 'Healthcare'} Feature
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg flex items-center">
                <span className="mr-3">{feature.icon}</span>
                {feature.title}
              </h1>
              <p className="text-white/95 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
          
          {/* Render the actual component with enhanced wrapper */}
          <div className={`relative z-10 p-6 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-800/10' 
              : 'bg-white/20'
          }`}>
            <div className={`rounded-xl backdrop-blur-sm border p-1 transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-800/20 border-slate-600/30'
                : 'bg-white/40 border-white/40'
            }`}>
              <FeatureComponent isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute top-20 right-10 text-emerald-400/50 text-2xl animate-float delay-1000">⚕</div>
        <div className="absolute bottom-32 left-12 w-3 h-3 bg-teal-400/60 rounded-full animate-float delay-2000">
          <div className="absolute inset-0 bg-teal-400/40 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-40 left-20 text-cyan-400/50 text-lg animate-float delay-3000">💊</div>
        <div className="absolute bottom-10 right-20 w-2 h-2 bg-emerald-400/60 rounded-full animate-float delay-1500"></div>
      </div>
    );
  }

  // Render documentation-style feature (with sections) with enhanced styling
  return (
    <div 
      className="relative overflow-hidden rounded-2xl backdrop-blur-lg border transition-all duration-300 shadow-xl"
      onMouseMove={handleMouseMove}
    >
      <div className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/20 border-slate-700/40' 
          : 'bg-white/70 border-white/50'
      }`} />
      
      <div 
        className="absolute inset-0 opacity-20 rounded-2xl transition-all duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, ${
            isDarkMode 
              ? 'rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.10)' 
              : 'rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08)'
          }, transparent 70%)`
        }}
      />

      <div className="relative z-10">
        {/* <div className={`p-8 border-b transition-all duration-300 ${
          isDarkMode ? 'border-slate-600/50' : 'border-gray-200/50'
        }`}> */}
        <div className="p-8">
          <div 
            className={`absolute inset-0 backdrop-blur-lg rounded-t-2xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-emerald-600/80 via-teal-600/80 to-emerald-700/80'
                : 'bg-gradient-to-br from-emerald-500/85 via-teal-500/85 to-emerald-600/85'
            }`}
          />
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50"></div>
              <div className="w-2 h-2 bg-teal-200 rounded-full animate-pulse delay-500 mr-3 shadow-lg shadow-teal-400/50"></div>
              <div className="w-1 h-1 bg-emerald-200 rounded-full animate-pulse delay-1000 shadow-lg shadow-emerald-400/50"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {feature.title}
            </h1>
            <p className="text-white/95 text-lg leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
        
        <div className={`relative z-10 p-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/5' 
            : 'bg-white/10'
        }`}>
          {feature.sections?.map((section, index) => (
            <div key={index} className="mb-16 last:mb-0 group">
              <div className="flex items-center mb-8">
                <div className={`w-14 h-14 rounded-2xl backdrop-blur-lg flex items-center justify-center text-lg font-bold mr-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-emerald-500/80 to-teal-500/80 text-white border-2 border-slate-600/50 shadow-emerald-900/30'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30 border-2 border-white/50'
                }`}>
                  <div className="relative">
                    {index + 1}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75 shadow-lg"></div>
                  </div>
                </div>
                <div>
                  <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"></div>
                </div>
              </div>
              
              <p className={`text-lg mb-8 leading-relaxed pl-20 transition-colors duration-300 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {section.content}
              </p>
              
              {section.demo && (
                <div className="pl-20 mb-8">
                  <DemoComponent 
                    demoType={section.title} 
                    demoContent={section.demo}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
              
              {section.benefits && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-20">
                  {section.benefits.map((benefit, benefitIndex) => (
                    <div 
                      key={benefitIndex} 
                      className={`p-6 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-1 group shadow-lg ${
                        isDarkMode
                          ? 'bg-emerald-500/15 border-emerald-400/40 hover:bg-emerald-500/25 shadow-emerald-900/20'
                          : 'bg-emerald-50/80 border-emerald-200/60 hover:bg-emerald-100/90 shadow-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 group-hover:rotate-12 shadow-lg shadow-emerald-500/30">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold mb-2 text-lg transition-colors duration-300 ${
                            isDarkMode ? 'text-slate-100' : 'text-gray-800'
                          }`}>
                            {benefit.title}
                          </h4>
                          <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mb-3 shadow-sm"></div>
                          <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-600'
                          }`}>
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced floating elements */}
      <div className="absolute top-20 right-10 text-emerald-400/50 text-2xl animate-float delay-1000">⚕</div>
      <div className="absolute bottom-32 left-12 w-3 h-3 bg-teal-400/60 rounded-full animate-float delay-2000">
        <div className="absolute inset-0 bg-teal-400/40 rounded-full animate-ping"></div>
      </div>
      <div className="absolute top-40 left-20 text-cyan-400/50 text-lg animate-float delay-3000">💊</div>
      <div className="absolute bottom-10 right-20 w-2 h-2 bg-emerald-400/60 rounded-full animate-float delay-1500"></div>
    </div>
  );
};

// Enhanced custom animations with better performance
if (!document.querySelector('#feature-viewer-animations')) {
  const style = document.createElement('style');
  style.id = 'feature-viewer-animations';
  style.textContent = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
        opacity: 0.6;
      }
      50% { 
        transform: translateY(-12px) rotate(180deg); 
        opacity: 0.9;
      }
    }
    
    @keyframes pulse-soft {
      0%, 100% { 
        opacity: 0.6; 
        transform: scale(1); 
      }
      50% { 
        opacity: 1; 
        transform: scale(1.05); 
      }
    }
    
    @keyframes glow {
      0%, 100% { 
        box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
      }
      50% { 
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
      }
    }
    
    .animate-float {
      animation: float 5s ease-in-out infinite;
    }
    
    .animate-pulse-soft {
      animation: pulse-soft 2s ease-in-out infinite;
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
    
    /* Smooth transitions for all interactive elements */
    * {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      transition-duration: 300ms;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
}

export default FeatureViewer;