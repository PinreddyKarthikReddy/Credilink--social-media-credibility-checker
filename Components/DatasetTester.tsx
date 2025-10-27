
import React, { useState } from 'react';
import { ModelType, TestResults } from '../types';
import { testDataset } from '../services/mlService';

const ConfusionMatrix: React.FC<{ matrix: TestResults['confusionMatrix'] }> = ({ matrix }) => (
    <div className="grid grid-cols-2 gap-px bg-gray-600 rounded-lg overflow-hidden text-center text-sm">
        <div className="bg-gray-800 p-2 text-gray-400 font-semibold col-span-2">Confusion Matrix</div>
        <div className="bg-gray-700 p-3"><span className="font-bold text-green-400">{matrix.truePositive}</span><br/>True Positive</div>
        <div className="bg-gray-700 p-3"><span className="font-bold text-red-400">{matrix.falsePositive}</span><br/>False Positive</div>
        <div className="bg-gray-700 p-3"><span className="font-bold text-orange-400">{matrix.falseNegative}</span><br/>False Negative</div>
        <div className="bg-gray-700 p-3"><span className="font-bold text-green-500">{matrix.trueNegative}</span><br/>True Negative</div>
    </div>
);

const MetricCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
        <div className="text-blue-400 text-2xl"><i className={`fas ${icon}`}></i></div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const DatasetTester: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<ModelType>('LinearSVC');
  const [results, setResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file to test.");
      return;
    }
    setIsLoading(true);
    setResults(null);
    setError(null);
    try {
      const res = await testDataset(file, model);
      setResults(res);
    } catch (err) {
      setError("Failed to process the dataset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Dataset Testing</h2>
      <p className="text-center text-gray-400 mb-6">Upload a CSV file to evaluate model performance.</p>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <div className="flex flex-col">
            <label htmlFor="file-upload" className="mb-2 text-sm font-medium text-gray-300">CSV File</label>
            <input type="file" id="file-upload" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
        </div>
        <div className="flex flex-col">
            <label htmlFor="model-select" className="mb-2 text-sm font-medium text-gray-300">ML Model</label>
            <select id="model-select" value={model} onChange={(e) => setModel(e.target.value as ModelType)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>KNN</option>
                <option>LinearSVC</option>
                <option>NaiveBayes</option>
            </select>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-6 rounded-md transition duration-300">
            {isLoading ? 'Testing...' : 'Test Model'}
        </button>
        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
      </form>

      {results && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-xl font-bold text-center mb-4">Performance Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Accuracy" value={results.accuracy.toString()} icon="fa-bullseye" />
            <MetricCard label="F1-Score" value={results.f1Score.toString()} icon="fa-balance-scale" />
            <MetricCard label="Precision" value={results.precision.toString()} icon="fa-crosshairs" />
            <MetricCard label="Recall" value={results.recall.toString()} icon="fa-undo" />
          </div>
          <div className="max-w-sm mx-auto">
            <ConfusionMatrix matrix={results.confusionMatrix} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetTester;
