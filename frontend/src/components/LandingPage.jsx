"use client";
import AboutSection from "./AboutSection";
import ProductsSection from "./ProductsSection";
import ContactSection from "./ContactSection";
import TeamSection from "./TeamSection";
import AnimatedPage from "./AnimatedPage";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

function LandingPage() {
  // Carousel state for testimonials
  const testimonials = [
    {
      name: "Rajatava",
      text:
        "A Very Fun Experience at the Best Water Park in Kolkata. This Theme Park, Wet-O-Wild, has awesome rides, awesome music and an awesome ambiance of fun.",
    },
    {
      name: "Prosenjit Saha",
      text:
        "A day out in the water park is very much worthy. All the rides were awesome. It's a peak time so rush is there. Pls note get a locker booked before entering to the wet world.",
    },
    {
      name: "Mowsumi Dutta",
      text:
        "Nice but need more quick service. you need to stay in queue for 20-25 minutes for a ride even on weekdays. On holiday, you cannot ride all, you have to wait for 1 hr too.",
    },
  ];
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const handlePrev = () => {
    setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatedPage>
      <main className="flex flex-col overflow-x-hidden bg-white">
        {/* Hero Section */}
        <section
          className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets/TEMP/8b2cd4d8230ec436778f1c4599ca00505db2f958?placeholderIfAbsent=true')",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold leading-tight max-w-3xl mx-auto text-white md:text-5xl lg:text-6xl">
              Embrace the Timeless Beauty of Silver
            </h1>
            <p className="text-xl font-light text-white md:text-2xl lg:text-3xl">
              Uncover Handcrafted Brilliance
            </p>
            <Link
              to="/about"
              className="mt-6 inline-block px-6 py-3 text-lg font-semibold text-black bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-300 transition duration-300"
            >
              Explore Now
            </Link>
          </div>
        </section>

        {/* Content Sections */}
        <div className="space-y-8 md:space-y-10">
          {/* About Section */}
          <section className="px-6 md:px-10 pt-8 md:pt-10">
            <AboutSection />
          </section>

          {/* Products Section */}
          <section className="px-6 md:px-10 bg-gray-50 py-8 md:py-10">
            <ProductsSection />
          </section>

          {/* Testimonials Section */}
          <section className="bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Testimonials</h2>
              <p className="mt-2 text-xl text-blue-700">What our Mentors are saying</p>
              {/* Mobile Carousel */}
              <div className="mt-10 relative flex items-center justify-center md:hidden">
                <button
                  className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div
                  className="flex space-x-6 overflow-hidden w-full justify-center"
                  style={{ maxWidth: 340 }}
                >
                  <div className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg p-6 mx-auto transition-all duration-300">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-700"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonials[testimonialIndex].name}</h3>
                      <div className="relative w-full mt-4">
                        <span className="absolute -top-2 -left-2 text-4xl text-gray-200 select-none">&#8220;</span>
                        <p className="text-gray-700 leading-relaxed">{testimonials[testimonialIndex].text}</p>
                        <span className="absolute -bottom-2 -right-2 text-4xl text-gray-200 select-none">&#8221;</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              {/* Dots for mobile navigation */}
              <div className="flex justify-center mt-4 gap-2 md:gap-3 md:hidden">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full ${testimonialIndex === idx ? 'bg-blue-700' : 'bg-gray-400'} focus:outline-none`}
                    onClick={() => setTestimonialIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              {/* Desktop: Show all testimonials side by side, no arrows/dots */}
              <div className="hidden md:flex md:space-x-8 md:justify-center mt-10">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-700"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <div className="relative w-full mt-4">
                        <span className="absolute -top-2 -left-2 text-4xl text-gray-200 select-none">&#8220;</span>
                        <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
                        <span className="absolute -bottom-2 -right-2 text-4xl text-gray-200 select-none">&#8221;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="px-6 md:px-10 pt-4 pb-8 md:pt-6 md:pb-10">
            <ContactSection />
          </section>

          {/* Team Section */}
          <section className="px-6 md:px-10 pt-6 pb-12 md:pt-8 md:pb-14">
            <TeamSection />
          </section>
        </div>
      </main>
    </AnimatedPage>
  );
}

export default LandingPage;
