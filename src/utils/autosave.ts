import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'resume-builder-data';
const DEBOUNCE_MS = 1000;

let timeout: ReturnType<typeof setTimeout> | null = null;

export function saveToLocalStorage(data: ResumeData): void {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.warn('Failed to save to localStorage');
    }
  }, DEBOUNCE_MS);
}

export function loadFromLocalStorage(): ResumeData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.personal && Array.isArray(parsed.experience)) {
      return parsed as ResumeData;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
