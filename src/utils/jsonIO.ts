import type { ResumeData } from '../types/resume';

export function saveResumeAsJson(data: ResumeData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume_${data.personal.fullName.replace(/\s+/g, '_') || 'untitled'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseResumeJson(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.personal || !Array.isArray(parsed.experience)) {
          throw new Error('Invalid resume format: missing required fields');
        }
        resolve(parsed as ResumeData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
