import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaTimes, FaPlus } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ArtisanDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState([]);
  const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] = useState(false);
  const specializationDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGeneralFeedbackModal, setShowGeneralFeedbackModal] = useState(false);
  const [generalFeedbackForm, setGeneralFeedbackForm] = useState({
    name: "",
    email: "",
    artisanName: "",
    feedback: ""
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const artisansPerPage = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Feedback slider animation variables
  const feedbackSliderRef = useRef(null);
  const feedbackContainerRef = useRef(null);
  const [feedbackScrollPosition, setFeedbackScrollPosition] = useState(0);
  const [isFeedbackPaused, setIsFeedbackPaused] = useState(false);
  const feedbackScrollSpeed = 0.5;

  // Country codes for dropdown
  const countryCodes = [
    { code: '+1', name: 'US', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+91', name: 'IN', flag: '🇮🇳' },
    { code: '+33', name: 'FR', flag: '🇫🇷' },
    { code: '+49', name: 'DE', flag: '🇩🇪' },
    { code: '+81', name: 'JP', flag: '🇯🇵' },
    { code: '+86', name: 'CN', flag: '🇨🇳' },
    { code: '+234', name: 'NG', flag: '🇳🇬' },
    { code: '+27', name: 'ZA', flag: '🇿🇦' },
    { code: '+20', name: 'EG', flag: '🇪🇬' },
    // Add more country codes as needed
  ];

  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');

  const specializations = [
    "Ornaments",
    "Idol Maker",
    "Metalworking",
    "Utensils",
    "Premium Products",
    "Meenakari/Mina Work",
    "Sculpture Maker",
    "Mixed Metal",
    "Home Decor",
    "Tribal Jewelry",
    "Other"
  ];

  const handleSpecializationToggle = (specialization) => {
    setSpecializationFilter((prev) => {
      const newFilters = prev.includes(specialization)
        ? prev.filter((s) => s !== specialization)
        : prev.length < 3
        ? [...prev, specialization]
        : prev;

      setCurrentPage(1);
      return newFilters;
    });
  };

  const removeSpecialization = (specializationToRemove) => {
    setSpecializationFilter((prev) =>
      prev.filter((s) => s !== specializationToRemove)
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specializationDropdownRef.current && !specializationDropdownRef.current.contains(event.target)) {
        setIsSpecializationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmitGeneralFeedback = async (e) => {
    e.preventDefault();
    // Validate phone number if entered
    if (generalFeedbackForm.email && generalFeedbackForm.email.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
    try {
      // Merge country code with phone number if phone is provided
      const mergedForm = {
        ...generalFeedbackForm,
        email: generalFeedbackForm.email
          ? `${selectedCountryCode}${generalFeedbackForm.email}`
          : '',
      };
      const response = await axios.post(`${backendUrl}/api/feedback`, mergedForm);
      if (response.status === 201) {
        setShowGeneralFeedbackModal(false);
        setGeneralFeedbackForm({
          name: "",
          email: "",
          artisanName: "",
          feedback: ""
        });
        alert("Thank you for your feedback!");
        fetchFeedbacks();
      }
    } catch (error) {
      console.error("Error submitting general feedback:", error);
      alert(error.response?.data?.message || "Failed to submit feedback. Please try again.");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const response = await axios.get(`${backendUrl}/api/feedback`);
      setFeedbacks(response.data);
      setFeedbackScrollPosition(0);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/artisans`);

        if (response.data.success) {
          const artisansWithImagesPromises = response.data.data.map(async (artisan) => {
            try {
              const profileRes = await axios.get(`${backendUrl}/public/artisans/${artisan.artisanId}`);
              return { ...artisan, profileImage: profileRes.data.profileImage };
            } catch (profileErr) {
              console.error(`Error fetching profile image for ${artisan.artisanId}:`, profileErr);
              return { ...artisan, profileImage: null };
            }
          });
          const artisansWithImages = await Promise.all(artisansWithImagesPromises);
          setArtisans(artisansWithImages);
        } else {
          setError("Failed to fetch artisans");
        }
      } catch (err) {
        console.error("Error fetching artisans:", err);
        setError(err.response?.data?.message || "Failed to fetch artisans");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
    fetchFeedbacks();
  }, [backendUrl]);

  useEffect(() => {
    if (!feedbackSliderRef.current || feedbacks.length === 0) return;

    let animationFrameId;
    let lastTimestamp = performance.now();
    let isMounted = true;

    const animate = (timestamp) => {
      if (!isMounted) return;
      
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!feedbackSliderRef.current || !feedbackSliderRef.current.scrollWidth) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      if (!isFeedbackPaused) {
        setFeedbackScrollPosition((prev) => {
          const sliderWidth = feedbackSliderRef.current.scrollWidth / 2;
          const newPosition = prev + (feedbackScrollSpeed * delta) / 16;
          
          if (newPosition >= sliderWidth) {
            return 0;
          }
          return newPosition;
        });
      }

      if (isMounted) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (feedbackSliderRef.current) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFeedbackPaused, feedbacks]);

  const filteredArtisans = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artisan.specialization &&
        artisan.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      artisan.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.artisanId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      specializationFilter.length === 0 ||
      specializationFilter.some((filter) =>
        artisan.specialization &&
        artisan.specialization.split(',').map(s => s.trim()).includes(filter)
      );

    return matchesSearch && matchesSpecialization;
  });

  const exportToExcel = () => {
    if (filteredArtisans.length === 0) {
      alert("No artisans to export");
      return;
    }

    const dataToExport = filteredArtisans.map((artisan) => ({
      ID: artisan.id,
      Name: artisan.name,
      ArtisanID: artisan.artisanId,
      Specialization: artisan.specialization,
      Contact: artisan.contact,
    }));

    const headers = Object.keys(dataToExport[0]).join(",");
    const rows = dataToExport.map((row) => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `artisans_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indexOfLastArtisan = currentPage * artisansPerPage;
  const indexOfFirstArtisan = indexOfLastArtisan - artisansPerPage;
  const currentArtisans = filteredArtisans.slice(
    indexOfFirstArtisan,
    indexOfLastArtisan
  );
  const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading artisans...</div>
      </div>
    );
  }

  if (error) {
    // Show a friendly message if the error is due to no data or empty DB
    const friendlyNoDataMessages = [
      'No artisans found',
      'No data',
      'No artisans in database',
      'No artisans available',
      'No artisans are listed',
      'No artisans',
      'No records',
      'No data found',
      'No artisans are listed on the website yet.'
    ];
    const isNoData =
      friendlyNoDataMessages.some(msg => error.toLowerCase().includes(msg.toLowerCase())) ||
      error.toLowerCase().includes('empty') ||
      error.toLowerCase().includes('not found') ||
      error.toLowerCase().includes('no such table') ||
      error.toLowerCase().includes('does not exist');

    // Detect network/server errors
    const isNetworkError =
      error.toLowerCase().includes('network') ||
      error.toLowerCase().includes('failed to fetch') ||
      error.toLowerCase().includes('timeout') ||
      error.toLowerCase().includes('500') ||
      error.toLowerCase().includes('502') ||
      error.toLowerCase().includes('503') ||
      error.toLowerCase().includes('504') ||
      error.toLowerCase().includes('gateway') ||
      error.toLowerCase().includes('server') ||
      error.toLowerCase().includes('connection refused') ||
      error.toLowerCase().includes('not allowed') ||
      error.toLowerCase().includes('cors');

    let displayMessage = error;
    let colorClass = 'text-red-600';
    if (isNoData) {
      displayMessage = 'No artisans are listed on the website yet.';
      colorClass = 'text-gray-600';
    } else if (isNetworkError) {
      displayMessage = 'Unable to connect to the server. Please try again later.';
      colorClass = 'text-red-600';
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className={`text-xl font-semibold ${colorClass}`}>
          {displayMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Artisans Database
          </h2>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={filteredArtisans.length === 0}
            >
              Export to CSV
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, specialization, contact or artisan ID..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
          </div>
          <div className="relative w-full sm:w-auto" ref={specializationDropdownRef}>
            <button
              onClick={() => setIsSpecializationDropdownOpen((prev) => !prev)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left flex justify-between items-center bg-white cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isSpecializationDropdownOpen}
            >
              {specializationFilter.length > 0
                ? specializationFilter.join(", ")
                : "Select Specializations"}
              <svg
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                  isSpecializationDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {isSpecializationDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => handleSpecializationToggle(spec)}
                    className={`block w-full text-left px-4 py-2 text-sm
                      ${
                        specializationFilter.includes(spec)
                          ? "bg-blue-100 text-blue-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    disabled={specializationFilter.length >= 3 && !specializationFilter.includes(spec)}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            )}
            {specializationFilter.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {specializationFilter.map((spec) => (
                  <span
                    key={spec}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-green-800 bg-green-100 text-sm font-medium"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(spec)}
                      className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                      aria-label={`Remove ${spec}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentArtisans.length > 0 ? (
                  currentArtisans.map((artisan) => (
                    <tr key={artisan.id}>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-300 flex items-center justify-center text-sm font-semibold text-gray-700">
                            {artisan.profileImage ? (
                              <img src={`${backendUrl}${artisan.profileImage}`} alt={artisan.name} className="w-full h-full object-cover" />
                            ) : (
                              artisan.name?.[0]?.toUpperCase() || 'A'
                            )}
                          </div>
                          {artisan.name}
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                        {artisan.specialization || "Not specified"}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                        {`+91${artisan.contact}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No artisans found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredArtisans.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstArtisan + 1} to{" "}
                {Math.min(indexOfLastArtisan, filteredArtisans.length)} of{" "}
                {filteredArtisans.length} artisans
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 py-1">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => paginate(totalPages)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Customer Feedback Section */}
      <section 
        className="px-6 md:px-10 pt-4 pb-4 md:pt-6 md:pb-6 bg-gray-50"
        onMouseEnter={() => setIsFeedbackPaused(true)}
        onMouseLeave={() => setIsFeedbackPaused(false)}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customer Feedback</h2>
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowGeneralFeedbackModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Add Feedback
          </button>
        </div>
        
        {feedbackLoading ? (
          <div className="text-center py-4">Loading feedbacks...</div>
        ) : feedbacks.length > 0 ? (
          <div className="relative w-full overflow-hidden py-4" ref={feedbackContainerRef}>
            <div
              ref={feedbackSliderRef}
              className="flex gap-6 w-max"
              style={{
                transform: `translateX(-${feedbackScrollPosition}px)`,
                transition: isFeedbackPaused ? "transform 0.5s ease" : "none",
              }}
            >
              {[...feedbacks, ...feedbacks].map((feedback, index) => (
                <div key={`${feedback.id}-${index}`} className="flex-none w-80 p-2">
                  <div className="relative bg-white p-6 rounded-lg shadow-md flex flex-col items-start space-y-4 h-full">
                    {feedback.artisanName && (
                      <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        For: {feedback.artisanName}
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {feedback.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">{feedback.name}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full flex-grow border-l-4 border-blue-400 pl-4 pt-4">
                      <span className="absolute top-0 left-4 text-gray-300 text-6xl font-serif select-none opacity-50">"</span>
                      <p className="text-gray-700 text-base leading-relaxed mt-4">
                        {feedback.message}
                        <span className="absolute bottom-0 right-0 text-gray-300 text-6xl font-serif select-none opacity-50">"</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No feedbacks available yet. Be the first to share your thoughts!
          </div>
        )}
      </section>

      {/* General Feedback Modal */}
      {showGeneralFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Submit Your Feedback
              </h3>
              <button
                onClick={() => setShowGeneralFeedbackModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmitGeneralFeedback} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={generalFeedbackForm.name}
                  onChange={(e) =>
                    setGeneralFeedbackForm({
                      ...generalFeedbackForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number (Optional)
                </label>
                <div className="flex rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <select
                    value={selectedCountryCode}
                    onChange={e => setSelectedCountryCode(e.target.value)}
                    className="px-3 py-2 bg-gray-50 text-gray-700 border-none focus:ring-0"
                  >
                    {countryCodes.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="email"
                    minLength={10}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="flex-1 px-3 py-2 border-none focus:ring-0"
                    value={generalFeedbackForm.email}
                    onChange={e => {
                      // Only allow numbers
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setGeneralFeedbackForm({
                        ...generalFeedbackForm,
                        email: val,
                      });
                    }}
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="artisanName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Artisan Name (Optional)
                </label>
                <input
                  type="text"
                  id="artisanName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={generalFeedbackForm.artisanName}
                  onChange={(e) =>
                    setGeneralFeedbackForm({
                      ...generalFeedbackForm,
                      artisanName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="feedback"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Feedback *
                </label>
                <textarea
                  id="feedback"
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={generalFeedbackForm.feedback}
                  onChange={(e) =>
                    setGeneralFeedbackForm({
                      ...generalFeedbackForm,
                      feedback: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGeneralFeedbackModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtisanDatabase;