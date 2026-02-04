
export enum TenseCategory {
  PRESENT = 'Present',
  PAST = 'Past',
  FUTURE = 'Future',
  MODALS = 'Modals',
  CONDITIONALS = 'Conditionals',
  VOICE = 'Voice',
  ADJECTIVES = 'Adjectives'
}

export type SubType = string;

export type PracticeScenario = 
  | 'Standard' 
  | 'Job Interview' 
  | 'Coffee Shop' 
  | 'Airport' 
  | 'Friend Chat'
  | 'Fitness Coach'
  | 'Tech Buddy'
  | 'Travel Guide';

export type VoiceGender = 'Male' | 'Female';

export interface TenseDefinition {
  category: TenseCategory;
  type: SubType;
  hindiSuffix: string;
  description: string;
  exampleHindi: string;
  exampleEnglish: string;
}

export interface TranslationResponse {
  english: string;
  hindi?: string;
  explanation: string;
  tenseUsed: string;
}

export interface SavedSentence {
  id: string;
  hindi: string;
  english: string;
  explanation?: string;
  timestamp: number;
  lastReviewed?: number;
}

export interface CustomSentence {
  id: string;
  text: string;
  timestamp: number;
}

export interface PracticeSession {
  id: string;
  category: TenseCategory;
  type: SubType;
  scenario: PracticeScenario;
  timestamp: number;
  transcripts: { user: string; model: string }[];
  fluencyScore: number;
  isCustom?: boolean;
}
