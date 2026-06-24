export interface Chapter {
  id: string;
  title: string;          // Topic/Temat lekcji
  content: string;
  subject: string;        // Przedmiot
  educationLevel?: string; // Legacy / backup fallback
  schoolType?: string;    // np. "Szkoła Podstawowa", "Liceum / Technikum"
  grade?: string;         // np. "Klasa 1", "Klasa 8", "Wszystkie"
  chapterGroup?: string;  // np. "Stworzenie świata", "Budowa komórki" (Rozdział/Dział nadrzędny)
  estimatedReadTime: number; // in minutes
  isDefault?: boolean;
  createdAt: number;
  quizzes?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export type ThemeType = 'light' | 'sepia' | 'blue' | 'dark' | 'dyslexic';

export interface StudentProgress {
  completedChapters: string[];
  bookmarkedChapters: string[];
  chapterNotes: Record<string, string>; // chapterId -> notes text
}

export const SCHOOL_TYPES = [
  'Ogólny / Pozostałe',
  'Szkoła Podstawowa',
  'Liceum / Technikum',
  'Szkoła Branżowa',
  'Studia / Wyższe'
];

export const GRADES = [
  'Ogólny',
  'Klasa 1',
  'Klasa 2',
  'Klasa 3',
  'Klasa 4',
  'Klasa 5',
  'Klasa 6',
  'Klasa 7',
  'Klasa 8'
];

export const EDUCATION_LEVELS = [
  'Ogólny',
  'Szkoła Podstawowa (Klasy 1-3)',
  'Szkoła Podstawowa (Klasy 4-6)',
  'Szkoła Podstawowa (Klasy 7-8)',
  'Liceum / Technikum',
  'Studia / Wyższe'
];

export interface Student {
  id: string;
  name: string;
  className: string;
  completedChapters: string[];
  bookmarkedChapters: string[];
  chapterNotes: Record<string, string>;
  quizAttempts: Record<string, { correct: number; total: number }>;
  teacherRemarks?: string;
}


