import { useResumeStore } from '../../store/useResumeStore';
import type { TemplateName } from '../../types/resume';

const templates: { value: TemplateName; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
];

export function TemplateSelector() {
  const templateName = useResumeStore((s) => s.templateName);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <select
      value={templateName}
      onChange={(e) => setTemplate(e.target.value as TemplateName)}
      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {templates.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
