/** @format */

// types/audioML.ts
export interface AudioFeatures {
  mfccs: number[][];
  spectralCentroid: number[];
  zeroCrossingRate: number[];
  spectralRolloff: number[];
  spectralBandwidth: number[];
  chroma: number[];
}

export interface PredictionResult {
  className: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface ProgressInfo {
  stage: "loading" | "preprocessing" | "extracting" | "predicting" | "complete";
  progress: number; // 0-100
  message: string;
}

export interface AudioProcessorConfig {
  sampleRate: number;
  nMels: number;
  nMfcc: number;
  nFFT: number;
  hopLength: number;
  maxLength: number;
  numChromaBins: number;
}

export interface WorkerMessage {
  type: "extract-features" | "progress" | "error" | "complete";
  data?: any;
  error?: string;
  progress?: ProgressInfo;
}
