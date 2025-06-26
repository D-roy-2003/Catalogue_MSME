"use client";
import React from "react";
import { motion } from "framer-motion";

function ExploreHero() {
  return (
    <section
      className="relative w-full h-screen bg-black overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Video */}
      <video
        src="/magrahat_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Hero Text with Animation */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-6 md:px-20">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-white"
        >
          Discovering Magrahat
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 text-lg md:text-2xl text-neutral-200 max-w-2xl"
        >
          A journey through time, tradition, and the artistry of silver filigree
          in West Bengal's cultural heartland.
        </motion.p>
      </div>
    </section>
  );
}

export default ExploreHero;
