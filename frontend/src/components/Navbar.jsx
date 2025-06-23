import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-pinko px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-lg">StayFreight</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-white hover:text-ghos font-medium transition">
            About
          </a>
          <a href="#How" className="text-white hover:text-ghos font-medium transition">
            How it works
          </a>
          <a href="/login">
            <button className="bg-white text-pinko px-4 py-1.5 rounded-md shadow-sm hover:bg-ghos hover:text-white transition">
              Log in
            </button>
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-6 flex flex-col space-y-3 text-white">
          <a href="#about" className="hover:text-ghos" onClick={toggleMenu}>
            About
          </a>
          <a href="#How" className="hover:text-ghos" onClick={toggleMenu}>
            How it works
          </a>
          <a href="/login" onClick={toggleMenu}>
            <button className="bg-white text-pinko px-4 py-2 rounded-md shadow-sm hover:bg-ghos hover:text-white transition w-full text-left">
              Log in
            </button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
