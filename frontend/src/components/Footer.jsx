import React from 'react';

function Footer() {
  return (
    <footer className="bg-pinko text-white py-6 text-center text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center flex-wrap gap-2">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
        <p className="mt-2 sm:mt-0">&copy; 2025 StayFreight. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
