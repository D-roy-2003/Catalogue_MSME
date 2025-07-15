import React from "react";

function HistorySection() {
  return (
    <section
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16"
      aria-labelledby="history-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="history-heading"
          className="text-3xl sm:text-3xl font-bold text-center text-gray-900 relative mb-10"
        >
          History & Heritage
          <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-1 bg-blue-600 rounded-full"></span>
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start justify-between">
          {/* Text Section */}
          <div className="w-full md:w-3/5">
            <article className="text-gray-600">
              <p className="text-base lg:text-lg mb-6 leading-relaxed">
               In India, use of silver filigree/ jewellery has been very popular 
               within a certain class of people who can't afford to pay price of 
               gold for similar items. Silver filigree manufacturing activities 
               started few hundred years ago in various villages of Cuttack district of Orissa. 
               This beautiful art of manufacturing handicrafts was brought from Cuttack to villages of 
               Magrahat II Block in our state, almost 65 years back.
              </p>
              <p className="text-base lg:text-lg leading-relaxed">
                Although the first activity of silver filigree started at villages of Moukhali and Alida, 
                subsequently it has spread over to sixteen surrounding villages of Magrahat II block within 
                the last 65 years. The artisans of this locality have been famous all over India for the 
                quality and intricacy of their silver filigree items and the industry grew to a few thousand artisans. 
              </p>
            </article>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-2/5">
            <div className="aspect-square max-w-sm mx-auto md:mx-0">
              <img
                src="/fire1.jpg"
                alt="Historical artifacts from Magrahat"
                className="w-full h-full rounded-lg shadow-lg object-cover transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HistorySection;
