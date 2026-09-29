export type SubjectId =
  | "all"
  | "intro"
  | "civil_law"
  | "broker_law"
  | "public_law"
  | "disclosure_law"
  | "tax_law";

export type ContentType = "concept" | "formula" | "mnemonic" | "quiz";

export interface FormulaVariable {
  id: string;
  name: string;
  unit: string;
  defaultValue: number;
}

export interface Formula {
  latex: string;
  description: string;
  variables: FormulaVariable[];
  calculateScript?: string;
}

export interface Mnemonic {
  phrase: string;
  details: string;
}

export interface Quiz {
  id: string;
  type: "ox" | "multiple_choice";
  question: string;
  answer?: boolean;
  options?: string[];
  answerIndex?: number;
  explanation: string;
}

export interface StudyItem {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  chapter: string;
  type: ContentType;
  title: string;
  tags: string[];
  summary: string;
  mnemonic?: Mnemonic;
  formula?: Formula;
  quizzes: Quiz[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyLog {
  date: string;
  itemIds: string[];
  notes?: string;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  tier: "1차" | "2차";
  icon: string;
  color: string;
  description: string;
}
