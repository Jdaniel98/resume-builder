import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { parseResumeJson } from '../../utils/jsonIO';

export function ImportJsonButton() {
  const loadFromJson = useResumeStore((s) => s.loadFromJson);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await parseResumeJson(file);
      loadFromJson(data);
    } catch {
      alert('Failed to import: invalid resume JSON file.');
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        title="Import JSON"
      >
        <Upload className="w-4 h-4" />
        Import
      </button>
    </>
  );
}
