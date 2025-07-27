import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'About', href: ROUTES.ABOUT },
    { name: 'Services', href: ROUTES.SERVICES },
    { name: 'Articles', href: ROUTES.ARTICLES },
    { name: 'Events', href: ROUTES.EVENTS },
    { name: 'Contact', href: ROUTES.CONTACT },
  ];

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={ROUTES.HOME} className="flex items-center">
              <img 
                className="h-8 w-auto" 
                src="/logo.png" 
                alt="Company Logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span 
                className="ml-2 text-xl font-bold text-gray-900 hidden"
                style={{ display: 'none' }}
              >
                Company
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActiveLink(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to={ROUTES.LOGIN}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={!isMenuOpen ? 'block' : 'hidden'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={isMenuOpen ? 'block' : 'hidden'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActiveLink(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2 space-y-2">
              <Link
                to={ROUTES.LOGIN}
                className="block w-full text-center px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="block w-full text-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export { Header };
