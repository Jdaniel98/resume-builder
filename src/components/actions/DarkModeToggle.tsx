import { Moon, Sun } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useEffect } from 'react';

export function DarkModeToggle() {
  const darkMode = useResumeStore((s) => s.darkMode);
  const toggleDarkMode = useResumeStore((s) => s.toggleDarkMode);

  // Apply dark mode class on mount if saved preference exists
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark-toggle transition-all"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
