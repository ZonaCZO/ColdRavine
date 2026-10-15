export type IntelligenceReport = {
  id: number;
  title: string;
  type: "Recon" | "Field Report";
  threat: "Low" | "Medium" | "High" | "Critical";
  location: string;
  description: string;
  author: string;
  date: string;
};
