import { useEffect } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { saveResumeAsJson } from '../utils/jsonIO';

export function useKeyboardShortcuts(onPrint: () => void) {
  const resumeData = useResumeStore((s) => s.resumeData);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      // Save: Ctrl/Cmd + S
      if (e.key === 's') {
        e.preventDefault();
        saveResumeAsJson(resumeData);
      }

      // Print/Export: Ctrl/Cmd + P
      if (e.key === 'p') {
        e.preventDefault();
        onPrint();
      }

      // Undo: Ctrl/Cmd + Z
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useResumeStore.temporal.getState().undo();
      }

      // Redo: Ctrl/Cmd + Shift + Z  or  Ctrl/Cmd + Y
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        useResumeStore.temporal.getState().redo();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resumeData, onPrint]);
}
