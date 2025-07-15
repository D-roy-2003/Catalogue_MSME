import React from "react";

function ImpactSection() {
  return (
    <section
      className="bg-gradient-to-br from-gray-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="impact-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-block bg-indigo-100 rounded-full px-3 py-1 mb-4">
            <span className="text-indigo-600 font-medium text-sm">
              Our Growth Story
            </span>
          </div>
          <h2
            id="impact-heading"
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 relative"
          >
            Economic & Social Impact
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-indigo-500 rounded-full"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-8 border-t-4 border-indigo-500 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-indigo-100 opacity-50"></div>
            <div className="relative z-10">
              <div className="text-5xl font-bold text-indigo-600 mb-4">
                1500+
              </div>
              <p className="text-gray-700 font-medium text-lg">
                Active Artisans
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Supporting local communities and preserving traditions
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-8 border-t-4 border-purple-500 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-purple-100 opacity-50"></div>
            <div className="relative z-10">
              <div className="text-5xl font-bold text-purple-600 mb-4">
                ₹11Cr
              </div>
              <p className="text-gray-700 font-medium text-lg">
                Annual Revenue
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Generating sustainable economic value
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-8 border-t-4 border-blue-500 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-100 opacity-50"></div>
            <div className="relative z-10">
              <div className="text-5xl font-bold text-blue-600 mb-4">410</div>
              <p className="text-gray-700 font-medium text-lg">Stakeholders</p>
              <p className="text-gray-500 text-sm mt-2">
                Consistent expansion year after year
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto border-l-4 border-indigo-500">
          <p className="text-gray-700 text-base leading-relaxed italic">
            "The silver filigree industry continues to be a significant
            contributor to Magrahat's economy, providing employment and
            preserving cultural heritage while adapting to modern market
            demands.The present market share of these artisans is approximately 1.5 % of the total Indian silver filigree market."
          </p>
        </div>
      </div>
    </section>
  );
}

export default ImpactSection;
