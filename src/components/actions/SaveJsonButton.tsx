import { Save } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { saveResumeAsJson } from '../../utils/jsonIO';

export function SaveJsonButton() {
  const resumeData = useResumeStore((s) => s.resumeData);

  return (
    <button
      type="button"
      onClick={() => saveResumeAsJson(resumeData)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
      title="Save as JSON"
    >
      <Save className="w-4 h-4" />
      <span className="hidden sm:inline">Save</span>
    </button>
  );
}
