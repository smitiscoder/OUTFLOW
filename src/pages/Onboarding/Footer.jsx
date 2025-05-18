import React from "react";
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-16">
      {/* Animated underline style */}
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About Outflow</h3>
          <p className="text-gray-400 mb-4">
            Modern tools for modern development workflows. Built with
            performance and usability in mind.
          </p>
          <div className="flex space-x-4 text-gray-400">
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaLinkedin className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaFacebook className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 pl-0">
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Legal
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-400 pl-0">
            <li>
              <a href="#" className="hover:text-white hover-underline">
                User Manual
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                API Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Tutorials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white hover-underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Stay Updated */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter for the latest updates.
          </p>
          <form className="flex flex-col sm:flex-row w-full max-w-sm">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 w-full bg-black text-white border border-white placeholder-gray-400 rounded-t-md sm:rounded-l-md sm:rounded-t-none focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded-b-md sm:rounded-r-md sm:rounded-b-none font-semibold hover:bg-gray-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm gap-4">
        <p>© 2025 Outflow. All rights reserved.</p>
        <div className="flex flex-wrap justify-center md:justify-end space-x-6">
          <a href="#" className="hover:text-white hover-underline">
            Status
          </a>
          <a href="#" className="hover:text-white hover-underline">
            Support
          </a>
          <a href="#" className="hover:text-white hover-underline">
            Changelog
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
