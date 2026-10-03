"use client";

export type CardStatus = "mastered" | "review" | "hard";

const STORAGE_KEYS = {
  CARD_MASTERY: "edupass_card_mastery",
  WRONG_QUIZZES: "edupass_wrong_quizzes",
  STUDY_STATS: "edupass_study_stats",
};

export function getSavedCardMastery(): Record<string, CardStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARD_MASTERY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load card mastery from localStorage:", e);
    return {};
  }
}

export function saveCardMastery(id: string, status: CardStatus): Record<string, CardStatus> {
  if (typeof window === "undefined") return {};
  try {
    const current = getSavedCardMastery();
    current[id] = status;
    localStorage.setItem(STORAGE_KEYS.CARD_MASTERY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error("Failed to save card mastery:", e);
    return {};
  }
}

export function getSavedWrongQuizIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WRONG_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load wrong quizzes:", e);
    return [];
  }
}

export function addSavedWrongQuizId(id: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getSavedWrongQuizIds();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(STORAGE_KEYS.WRONG_QUIZZES, JSON.stringify(current));
    }
    return current;
  } catch (e) {
    console.error("Failed to add wrong quiz ID:", e);
    return [];
  }
}

export function removeSavedWrongQuizId(id: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getSavedWrongQuizIds().filter((qId) => qId !== id);
    localStorage.setItem(STORAGE_KEYS.WRONG_QUIZZES, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error("Failed to remove wrong quiz ID:", e);
    return [];
  }
}

export function clearAllSavedWrongQuizzes(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.WRONG_QUIZZES);
  } catch (e) {
    console.error("Failed to clear wrong quizzes:", e);
  }
}
