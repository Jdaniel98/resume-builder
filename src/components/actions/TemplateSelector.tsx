import { useResumeStore } from '../../store/useResumeStore';
import type { TemplateName } from '../../types/resume';
import { Palette } from 'lucide-react';

const templates: { value: TemplateName; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
];

export function TemplateSelector() {
  const templateName = useResumeStore((s) => s.templateName);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <div className="relative flex items-center">
      <Palette className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      <select
        value={templateName}
        onChange={(e) => setTemplate(e.target.value as TemplateName)}
        className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none cursor-pointer"
      >
        {templates.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
