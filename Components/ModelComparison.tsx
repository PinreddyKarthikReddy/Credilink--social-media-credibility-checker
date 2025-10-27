
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getModelsPerformance } from '../services/mlService';
import { ModelPerformance } from '../types';

const ModelComparison: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<ModelPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getModelsPerformance();
        setPerformanceData(data);
      } catch (err) {
        setError("Failed to load model performance data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-400"></i>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Model Performance Comparison</h2>
      <p className="text-center text-gray-400 mb-8">
        Comparing key performance metrics across different machine learning models.
      </p>
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="model" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2D3748',
                  border: '1px solid #4A5568',
                  color: '#E2E8F0',
                }}
              />
              <Legend wrapperStyle={{ color: '#E2E8F0' }} />
              <Bar dataKey="accuracy" fill="#4299E1" name="Accuracy" />
              <Bar dataKey="f1Score" fill="#48BB78" name="F1-Score" />
              <Bar dataKey="precision" fill="#ECC94B" name="Precision" />
              <Bar dataKey="recall" fill="#ED8936" name="Recall" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
