import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import pic from '../assets/transport.jpg';
import pic1 from '../assets/trans.jpg';
import pic2 from '../assets/trs.jpg';
import pic3 from '../assets/merc.jpg';
import pic4 from '../assets/sent.jpg';
import pic5 from '../assets/send.jpg';
import pic6 from '../assets/sender.jpg';
import { Truck, MapPin, DollarSign } from 'lucide-react';
import Sidebar from './Sidebar';

const HomePage = () => {
  return (
    <>
    {/* <Navbar/> */}
    <Sidebar/>
    <div className="bg-white text-white font-sans">

      {/* Header Section */}
      <header  style={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover', backgroundPosition: 'center',}} className=" py-12 px-6 text-center shadow-md">
        <div  className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
            Find the perfect load for your truck
          </h1>
          <p className="text-white mb-6">
            StayFreight simplifies load sourcing, booking, and delivery with real-time access to shipments.
          </p>
          {/* <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for loads"
              className="px-4 py-2 bg-white border text-gray-500 border-gray-300 rounded-l-md focus:outline-none"
            />
            <button className="bg-primary bg-ghos text-gray-500 px-6 py-2 rounded-r-md hover:bg-accent transition">
              Search
            </button>
          </div> */}
        </div>
      </header>

      {/* How it works */}
    <section id='How' className="py-12 px-6 bg-primary/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-black text-accent mb-8">
          How StayFreight Works
        </h2>
        <p className="text-gray-600 mb-8">
          Our platform simplifies the process of finding and booking loads, ensuring a smooth and 
          efficient experience for both drivers and senders.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-pinko-10 text-black rounded-xl shadow-md overflow-hidden">
            <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-accent mb-2">Find Loads</h3>
              <p className="text-gray-600">Browse available loads based on your location, truck type, and preferred routes.</p>
            </div>
          </div>

          <div className="bg-pinko-10 text-black rounded-xl shadow-md overflow-hidden">
            <div className="w-full h-40 bg-green-100 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-accent mb-2">Book & Deliver</h3>
              <p className="text-gray-600">Securely book your chosen load and complete the delivery according to the agreed terms.</p>
            </div>
          </div>

          <div className="bg-pinko-10 text-black rounded-xl shadow-md overflow-hidden">
            <div className="w-full h-40 bg-yellow-100 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-accent mb-2">Get Paid</h3>
              <p className="text-gray-600">Receive prompt and secure payments upon successful delivery, with transparent transaction details.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Benefits for Drivers */}
      <section className="py-12 px-6 bg-primary/10 bg-rose-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold  text-black text-accent mb-8">Benefits for Drivers</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-pinko-10 text-black rounded-xl shadow-md overflow-hidden">
              <img src={pic1} alt="Maximize Earnings" className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-accent mb-2">Maximize Earnings</h3>
                <p className="text-gray-600">Access to high-paying loads with quick payouts.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-pinko-10 text-black rounded-xl shadow-md overflow-hidden">
              <img src={pic2} alt="Flexible Scheduling" className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-accent mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">Choose the jobs that work for your timeline.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-pinko-10 text-black rounded-xl shadow-md overflow-hidden">
              <img src={pic3} alt="Reliable Payments" className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-accent  mb-2">Reliable Payments</h3>
                <p className="text-gray-600">No delays—get paid on time every time.</p>
              </div>
            </div>

          </div>
        </div>
     </section>


      {/* Benefits for Senders */}
      <section  className="py-12 text-black px-6"> 
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-accent mb-8">Benefits for Senders</h2>
            <div className="grid sm:grid-cols-3 gap-6">

              {/* Card 1 */}
              <div className="bg-pinko-10 rounded-xl shadow-md overflow-hidden">
                <img src={pic4} alt="Wide Network of Drivers" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-accent mb-2">Wide Network of Drivers</h3>
                  <p className="text-gray-600">Reach verified, professional drivers nationwide.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-pinko-10 rounded-xl shadow-md overflow-hidden">
                <img src={pic5} alt="Competitive Pricing" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-accent mb-2">Competitive Pricing</h3>
                  <p className="text-gray-600">Get the best rates with transparent fees.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-pinko-10 rounded-xl shadow-md overflow-hidden">
                <img src={pic6} alt="Real-Time Tracking" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-accent mb-2">Real-Time Tracking</h3>
                  <p className="text-gray-600">Track every shipment from pickup to drop-off.</p>
                </div>
              </div>

            </div>
          </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-6 bg-accent bg-rose-50 text-black text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Join StayFreight now to streamline your logistics and connect with shippers and carriers.</p>
        <a href="/registre">
        <button className="bg-ghos text-accent font-semibold px-6 py-2 rounded hover:bg-primary hover:bg-pinko  hover:text-white transition">
          Get Started
        </button>
        </a>
      </section>

  
    </div>
    <Footer/>
    </>
  );
};


export default HomePage;
