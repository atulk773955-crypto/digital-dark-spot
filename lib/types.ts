export type Mode = 'quick' | 'deep' | 'official';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export interface Source { id: string; title: string; url: string; domain: string; provider: string; type: string; publishedDate?: string; content: string; }
export interface Claim { sourceId: string; text: string; excerpt: string; quoteVerified: boolean; }
export interface Gap { title: string; explanation: string; whyItMatters: string; question: string; priority: Priority; action: string; status: 'answered' | 'partial' | 'unanswered'; }
export interface Conflict { topic: string; a: Claim; b: Claim; possibleExplanation: string; verify: string; }
export interface Freshness { sourceId: string; status: 'Potentially outdated' | 'Undated' | 'Date unclear' | 'Current for stated cycle'; note: string; }
export interface CheckItem { question: string; why: string; priority: Priority; status: 'Unverified' | 'Partially verified' | 'Verified against reviewed evidence'; suggestedSource: string; refs: string[]; }
export interface Analysis { summary: string; claims: Claim[]; gaps: Gap[]; conflicts: Conflict[]; freshness: Freshness[]; checklist: CheckItem[]; }
export interface Session { id: string; query: string; mode: Mode; createdAt: string; sources: Source[]; warnings: string[]; analysis: Analysis; }
