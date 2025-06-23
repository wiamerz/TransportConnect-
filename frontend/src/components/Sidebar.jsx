import React, { useState } from 'react';
import { Home, Tag, MessageSquare, Package, History, User, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/ConducteurDashbord' },
    { id: 'annonces', icon: Tag, label: 'Annonces', href: '/annonces' },
    { id: 'evaluation', icon: MessageSquare, label: 'Evaluation', href: '/evaluation' },
    { id: 'demandes', icon: Package, label: 'Demandes', href: '/demandes' },
    { id: 'history', icon: History, label: 'History', href: '/historique' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 h-screen flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          shadow-lg
        `}
        style={{ backgroundColor: '#FAF9F6' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">StayFreight</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(({ id, icon: Icon, label, href }) => (
              <li key={id}>
                <a
                  href={href}
                  onClick={() => handleItemClick(id)}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-lg transition-colors
                    ${activeItem === id ? 'bg-[#5E3A3A] text-white' : 'text-gray-600 hover:bg-[#D8A7B1] hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-gray-200">
          <a
            href="/profile"
            onClick={() => handleItemClick('profile')}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg transition-colors
              ${activeItem === 'profile' ? 'bg-[#5E3A3A] text-white' : 'text-gray-600 hover:bg-[#D8A7B1] hover:text-white'}
            `}
          >
            <User className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">Profile</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
