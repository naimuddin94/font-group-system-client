import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold">Zepto Font</div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="text-white hover:bg-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>

          {/* Desktop Navbar Links */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
            <a href="/fonts" className="text-white hover:text-gray-300">
              Fonts
            </a>
            <a href="/groups" className="text-white hover:text-gray-300">
              Groups
            </a>
            <a href="/settings" className="text-white hover:text-gray-300">
              Settings
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Framer Motion animation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Start slightly above and transparent
          animate={{ opacity: 1, y: 0 }} // Animate to visible and on position
          exit={{ opacity: 0, y: -20 }} // Exit with slight slide up and fade out
          transition={{ duration: 0.3 }} // Set the animation duration
          className="md:hidden bg-slate-600 space-y-1 px-2 pt-2 pb-3"
        >
          <a
            href="/"
            className="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="/fonts"
            className="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Fonts
          </a>
          <a
            href="/groups"
            className="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Groups
          </a>
          <a
            href="/settings"
            className="text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Settings
          </a>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
