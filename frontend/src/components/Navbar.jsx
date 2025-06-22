import React from 'react';


const Navbar = () => {

  return (
    <nav className="bg-pinko px-6 py-3 shadow-sm flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-white font-bold text-lg">StayFreight</span>
      </div>

      <div className="flex items-center space-x-6">
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
    </nav>
  );
};

export default Navbar;
