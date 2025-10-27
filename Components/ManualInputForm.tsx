
import React, { useState } from 'react';
import { ProfileFeatures, Prediction, ModelType } from '../types';
import { predict } from '../services/mlService';

const defaultFeatures: ProfileFeatures = {
  profilePic: 1,
  numsLengthUsername: 0.1,
  fullnameWords: 2,
  numsLengthFullname: 0,
  nameEqualsUsername: 0,
  descriptionLength: 80,
  externalURL: 1,
  private: 0,
  posts: 150,
  followers: 500,
  follows: 200,
};

const ManualInputForm: React.FC = () => {
  const [features, setFeatures] = useState<ProfileFeatures>(defaultFeatures);
  const [model, setModel] = useState<ModelType>('LinearSVC');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : parseFloat(value)
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "model") {
        setModel(value as ModelType);
    } else {
        setFeatures(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    const result = await predict(features, model);
    setPrediction(result);
    setIsLoading(false);
  };
  
  const renderInput = (name: keyof ProfileFeatures, label: string, type: 'number' | 'range', props?: any) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-300">{label}</label>
        <input id={name} name={name} type={type} value={features[name]} onChange={handleInputChange} {...props}
         className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
    </div>
  );

  const renderSelect = (name: keyof ProfileFeatures, label: string, options: {val: number, label: string}[]) => (
      <div className="flex flex-col">
          <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-300">{label}</label>
          <select id={name} name={name} value={features[name]} onChange={handleSelectChange} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
              {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
          </select>
      </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Manual Feature Input</h2>
      <p className="text-center text-gray-400 mb-6">Enter profile feature values to classify an account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderSelect('profilePic', 'Has Profile Picture', [{val: 1, label: 'Yes'}, {val: 0, label: 'No'}])}
            {renderInput('numsLengthUsername', 'Numbers/Username Length Ratio', 'range', {min: 0, max: 1, step: 0.01})}
            {renderInput('fullnameWords', 'Words in Full Name', 'number', {min: 0})}
            {renderInput('numsLengthFullname', 'Numbers/Full Name Length Ratio', 'range', {min: 0, max: 1, step: 0.01})}
            {renderSelect('nameEqualsUsername', 'Name Matches Username', [{val: 1, label: 'Yes'}, {val: 0, label: 'No'}])}
            {renderInput('descriptionLength', 'Description Length', 'number', {min: 0})}
            {renderSelect('externalURL', 'Has External URL', [{val: 1, label: 'Yes'}, {val: 0, label: 'No'}])}
            {renderSelect('private', 'Is Private', [{val: 1, label: 'Yes'}, {val: 0, label: 'No'}])}
            {renderInput('posts', '# Posts', 'number', {min: 0})}
            {renderInput('followers', '# Followers', 'number', {min: 0})}
            {renderInput('follows', '# Follows', 'number', {min: 0})}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex flex-col w-full sm:w-auto">
                <label htmlFor="model" className="mb-1 text-sm font-medium text-gray-300">ML Model</label>
                <select id="model" name="model" value={model} onChange={(e) => setModel(e.target.value as ModelType)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option>KNN</option>
                    <option>LinearSVC</option>
                    <option>NaiveBayes</option>
                </select>
            </div>
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-8 rounded-md transition duration-300 mt-2 sm:mt-0 self-end">
                {isLoading ? 'Predicting...' : 'Predict'}
            </button>
        </div>
      </form>
      {prediction && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg text-center animate-fade-in">
          <h3 className="text-lg font-semibold">Prediction Result</h3>
          <p className={`text-4xl font-bold my-2 ${prediction.result === 'REAL' ? 'text-green-400' : 'text-red-400'}`}>
            {prediction.result}
          </p>
          <p className="text-gray-300">Confidence: <span className="font-semibold text-blue-400">{(prediction.confidence * 100).toFixed(0)}%</span></p>
        </div>
      )}
    </div>
  );
};

export default ManualInputForm;
