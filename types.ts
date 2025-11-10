export interface FilterState {
  keywords: string;
  roles: string[];
  countries: string[];
}

export interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  requiredDocuments: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export type Tab = 'listings' | 'insights' | 'resources';

export interface AppError {
  type: 'api' | 'parsing' | 'network' | 'unknown';
  message: string;
}