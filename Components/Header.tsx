
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const NavButton: React.FC<{ page: Page; label: string }> = ({ page, label }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <i className="fas fa-shield-alt text-blue-400 text-2xl"></i>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">CrediLink</h1>
        </div>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <NavButton page="dashboard" label="Dashboard" />
          <NavButton page="comparison" label="Model Comparison" />
        </nav>
      </div>
    </header>
  );
};

export default Header;
