import React from "react";

function ArtSection() {
  return (
    <section
      className="bg-gradient-to-tr from-gray-50 via-gray-100 to-blue-50 py-8 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="art-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="inline-block bg-blue-100 rounded-full px-3 py-1 mb-3 sm:mb-4">
            <span className="text-blue-700 font-medium text-xs sm:text-sm">
              Heritage Craft
            </span>
          </div>
          <h2
            id="art-heading"
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 relative"
          >
            The Art of Silver Filigree
            <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-1 bg-blue-600 rounded-full"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
              src="/necklace1.jpg"
              alt="Silver filigree artwork sample"
              className="w-full h-full object-cover aspect-square transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Exquisite Craftsmanship
              </h3>
              <p className="text-xs sm:text-sm text-blue-100">
                Handcrafted with precision and artistic flair
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
              src="/earrings1.jpg"
              alt="Silver filigree crafting process"
              className="w-full h-full object-cover aspect-square transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Meticulous Process
              </h3>
              <p className="text-xs sm:text-sm text-blue-100">
                Every piece requires hours of dedicated work
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl sm:col-span-2 md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
              src="/necklace2.jpg"
              alt="Detailed silver filigree design"
              className="w-full h-full object-cover aspect-square transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Intricate Patterns
              </h3>
              <p className="text-xs sm:text-sm text-blue-100">
                Designs inspired by centuries of tradition
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-lg max-w-3xl mx-auto border-l-4 border-blue-500 relative">
          <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed ml-1 sm:ml-2">
            The intricate art of silver filigree in Magrahat involves delicate
            manipulation of fine silver threads to create stunning pieces of
            jewelry and decorative items. This centuries-old technique requires
            immense patience, skill, and artistic vision.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ArtSection;
