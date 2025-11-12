export interface FilterState {
  keywords: string;
  roles: string[];
  countries: string[];
  visaSponsorshipRequired: boolean;
  internationalApplicantsOnly: boolean;
  datePostedFilter: "all" | "week" | "month";
}

export interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  requiredDocuments: string[];
  visaSponsorshipAvailable: boolean;
  internationalApplicantsWelcome: boolean;
  postedDate: string;
  daysAgo: number;
  source: string;
  verificationStatus: "verified" | "likely" | "unverified";
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export type Tab = "listings" | "insights" | "resources";

export interface AppError {
  type: "api" | "parsing" | "network" | "unknown";
  message: string;
}
