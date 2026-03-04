import { useEffect } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { saveResumeAsJson } from '../utils/jsonIO';

export function useKeyboardShortcuts(onPrint: () => void) {
  const resumeData = useResumeStore((s) => s.resumeData);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === 's') {
        e.preventDefault();
        saveResumeAsJson(resumeData);
      }

      if (e.key === 'p') {
        e.preventDefault();
        onPrint();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resumeData, onPrint]);
}
