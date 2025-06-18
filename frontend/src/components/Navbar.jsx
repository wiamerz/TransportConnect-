import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#5E3A3A] px-6 py-3 shadow-sm flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-bold text-lg">StayFreight</span>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-6">
        <a href="#about" className="text-white hover:text-[#D8A7B1] font-medium transition">
          About
        </a>
        <a href="#contact" className="text-white hover:text-[#D8A7B1] font-medium transition">
          Contact
        </a>
        <button className="bg-white text-[#5E3A3A] px-4 py-1.5 rounded-md shadow-sm hover:bg-[#D8A7B1] hover:text-white transition">
          Log in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
