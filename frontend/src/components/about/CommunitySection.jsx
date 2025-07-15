import React from "react";

function CommunitySection() {
  return (
    <section
      className="px-4 py-16 md:px-10 lg:px-20 bg-white w-full"
      aria-labelledby="community-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="inline-block bg-blue-100 rounded-full px-3 py-1 mb-3 sm:mb-4">
            <span className="text-blue-700 font-medium text-xs sm:text-sm">
              Community
            </span>
          </div>
          <h2
            id="art-heading"
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 relative"
          >
            People & Community
            <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-1 bg-blue-600 rounded-full"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card 1 */}
          <article className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
            <img
              src="/artisan1.jpg"
              alt="Artisan working on silver filigree"
              className="rounded-xl w-full aspect-square object-cover transform group-hover:-translate-y-1 transition duration-300"
            />
            <h3 className="mt-6 text-2xl font-semibold text-gray-800">
              The Artisan's Journey
            </h3>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              The first activity of silver filigree started at villages of Moukhali and Alida, subsequently it has spread over to sixteen surrounding villages of Magrahat II block within the last 65 years .
            </p>
          </article>

          {/* Card 2 */}
          <article className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
            <img
              src="/artisan2.jpg"
              alt="Master artisan teaching apprentice"
              className="rounded-xl w-full aspect-square object-cover transform group-hover:-translate-y-1 transition duration-300"
            />
            <h3 className="mt-6 text-2xl font-semibold text-gray-800">
              Passing the Torch
            </h3>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              The community of Magrahat takes pride in nurturing the next
              generation of artisans, ensuring this precious art form continues
              to thrive and evolve.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CommunitySection;
