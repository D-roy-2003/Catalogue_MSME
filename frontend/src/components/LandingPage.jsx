"use client";
import AboutSection from "./AboutSection";
import ProductsSection from "./ProductsSection";
import ContactSection from "./ContactSection";
import AnimatedPage from "./AnimatedPage";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

function LandingPage() {
  // Remove testimonials state and handlers

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

          {/* Contact Section */}
          <section className="px-6 md:px-10 pt-4 pb-8 md:pt-6 md:pb-10">
            <ContactSection />
          </section>
        </div>
      </main>
    </AnimatedPage>
  );
}

export default LandingPage;
