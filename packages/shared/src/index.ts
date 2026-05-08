export type UserRole = "admin" | "user";
export type Classification = "Safe" | "Suspicious" | "Dangerous";

export interface ThreatIndicatorDto {
  type: string;
  description: string;
}

export interface ScanResultDto {
  score: number;
  classification: Classification;
  extractedUrls: string[];
  aiAnalysis: string;
  indicators: ThreatIndicatorDto[];
}
