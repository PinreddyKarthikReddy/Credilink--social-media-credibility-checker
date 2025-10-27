
import React, { useState } from 'react';
import { DashboardMode } from '../types';
import UrlChecker from './UrlChecker';
import ManualInputForm from './ManualInputForm';
import DatasetTester from './DatasetTester';

const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<DashboardMode>('url');

  const renderContent = () => {
    switch (mode) {
      case 'url':
        return <UrlChecker />;
      case 'manual':
        return <ManualInputForm />;
      case 'dataset':
        return <DatasetTester />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{
    targetMode: DashboardMode;
    icon: string;
    label: string;
  }> = ({ targetMode, icon, label }) => (
    <button
      onClick={() => setMode(targetMode)}
      className={`flex-1 p-3 sm:p-4 text-center font-semibold rounded-t-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
        mode === targetMode
          ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <i className={`fas ${icon}`}></i>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto">
      <div className="flex w-full mb-6 rounded-lg overflow-hidden shadow-lg">
        <TabButton targetMode="url" icon="fa-link" label="URL Profile Check" />
        <TabButton targetMode="manual" icon="fa-edit" label="Manual Input" />
        <TabButton targetMode="dataset" icon="fa-file-csv" label="Dataset Testing" />
      </div>
      <div className="bg-gray-800 p-4 sm:p-6 rounded-b-lg rounded-tr-lg shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
