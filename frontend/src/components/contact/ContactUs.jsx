import { useState } from "react";
import Swal from "sweetalert2";
import { FaSpinner, FaPhone, FaUser, FaEnvelope, FaHandsHelping } from "react-icons/fa";
import AnimatedPage from "../AnimatedPage";

// Country codes for dropdown
const countryCodes = [
  { code: '+1', name: 'US', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+91', name: 'IN', flag: '🇮🇳' },
  { code: '+33', name: 'FR', flag: '🇫🇷' },
  { code: '+49', name: 'DE', flag: '🇩🇪' },
  { code: '+81', name: 'JP', flag: '🇯🇵' },
  { code: '+86', name: 'CN', flag: '🇨🇳' },
  { code: '+234', name: 'NG', flag: '🇳🇬' },
  { code: '+27', name: 'ZA', flag: '🇿🇦' },
  { code: '+20', name: 'EG', flag: '🇪🇬' },
  // Add more country codes as needed
];

function ContactUs() {
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setIsContactSubmitting(true);

    const formData = new FormData(event.target);

    // Trim and validate fields manually
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const artisanName = formData.get("artisanName")?.trim();
    const message = formData.get("message")?.trim();
    const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;

    if (!name || !email || !artisanName || !message || !phoneNumber) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill out all fields properly.",
      });
      setIsContactSubmitting(false);
      return;
    }

    // Add phone number to form data
    formData.append("phone", fullPhoneNumber);

    const email_key = import.meta.env.VITE_EMAIL_KEY;
    formData.append("access_key", email_key);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        Swal.fire({
          title: "Message Sent!",
          text: "We'll get back to you soon!",
          icon: "success",
        });
        event.target.reset();
        setPhoneNumber('');
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Artisans</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reach out to your favorite artisans directly. We'll make sure your message gets delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                Send a Message
              </h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaHandsHelping className="text-blue-500" />
                      Artisan Name
                    </label>
                    <input
                      type="text"
                      name="artisanName"
                      placeholder="Who are you contacting?"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaPhone className="text-blue-500" />
                      Phone Number
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        className="px-3 py-3 bg-gray-50 text-gray-700 border-none focus:ring-0"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="123 456 7890"
                        required
                        className="flex-1 px-4 py-3 border-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Write your message here..."
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 transition-all"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isContactSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isContactSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium text-blue-100">Why contact through us?</h3>
                  <p className="mt-1 text-blue-50">
                    We ensure your message reaches the artisan directly while maintaining your privacy.
                  </p>
                </div>

                <div className="border-t border-blue-400 pt-5">
                  <h3 className="font-medium text-blue-100">Typical Response Time</h3>
                  <p className="mt-1 text-blue-50">
                    Most artisans respond within 24-48 hours. If urgent, include that in your message.
                  </p>
                </div>

                <div className="border-t border-blue-400 pt-5">
                  <h3 className="font-medium text-blue-100">What to Include</h3>
                  <ul className="mt-1 text-blue-50 list-disc list-inside space-y-1">
                    <li>Clear description of your request</li>
                    <li>Any relevant deadlines</li>
                    <li>Preferred contact method</li>
                    <li>Budget range if applicable</li>
                  </ul>
                </div>

                <div className="border-t border-blue-400 pt-5">
                  <h3 className="font-medium text-blue-100">Need Immediate Help?</h3>
                  <p className="mt-1 text-blue-50">
                    Call our support line at <span className="font-semibold">+91-6294769382</span> for urgent inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default ContactUs;