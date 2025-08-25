import React, { useState, useEffect, useRef } from "react";

const Navbar = ({
  onSectionSelect,
  availableSections = [
    "Patients",
    "Appointments",
    "Analytics",
    "Reports",
    "Settings",
  ],
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([
    "Patient records",
    "Appointment scheduling",
    "Medical reports",
    "Health analytics",
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [sectionSuggestions, setSectionSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    const navbar = document.querySelector(".health-navbar-container");
    navbar?.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      navbar?.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchMode]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter search history
      const filtered = searchHistory.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);

      // Filter available sections
      const matchingSections = availableSections.filter((section) =>
        section.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSectionSuggestions(matchingSections);

      setShowSuggestions(filtered.length > 0 || matchingSections.length > 0);
    } else {
      setFilteredSuggestions(searchHistory.slice(0, 5));
      setSectionSuggestions([]);
      setShowSuggestions(isSearchMode);
    }
  }, [searchQuery, searchHistory, isSearchMode, availableSections]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleTitleClick = () => {
    window.location.reload();
  };

  const handleSearchToggle = () => {
    if (isSearchMode) {
      setIsSearchMode(false);
      setSearchQuery("");
      setShowSuggestions(false);
    } else {
      setIsSearchMode(true);
      setShowSuggestions(true);
    }
  };

  const handleSearchSubmit = (query = searchQuery) => {
    if (query.trim()) {
      // Check if the query matches any available section
      const matchingSection = availableSections.find(
        (section) => section.toLowerCase() === query.trim().toLowerCase()
      );

      if (matchingSection && onSectionSelect) {
        onSectionSelect(matchingSection);
        setShowSuggestions(false);
        setIsSearchMode(false);
        setSearchQuery("");
      } else {
        // Add to search history if it's not already there
        if (!searchHistory.includes(query.trim())) {
          setSearchHistory((prev) => [query.trim(), ...prev.slice(0, 4)]);
        }
        console.log("Searching for:", query);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearchSubmit(suggestion);
  };

  const handleSectionSuggestionClick = (section) => {
    if (onSectionSelect) {
      onSectionSelect(section);
      setShowSuggestions(false);
      setIsSearchMode(false);
      setSearchQuery("");
    }
  };

  const handleDeleteSuggestion = (suggestionToDelete, e) => {
    e.stopPropagation();
    setSearchHistory((prev) =>
      prev.filter((item) => item !== suggestionToDelete)
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    } else if (e.key === "Escape") {
      handleSearchToggle();
    }
  };

  const getSectionIcon = (section) => {
    const icons = {
      Patients: "👥",
      Appointments: "📅",
      Analytics: "📊",
      Reports: "📋",
      Settings: "⚙️",
    };
    return icons[section] || "📄";
  };

  return (
    <>
      <nav
        className={`health-navbar-container relative backdrop-blur-xl border-b transition-all duration-500 z-[9999] ${
          isDarkMode
            ? "bg-slate-900/95 border-slate-700/50 text-white"
            : "bg-white/95 border-emerald-200/50 text-slate-800"
        }`}
      >
        {/* Enhanced animated background gradient that follows cursor */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${
              mousePosition.y
            }%, ${
              isDarkMode
                ? "rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1)"
                : "rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.12), rgba(34, 197, 94, 0.1)"
            }, transparent 60%)`,
          }}
        />

        {/* Subtle animated pulse effect */}
        <div
          className={`absolute inset-0 opacity-20 animate-pulse pointer-events-none ${
            isDarkMode
              ? "bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10"
              : "bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5"
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[9999]">
          <div className="flex items-center justify-between h-16">
            {/* Logo and title section */}
            <div className="flex items-center space-x-4">
              <div
                className={`relative w-12 h-12 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer ${
                  isDarkMode
                    ? "bg-emerald-500/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20"
                    : "bg-emerald-100/80 border border-emerald-300/50 shadow-lg shadow-emerald-500/10"
                }`}
              >
                {/* Animated pulse ring */}
                <div
                  className={`absolute inset-0 rounded-xl animate-ping opacity-20 ${
                    isDarkMode ? "bg-emerald-400" : "bg-emerald-500"
                  }`}
                  style={{ animationDuration: "3s" }}
                />
                <span className="text-2xl relative z-10">🏥</span>
              </div>
              <div>
                <h1
                  onClick={handleTitleClick}
                  className={`text-xl font-bold cursor-pointer hover:scale-105 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
                  }`}
                >
                  Health@stic
                </h1>
                <div
                  className={`text-xs mt-0.5 opacity-60 ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Advanced Healthcare Management
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Search container */}
              <div
                ref={searchContainerRef}
                className={`relative hidden sm:block transition-all duration-300 ${
                  isSearchMode ? "min-w-[350px]" : ""
                }`}
              >
                {!isSearchMode ? (
                  // Enhanced Care • Connect • Heal pills with medical theme
                  <div
                    onClick={handleSearchToggle}
                    className={`flex items-center space-x-3 px-5 py-2.5 rounded-full backdrop-blur-xl transition-all duration-300 cursor-pointer hover:scale-105 group ${
                      isDarkMode
                        ? "bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/20"
                        : "bg-emerald-50/80 border border-emerald-200/50 hover:bg-emerald-100/80 hover:shadow-lg hover:shadow-emerald-500/10"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium flex items-center space-x-1">
                        <span className="text-red-400">❤️</span>
                        <span>Care</span>
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-emerald-300" : "text-emerald-600"
                        }
                      >
                        •
                      </span>
                      <span className="text-sm font-medium flex items-center space-x-1">
                        <span className="text-blue-400">🤝</span>
                        <span>Connect</span>
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-teal-300" : "text-teal-600"
                        }
                      >
                        •
                      </span>
                      <span className="text-sm font-medium flex items-center space-x-1">
                        <span className="text-green-400">✨</span>
                        <span>Heal</span>
                      </span>
                    </div>
                    {/* Search icon hint */}
                    <svg
                      className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                ) : (
                  // Enhanced search bar with medical styling
                  <div
                    className={`relative backdrop-blur-xl rounded-full transition-all duration-300 z-[9999] shadow-xl ${
                      isDarkMode
                        ? "bg-slate-800/90 border border-emerald-400/30 shadow-emerald-500/20"
                        : "bg-white/90 border border-emerald-200/50 shadow-emerald-500/10"
                    }`}
                  >
                    <div className="flex items-center px-5 py-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isDarkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search patients, appointments, reports..."
                        className="bg-transparent outline-none text-sm flex-1 placeholder-opacity-60"
                      />
                      <button
                        onClick={handleSearchToggle}
                        className={`ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isDarkMode
                            ? "hover:bg-slate-700/50 text-slate-400 hover:text-white"
                            : "hover:bg-slate-100/50 text-slate-400 hover:text-slate-600"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Enhanced search suggestions dropdown */}
                    {showSuggestions && (
                      <div
                        className={`absolute top-full left-0 right-0 mt-3 rounded-2xl backdrop-blur-xl border shadow-2xl max-h-80 overflow-y-auto z-[9999] ${
                          isDarkMode
                            ? "bg-slate-800/98 border-slate-700/50 text-white"
                            : "bg-white/98 border-slate-200/50 text-slate-800"
                        }`}
                      >
                        {/* Available Sections */}
                        {sectionSuggestions.length > 0 && (
                          <>
                            <div
                              className={`px-4 py-3 text-xs font-semibold opacity-70 border-b flex items-center space-x-2 ${
                                isDarkMode
                                  ? "border-slate-700/50"
                                  : "border-slate-200/50"
                              }`}
                            >
                              <span className="text-emerald-500">🏥</span>
                              <span>Available Sections</span>
                            </div>
                            {sectionSuggestions.map((section, index) => (
                              <div
                                key={`section-${index}`}
                                className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4 ${
                                  isDarkMode
                                    ? "hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/10 border-l-emerald-400/50 hover:border-l-emerald-400"
                                    : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border-l-emerald-400 hover:border-l-emerald-500"
                                }`}
                                onClick={() =>
                                  handleSectionSuggestionClick(section)
                                }
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                                      isDarkMode
                                        ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-400/30 group-hover:from-emerald-400/40 group-hover:to-teal-400/40"
                                        : "bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 group-hover:from-emerald-200 group-hover:to-teal-200"
                                    }`}
                                  >
                                    {getSectionIcon(section)}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">
                                      {section}
                                    </span>
                                    <div className="text-xs opacity-60">
                                      Navigate to {section.toLowerCase()}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                    isDarkMode
                                      ? "bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-400/30"
                                      : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200"
                                  }`}
                                >
                                  Available
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        {/* Search History */}
                        {filteredSuggestions.length > 0 && (
                          <>
                            <div
                              className={`px-4 py-3 text-xs font-semibold opacity-70 border-b flex items-center space-x-2 ${
                                isDarkMode
                                  ? "border-slate-700/50"
                                  : "border-slate-200/50"
                              }`}
                            >
                              <span className="text-blue-500">🕒</span>
                              <span>
                                {searchQuery
                                  ? "Matching searches"
                                  : "Recent searches"}
                              </span>
                            </div>
                            {filteredSuggestions.map((suggestion, index) => (
                              <div
                                key={`history-${index}`}
                                className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-150 ${
                                  isDarkMode
                                    ? "hover:bg-slate-700/50"
                                    : "hover:bg-slate-50"
                                }`}
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                <div className="flex items-center space-x-3">
                                  <svg
                                    className="w-4 h-4 opacity-40"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-sm">{suggestion}</span>
                                </div>
                                <button
                                  onClick={(e) =>
                                    handleDeleteSuggestion(suggestion, e)
                                  }
                                  className="opacity-0 group-hover:opacity-60 hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-all duration-150"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </>
                        )}

                        {/* No results */}
                        {filteredSuggestions.length === 0 &&
                          sectionSuggestions.length === 0 &&
                          searchQuery && (
                            <div className="px-4 py-6 text-sm opacity-60 text-center">
                              <div className="mb-3 text-2xl">🔍</div>
                              <div className="font-medium mb-2">
                                No matching sections or searches found
                              </div>
                              <div className="text-xs">
                                Try searching for:{" "}
                                {availableSections.slice(0, 3).join(", ")}
                              </div>
                            </div>
                          )}

                        {/* Default state */}
                        {!searchQuery && filteredSuggestions.length === 0 && (
                          <>
                            <div
                              className={`px-4 py-3 text-xs font-semibold opacity-70 border-b flex items-center space-x-2 ${
                                isDarkMode
                                  ? "border-slate-700/50"
                                  : "border-slate-200/50"
                              }`}
                            >
                              <span className="text-purple-500">🏥</span>
                              <span>Quick Access</span>
                            </div>
                            {availableSections
                              .slice(0, 4)
                              .map((section, index) => (
                                <div
                                  key={`default-${index}`}
                                  className={`group flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 ${
                                    isDarkMode
                                      ? "hover:bg-slate-700/50"
                                      : "hover:bg-slate-50"
                                  }`}
                                  onClick={() =>
                                    handleSectionSuggestionClick(section)
                                  }
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-3 ${
                                      isDarkMode
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-emerald-100 text-emerald-700"
                                    }`}
                                  >
                                    {getSectionIcon(section)}
                                  </div>
                                  <span className="text-sm font-medium">
                                    {section}
                                  </span>
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Menu button - now visible on all screen sizes */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isDarkMode
                    ? "bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50"
                    : "bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/50"
                } ${isMenuOpen ? "ring-2 ring-emerald-400/50" : ""}`}
              >
                <div className="relative">
                  {/* Hamburger icon with animation */}
                  <div
                    className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? "rotate-45 translate-y-1.5" : "translate-y-0"
                    }`}
                  />
                  <div
                    className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <div
                    className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                      isMenuOpen
                        ? "-rotate-45 -translate-y-1.5"
                        : "translate-y-0"
                    }`}
                  />
                </div>
              </button>

              {/* Enhanced dark mode toggle with medical theme */}
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 group ${
                  isDarkMode
                    ? "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50 shadow-lg shadow-emerald-500/10"
                    : "bg-white/50 border border-emerald-200/50 hover:bg-emerald-50/50 shadow-lg shadow-emerald-500/10"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20"
                      : "bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10"
                  }`}
                />
                <span className="relative z-10 text-lg transition-transform duration-300 group-hover:scale-110">
                  {isDarkMode ? "☀️" : "🌙"}
                </span>
              </button>

              {/* Status indicator - hidden on smaller screens to save space */}
              <div className="hidden xl:flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDarkMode ? "bg-emerald-400" : "bg-emerald-500"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu overlay - now works for both mobile and desktop */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9998]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu content - responsive positioning */}
          <div
            className={`absolute top-16 ${
              // On mobile: full width with margins, on desktop: positioned from right
              window.innerWidth >= 768 ? "right-4 w-80" : "left-4 right-4"
            } mt-2 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              isDarkMode
                ? "bg-slate-900/98 border-slate-700/50 text-white"
                : "bg-white/98 border-emerald-200/50 text-slate-800"
            }`}
          >
            <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
              {/* Menu header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDarkMode
                        ? "bg-emerald-500/20 border border-emerald-400/30"
                        : "bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    <span className="text-lg">🏥</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      Quick Navigation
                    </div>
                    <div
                      className={`text-xs opacity-60 ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Access all sections
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    isDarkMode
                      ? "hover:bg-slate-700/50 text-slate-400 hover:text-white"
                      : "hover:bg-slate-100/50 text-slate-400 hover:text-slate-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile search bar - only show on small screens */}
              <div className="sm:hidden mb-4">
                <div
                  className={`flex items-center px-4 py-3 rounded-xl backdrop-blur-xl transition-all duration-200 ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-emerald-400/30"
                      : "bg-white/50 border border-emerald-200/50"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 mr-3 ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search patients, appointments..."
                    className="bg-transparent outline-none text-sm flex-1 placeholder-opacity-60"
                  />
                </div>
              </div>

              {/* Navigation items */}
              <div className="space-y-2">
                {availableSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSectionSuggestionClick(section);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isDarkMode
                        ? "hover:bg-slate-700/50 active:bg-slate-600/50 hover:shadow-lg hover:shadow-emerald-500/10"
                        : "hover:bg-emerald-50 active:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isDarkMode
                          ? "bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30 group-hover:scale-105"
                          : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 group-hover:scale-105"
                      }`}
                    >
                      <span className="text-xl">{getSectionIcon(section)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{section}</div>
                      <div className="text-xs opacity-60">
                        Navigate to {section.toLowerCase()}
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                          isDarkMode
                            ? "bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-400/30"
                            : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200"
                        }`}
                      >
                        Available
                      </div>
                      <svg
                        className="w-4 h-4 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Menu footer */}
              <div
                className={`mt-6 pt-4 border-t ${
                  isDarkMode ? "border-slate-700/50" : "border-emerald-200/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        isDarkMode ? "bg-emerald-400" : "bg-emerald-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      System Online
                    </span>
                  </div>
                  <div
                    className={`text-xs opacity-60 ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {availableSections.length} sections available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
