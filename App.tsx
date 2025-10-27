
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ModelComparison from './components/ModelComparison';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 sm:p-6 md:p-8">
        {currentPage === 'dashboard' ? <Dashboard /> : <ModelComparison />}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>CrediLink &copy; 2024. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
