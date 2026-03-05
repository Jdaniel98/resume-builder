import { Save } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { saveResumeAsJson } from '../../utils/jsonIO';

export function SaveJsonButton() {
  const resumeData = useResumeStore((s) => s.resumeData);

  return (
    <button
      type="button"
      onClick={() => saveResumeAsJson(resumeData)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      title="Save as JSON"
    >
      <Save className="w-4 h-4" />
      <span className="hidden sm:inline">Save</span>
    </button>
  );
}
