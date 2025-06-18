import React from 'react'

function Footer() {
  return (
    <div className="bg-pinko text-white py-6 text-center text-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <a href="#" className="mr-4 hover:underline">Terms of Service</a>
            <a href="#" className="mr-4 hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
          <p className="mt-2 sm:mt-0">&copy; 2025 StayFreight. All rights reserved.</p>
        </div>
      </div>
  )
}

export default Footer