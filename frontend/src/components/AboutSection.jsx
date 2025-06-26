function AboutSection() {
  return (
    <section
      className="flex flex-col items-center justify-center px-8 py-16 bg-zinc-100 overflow-hidden w-full max-md:px-4 max-md:py-10"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-4xl font-bold text-center text-black mb-12 max-md:text-3xl"
      >
        About Magrahat Silver Filigree
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-10 max-w-7xl w-full md:flex-nowrap">
        {/* Text Content (Left) */}
        <div className="w-full md:w-1/2 px-4">
          <article className="text-lg leading-relaxed text-gray-700">
            <p className="mb-6">
              <span className="font-semibold text-black">
                Magrahat Silver Filigree
              </span>{" "}
              is more than just a craft—it is a living tradition perfected over
              generations. Rooted in a rich cultural heritage, this art form
              represents the fusion of delicate precision and enduring beauty.
            </p>
            <p>
              Our artisans blend traditional techniques with a passion for
              innovation, ensuring every creation honors time-honored methods
              while resonating with modern aesthetics. Discover intricate
              designs that reflect timeless stories and contemporary artistry in
              every piece.
            </p>
          </article>
        </div>

        {/* Image (Right) */}
        <div className="flex justify-center w-full md:w-1/2">
          <video
            src="magrahat_video.mp4"
            alt="Silver filigree craftsmanship"
            className="w-full max-w-md rounded-3xl object-cover shadow-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
            loop
            autoPlay
            muted
          />
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
