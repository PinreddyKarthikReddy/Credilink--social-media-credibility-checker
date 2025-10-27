
export type Page = 'dashboard' | 'comparison';
export type DashboardMode = 'url' | 'manual' | 'dataset';
export type ModelType = 'KNN' | 'LinearSVC' | 'NaiveBayes';
export type PredictionResult = 'REAL' | 'FAKE';

export interface ProfileFeatures {
  profilePic: number; // 0 or 1
  numsLengthUsername: number;
  fullnameWords: number;
  numsLengthFullname: number;
  nameEqualsUsername: number; // 0 or 1
  descriptionLength: number;
  externalURL: number; // 0 or 1
  private: number; // 0 or 1
  posts: number;
  followers: number;
  follows: number;
}

export interface Prediction {
  result: PredictionResult;
  confidence: number;
}

export interface ScrapedData extends ProfileFeatures {
  finalCredibilityScore: number;
}

export interface FeatureCredibility {
  feature: keyof ProfileFeatures;
  label: string;
  value: number;
  analysis: string;
  indicator: 'Positive' | 'Negative' | 'Neutral';
}

export interface TestResults {
  accuracy: number;
  f1Score: number;
  precision: number;
  recall: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    falseNegative: number;
    trueNegative: number;
  };
}

export interface ModelPerformance extends TestResults {
  model: ModelType;
}
