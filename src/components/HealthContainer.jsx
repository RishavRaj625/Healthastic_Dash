import React, { useState, useEffect, useMemo, useCallback } from "react";

const HealthContainer = ({ feature, isActive, onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for dark mode and reduced motion preferences
  useEffect(() => {
    const checkPreferences = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkPreferences();

    const darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addListener(handleMotionChange);

    return () => {
      darkModeObserver.disconnect();
      motionQuery.removeListener(handleMotionChange);
    };
  }, []);

  // Throttled mouse move handler for better performance
  const handleMouseMove = useCallback(
    (e) => {
      if (reducedMotion) return;

      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [reducedMotion]
  );

  // Memoized icon mapping
  const iconMap = useMemo(
    () => ({
      "Vision + Voice": { emoji: "👁️‍🗨️", alt: "Eye and speech bubble" },
      "RAG Based Doctor": { emoji: "🤖", alt: "Robot doctor" },
      "Health & Diet Recommendations": { emoji: "🥗", alt: "Healthy salad" },
      "Blood Bank Automation": { emoji: "🩸", alt: "Blood drop" },
      "Cheapest Medicine Finder": { emoji: "💊", alt: "Medicine pill" },
      "Call to Book Appointment": { emoji: "📞", alt: "Phone" },
      "Call to Remind Medicine": { emoji: "⏰", alt: "Alarm clock" },
      "Finding Nearest Doctor": { emoji: "🏥", alt: "Hospital building" },
      "OCR Prescription Scanning": {
        emoji: "📋",
        alt: "Clipboard with document",
      },
    }),
    []
  );

  // Enhanced color schemes with better contrast and accessibility
  const colorSchemes = useMemo(
    () => ({
      "Vision + Voice": {
        light: {
          gradient: "from-purple-500/90 via-violet-500/90 to-indigo-600/90",
          glow: "shadow-purple-500/25",
          accent: "bg-purple-400",
        },
        dark: {
          gradient: "from-purple-400/80 via-violet-400/80 to-indigo-500/80",
          glow: "shadow-purple-400/30",
          accent: "bg-purple-300",
        },
      },
      "RAG Based Doctor": {
        light: {
          gradient: "from-blue-500/90 via-sky-500/90 to-cyan-600/90",
          glow: "shadow-blue-500/25",
          accent: "bg-blue-400",
        },
        dark: {
          gradient: "from-blue-400/80 via-sky-400/80 to-cyan-500/80",
          glow: "shadow-blue-400/30",
          accent: "bg-blue-300",
        },
      },
      "Health & Diet Recommendations": {
        light: {
          gradient: "from-green-500/90 via-emerald-500/90 to-teal-600/90",
          glow: "shadow-green-500/25",
          accent: "bg-green-400",
        },
        dark: {
          gradient: "from-green-400/80 via-emerald-400/80 to-teal-500/80",
          glow: "shadow-green-400/30",
          accent: "bg-green-300",
        },
      },
      "Blood Bank Automation": {
        light: {
          gradient: "from-red-500/90 via-rose-500/90 to-pink-600/90",
          glow: "shadow-red-500/25",
          accent: "bg-red-400",
        },
        dark: {
          gradient: "from-red-400/80 via-rose-400/80 to-pink-500/80",
          glow: "shadow-red-400/30",
          accent: "bg-red-300",
        },
      },
      "Cheapest Medicine Finder": {
        light: {
          gradient: "from-orange-500/90 via-amber-500/90 to-yellow-600/90",
          glow: "shadow-orange-500/25",
          accent: "bg-orange-400",
        },
        dark: {
          gradient: "from-orange-400/80 via-amber-400/80 to-yellow-500/80",
          glow: "shadow-orange-400/30",
          accent: "bg-orange-300",
        },
      },
      "Call to Book Appointment": {
        light: {
          gradient: "from-teal-500/90 via-cyan-500/90 to-blue-600/90",
          glow: "shadow-teal-500/25",
          accent: "bg-teal-400",
        },
        dark: {
          gradient: "from-teal-400/80 via-cyan-400/80 to-blue-500/80",
          glow: "shadow-teal-400/30",
          accent: "bg-teal-300",
        },
      },
      "Call to Remind Medicine": {
        light: {
          gradient: "from-violet-500/90 via-purple-500/90 to-fuchsia-600/90",
          glow: "shadow-violet-500/25",
          accent: "bg-violet-400",
        },
        dark: {
          gradient: "from-violet-400/80 via-purple-400/80 to-fuchsia-500/80",
          glow: "shadow-violet-400/30",
          accent: "bg-violet-300",
        },
      },
      "Finding Nearest Doctor": {
        light: {
          gradient: "from-indigo-500/90 via-blue-500/90 to-purple-600/90",
          glow: "shadow-indigo-500/25",
          accent: "bg-indigo-400",
        },
        dark: {
          gradient: "from-indigo-400/80 via-blue-400/80 to-purple-500/80",
          glow: "shadow-indigo-400/30",
          accent: "bg-indigo-300",
        },
      },
      "OCR Prescription Scanning": {
        light: {
          gradient: "from-slate-500/90 via-gray-500/90 to-zinc-600/90",
          glow: "shadow-slate-500/25",
          accent: "bg-slate-400",
        },
        dark: {
          gradient: "from-slate-400/80 via-gray-400/80 to-zinc-500/80",
          glow: "shadow-slate-400/30",
          accent: "bg-slate-300",
        },
      },
    }),
    []
  );

  // Enhanced descriptions
  const descriptions = useMemo(
    () => ({
      "Vision + Voice":
        "AI-powered visual recognition and voice assistance for accessibility",
      "RAG Based Doctor":
        "Intelligent medical consultation with retrieval-augmented generation",
      "Health & Diet Recommendations":
        "Personalized wellness guidance based on your health profile",
      "Blood Bank Automation":
        "Streamlined blood donation management and inventory tracking",
      "Cheapest Medicine Finder":
        "Compare prices and find the most affordable medication options",
      "Call to Book Appointment":
        "Voice-enabled appointment scheduling with healthcare providers",
      "Call to Remind Medicine":
        "Automated medication reminders via phone calls",
      "Finding Nearest Doctor":
        "Locate nearby healthcare providers and specialists in your area",
      "OCR Prescription Scanning":
        "Optical character recognition for digital prescription processing",
    }),
    []
  );

  // Get current theme colors
  const getCurrentColors = () => {
    const scheme = colorSchemes[feature];
    if (!scheme) return colorSchemes["OCR Prescription Scanning"];
    return isDarkMode ? scheme.dark : scheme.light;
  };

  const colors = getCurrentColors();
  const icon = iconMap[feature] || { emoji: "🏥", alt: "Hospital" };
  const description = descriptions[feature] || "Health feature";

  const handleClick = () => {
    onClick(isActive ? null : feature);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reducedMotion && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`${feature}: ${description}`}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-out transform focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
        !reducedMotion ? "hover:scale-[1.02] hover:-translate-y-1" : ""
      } ${
        isActive
          ? `shadow-2xl ${colors.glow}`
          : isDarkMode
          ? "hover:shadow-xl hover:shadow-indigo-500/20"
          : "hover:shadow-xl hover:shadow-purple-500/20"
      }`}
    >
      {/* Glassmorphism background */}
      <div
        className={`absolute inset-0 backdrop-blur-xl border transition-all duration-300 rounded-2xl ${
          isDarkMode
            ? "bg-gray-900/40 border-white/10"
            : "bg-white/60 border-white/20"
        }`}
      />

      {/* Interactive gradient overlay */}
      {!reducedMotion && (isHovered || isActive) && (
        <div
          className="absolute inset-0 opacity-30 transition-all duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}% ${
              mousePosition.y
            }%, ${
              isActive
                ? "rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.3)"
                : "rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.2)"
            }, transparent 70%)`,
          }}
        />
      )}

      {/* Active state background */}
      {isActive && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl`}
        />
      )}

      {/* Content container */}
      <div className="relative z-10 p-6">
        <div className="text-center">
          {/* Icon with enhanced animations */}
          <div
            className={`text-4xl mb-3 transition-all duration-300 ${
              !reducedMotion && isHovered ? "animate-bounce" : ""
            } ${isActive ? "drop-shadow-lg" : ""}`}
          >
            <span role="img" aria-label={icon.alt}>
              {icon.emoji}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-lg font-semibold mb-2 transition-all duration-300 ${
              isActive
                ? "text-white drop-shadow-md"
                : isDarkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            {feature}
          </h3>

          {/* Description */}
          <p
            className={`text-sm transition-all duration-300 ${
              isActive
                ? "text-white/90"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            {isActive
              ? "Click to hide documentation"
              : "Click to view documentation"}
          </p>
        </div>

        {/* Floating particles effect */}
        {!reducedMotion && isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 right-6 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-70" />
            <div
              className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-60"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute top-12 left-8 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-6 right-12 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        )}

        {/* Active indicator with pulsing animation */}
        {isActive && (
          <div className="absolute top-4 right-4 flex space-x-1">
            <div
              className={`w-2.5 h-2.5 ${colors.accent} rounded-full ${
                !reducedMotion ? "animate-pulse" : ""
              }`}
            />
            <div
              className={`w-2 h-2 bg-white/80 rounded-full ${
                !reducedMotion ? "animate-pulse" : ""
              }`}
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className={`w-1.5 h-1.5 bg-white/60 rounded-full ${
                !reducedMotion ? "animate-pulse" : ""
              }`}
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        )}

        {/* Enhanced glow effect */}
        {!reducedMotion && (
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
              isHovered
                ? `bg-gradient-to-br ${colors.gradient} opacity-20 blur-xl scale-105`
                : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* Border highlight on focus */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 transition-opacity duration-300 ${
          isActive
            ? "border-white/30 opacity-100"
            : "border-transparent opacity-0"
        }`}
      />
    </div>
  );
};

export default HealthContainer;
