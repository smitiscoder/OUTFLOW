// In src/pages/Onboarding/Footer.jsx
import React from "react";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const Footer = () => {
  return (
    <footer className="bg-outflow-black text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-16">
      <style>
        {`
          .hover-underline {
            position: relative;
            color: inherit;
            text-decoration: none;
          }
          .hover-underline::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0%;
            height: 1px;
            background-color: white;
            transition: width 0.3s ease-in-out;
          }
          .hover-underline:hover::after {
            width: 100%;
          }
        `}
      </style>

      <div className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* About Outflow Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">About Outflow</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
            Designed for today’s finances. Fast, simple, and built for real life.
          </p>
          <div className="flex space-x-3 sm:space-x-4 text-gray-400">
            <a
              href="https://x.com/Smittnerurkar?t=yGtjW90Pd3HeYy2AuRp7xA&s=09"
              aria-label="Follow Outflow on Twitter"
              title="Outflow Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://www.linkedin.com/posts/smitnerurkar_outflowapp-fromprojecttoproduct-pwa-activity-7330958939418750976-w9Dm?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFX7XlYB8opadZH7-F38-SMlBUwC6RbBdKU"
              aria-label="Connect with Outflow on LinkedIn"
              title="Outflow LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://www.instagram.com/smitnerurkar?igsh=MTk1OTUwaDB6aW5zdQ=="
              aria-label="Follow Outflow on Instagram"
              title="Outflow Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link
                to={ROUTES.CONTACT}
                className="text-xs sm:text-sm md:text-base hover:text-white hover-underline transition-colors"
                aria-label="Go to Contact Us Page"
                title="Contact Outflow"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.USER_MANUAL}
                className="text-xs sm:text-sm md:text-base hover:text-white hover-underline transition-colors"
                aria-label="View User Manual"
                title="User Manual"
              >
                User Manual
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ABOUT_US}
                className="text-xs sm:text-sm md:text-base hover:text-white hover-underline transition-colors"
                aria-label="Learn About Us"
                title="About Us"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.PRIVACY}
                className="text-xs sm:text-sm md:text-base hover:text-white hover-underline transition-colors"
                aria-label="View Privacy Policy"
                title="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.TERMS}
                className="text-xs sm:text-sm md:text-base hover:text-white hover-underline transition-colors"
                aria-label="View Terms of Service"
                title="Terms of Service"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

