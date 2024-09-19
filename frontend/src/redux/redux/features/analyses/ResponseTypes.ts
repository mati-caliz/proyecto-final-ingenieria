export interface Analysis {
  affirmation: string;
  analysis: string;
  veredict: string;
}

export interface AnalysisResponse {
  title: string;
  analysis: Analysis[];
}
