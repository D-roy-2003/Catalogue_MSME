import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6"; // Using stylish icons

function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-white px-8 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Magrahat Filigree
          </h3>
          <p className="text-neutral-400 leading-relaxed">
            Preserving the art of silver filigree craftsmanship.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-neutral-400">
            <li>
              <a
                href="about"
                className="hover:text-white transition-colors duration-200"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="product"
                className="hover:text-white transition-colors duration-200"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="artisandb"
                className="hover:text-white transition-colors duration-200"
              >
                Artisans
              </a>
            </li>
            <li>
              <a
                href="contact"
                className="hover:text-white transition-colors duration-200"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
          <address className="not-italic text-neutral-400 space-y-3">
            <p>
              Email:{" "}
              <a
                href="mailto:info@magrahatfiligree.com"
                className="hover:text-white transition-colors duration-200"
              >
                info@magrahatfiligree.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+916294769382"
                className="hover:text-white transition-colors duration-200"
              >
                +91 6294769382
              </a>
            </p>
            <p>Address: Magrahat, South 24 Parganas, West Bengal</p>
          </address>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-6 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors duration-300 text-2xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors duration-300 text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors duration-300 text-2xl"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      {/* Footer Bottom */}
<div className="mt-16 border-t border-neutral-700 pt-6 text-center text-neutral-400 text-sm">
  <h4 className="font-semibold text-white mb-2">Developer Team</h4>
  <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-2">
    <a
      href="https://www.linkedin.com/in/subhobrata-maity-260b16259/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white"
    >
      Subhobrata Maity
    </a>
    <span className="text-neutral-500">•</span>
    <a
      href="https://www.linkedin.com/in/gaurav-majumder-2484a1356/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white"
    >
      Gourav Majumder
    </a>
    <span className="text-neutral-500">•</span>
    <a
      href="https://www.linkedin.com/in/prem-ghosh-181414255"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white"
    >
      Prem Ghosh
    </a>
    <span className="text-neutral-500">•</span>
    <a
      href="https://www.linkedin.com/in/prasenjit-datta/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white"
    >
      Prasenjit Datta
    </a>
    <span className="text-neutral-500">•</span>
    <a
      href="https://www.linkedin.com/in/debangshu-roy-5531b8272/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white"
    >
      Debangshu Roy
    </a>
  </div>
  <p className="text-neutral-500 mt-2">
    © 2025 Magrahat E-catalogue. All Rights Reserved.
  </p>
</div>
    </footer>
  );
}

export default Footer;
