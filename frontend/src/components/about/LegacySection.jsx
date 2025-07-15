import React from "react";

function LegacySection() {
  return (
    <section
      className="w-full px-4 py-16 md:px-10 lg:px-20 bg-white"
      aria-labelledby="legacy-heading"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="legacy-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-10 relative"
        >
          Role of CFC
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 md:w-24 h-1 bg-blue-600 rounded-full"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text section */}
          <div>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              The CFC will play a very important role in overall economic development of this cluster as economy of these sixteen villages has been largely dependant on Silver Filigree. Once with the valuable support from the CFC the stakeholder-members of the SPV start growing economically, non-member artisans will became member to be a part of this economic growth process. Consequently skilled people, 
              who have been forced to switch over to lower skilled profession, will get interested to come back to this industry.
            </p>
          </div>

          {/* Image section */}
          <div>
            <img
              src="/cfc1.jpg"
              alt="Artisan using digital tools"
              className="w-full h-auto rounded-2xl shadow-lg transform hover:-translate-y-1 transition duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LegacySection;
