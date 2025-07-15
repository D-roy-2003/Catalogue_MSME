function ContactSection() {
  return (
    <section
      className="w-full bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 py-12"
      aria-labelledby="contact-section"
    >
      <div className="w-full px-15">
        <h2
          id="contact-section"
          className="text-4xl font-bold text-center text-black mb-10 max-md:text-3xl"
        >
          Contact Us
        </h2>

        <div className="flex flex-col md:flex-row gap-20">
          {/* Left side - Contact Information */}
          <div className="md:w-2/5 bg-white p-6 rounded-lg shadow-md md:border-r md:border-gray-300">
            <h3 className="text-3xl font-bold  text-gray-800 mb-4">
              Get in Touch
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-1xl text-gray-700">
                  Workshop Address:
                </h4>
                <p className="text-gray-600 text-1xl">
                  Magrahat, South 24 Parganas, West Bengal, India
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 text-1xl">Phone:</h4>
                <p className="text-gray-600 text-1xl">+91 6294769382</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 text-1xl">Email:</h4>
                <p className="text-gray-600 text-1xl">
                  contact@magrahatfiligree.com
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 text-1xl">
                  Working Hours:
                </h4>
                <p className="text-gray-600 text-1xl">
                  Tuesday - Sunday: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            {/* <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Follow Us:</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-pink-600 hover:text-pink-800">
                  <span className="sr-only">Facebook</span>
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-800">
                  <span className="sr-only">Instagram</span>
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-800">
                  <span className="sr-only">Twitter</span>
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              </div>
            </div> */}
          </div>

          {/* Right side - Map */}
          <div className="md:w-3/5">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <iframe
                title="Magrahat Filigree Workshop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d993.0597661512602!2d88.3716384389883!3d22.312545093517123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a026925491108ad%3A0xd304b6df45c7a6b0!2sMoukhali%20Shiv%20Mandir!5e1!3m2!1sen!2sin!4v1747478954449!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                aria-label="Magrahat Filigree Workshop Location"
              />
            </div>
            <div className="mt-2 text-center text-gray-700">
              <p className="font-medium">Magrahat, West Bengal, India</p>
              {/* <p className="mt-1">Visit us at our workshop!</p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
