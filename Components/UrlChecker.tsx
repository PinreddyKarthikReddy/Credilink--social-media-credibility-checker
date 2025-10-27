
import React, { useState } from 'react';
import { scrapeProfile } from '../services/scraperService';
import { predict } from '../services/mlService';
import { ScrapedData, Prediction, FeatureCredibility, ProfileFeatures, ModelType } from '../types';

const featureLabels: Record<keyof ProfileFeatures, string> = {
  profilePic: "Profile Picture",
  numsLengthUsername: "Numbers in Username",
  fullnameWords: "Words in Full Name",
  numsLengthFullname: "Numbers in Full Name",
  nameEqualsUsername: "Name Matches Username",
  descriptionLength: "Description Length",
  externalURL: "External URL",
  private: "Private Account",
  posts: "# Posts",
  followers: "# Followers",
  follows: "# Follows",
};

const featureAnalysis = (feature: keyof ProfileFeatures, value: number): { analysis: string; indicator: 'Positive' | 'Negative' | 'Neutral' } => {
    switch (feature) {
        case 'profilePic': return value === 1 ? { analysis: "Present", indicator: 'Positive' } : { analysis: "Missing", indicator: 'Negative' };
        case 'numsLengthUsername':
            if (value > 0.5) return { analysis: "High ratio", indicator: 'Negative' };
            if (value > 0.2) return { analysis: "Some numbers", indicator: 'Neutral' };
            return { analysis: "Low ratio", indicator: 'Positive' };
        case 'fullnameWords': return value >= 2 ? { analysis: `${value} words`, indicator: 'Positive' } : { analysis: `${value} words`, indicator: 'Negative' };
        case 'nameEqualsUsername': return value === 0 ? { analysis: "Does not match", indicator: 'Positive' } : { analysis: "Matches", indicator: 'Negative' };
        case 'descriptionLength': return value > 20 ? { analysis: `${value} chars`, indicator: 'Positive' } : { analysis: `${value} chars`, indicator: 'Negative' };
        case 'externalURL': return value === 1 ? { analysis: "Present", indicator: 'Positive' } : { analysis: "Missing", indicator: 'Neutral' };
        case 'private': return value === 1 ? { analysis: "Private", indicator: 'Neutral' } : { analysis: "Public", indicator: 'Positive' };
        case 'posts': return value > 10 ? { analysis: value.toLocaleString(), indicator: 'Positive' } : { analysis: value.toLocaleString(), indicator: 'Negative' };
        case 'followers': return value > 100 ? { analysis: value.toLocaleString(), indicator: 'Positive' } : { analysis: value.toLocaleString(), indicator: 'Negative' };
        case 'follows': return value > 2000 ? { analysis: value.toLocaleString(), indicator: 'Negative' } : { analysis: value.toLocaleString(), indicator: 'Positive' };
        default: return { analysis: value.toString(), indicator: 'Neutral' };
    }
};

const UrlChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<{ scrapedData: ScrapedData; prediction: Prediction } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL or handle.");
      return;
    }
    setIsLoading(true);
    setReport(null);
    setError(null);
    try {
      const scrapedData = await scrapeProfile(url);
      const prediction = await predict(scrapedData, 'LinearSVC'); // Use best model
      setReport({ scrapedData, prediction });
    } catch (err) {
      setError("Failed to check profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const indicatorColor = (indicator: 'Positive' | 'Negative' | 'Neutral') => {
      switch(indicator) {
          case 'Positive': return 'text-green-400';
          case 'Negative': return 'text-red-400';
          default: return 'text-yellow-400';
      }
  }

  const renderReport = () => {
    if (!report) return null;
    const { scrapedData, prediction } = report;
    const features: FeatureCredibility[] = (Object.keys(scrapedData) as Array<keyof ProfileFeatures>)
      .filter(key => featureLabels[key])
      .map(key => ({
        feature: key,
        label: featureLabels[key],
        value: scrapedData[key],
        ...featureAnalysis(key, scrapedData[key])
      }));

    return (
      <div className="mt-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg text-center bg-gray-700`}>
                <h3 className="text-sm font-medium text-gray-400">Prediction</h3>
                <p className={`text-3xl font-bold ${prediction.result === 'REAL' ? 'text-green-400' : 'text-red-400'}`}>{prediction.result}</p>
            </div>
            <div className="p-4 rounded-lg text-center bg-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Confidence Score</h3>
                <p className="text-3xl font-bold text-blue-400">{(prediction.confidence * 100).toFixed(0)}%</p>
            </div>
            <div className="p-4 rounded-lg text-center bg-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Final Credibility Score</h3>
                <p className="text-3xl font-bold text-teal-400">{scrapedData.finalCredibilityScore}%</p>
            </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-200">Feature Credibility Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-gray-700 rounded-lg">
              <thead className="bg-gray-600">
                <tr>
                  <th className="p-3 text-sm font-semibold">Feature</th>
                  <th className="p-3 text-sm font-semibold">Value</th>
                  <th className="p-3 text-sm font-semibold">Indicator</th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr key={index} className="border-b border-gray-600 last:border-0">
                    <td className="p-3 font-medium text-gray-300">{item.label}</td>
                    <td className="p-3 text-gray-200">{item.analysis}</td>
                    <td className={`p-3 font-semibold ${indicatorColor(item.indicator)}`}>{item.indicator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Social Media URL Profile Check</h2>
      <p className="text-center text-gray-400 mb-6">Enter a profile URL or handle to automatically analyze its credibility.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., instagram.com/nasa or @nasa"
          className="flex-grow bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              <span>Analyzing...</span>
            </>
          ) : (
             <>
              <i className="fas fa-search mr-2"></i>
              <span>Check</span>
            </>
          )}
        </button>
      </form>
      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      {renderReport()}
    </div>
  );
};

export default UrlChecker;
