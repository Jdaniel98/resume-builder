import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';

const fields: { key: keyof ReturnType<typeof useResumeStore.getState>['resumeData']['personal']; label: string; type?: string; multiline?: boolean }[] = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'title', label: 'Job Title' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'location', label: 'Location' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
  { key: 'summary', label: 'Professional Summary', multiline: true },
];

export function PersonalInfoForm() {
  const personal = useResumeStore((s) => s.resumeData.personal);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);

  return (
    <SectionCard title="Personal Information">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) =>
          f.multiline ? (
            <div key={f.key} className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {f.label}
              </label>
              <textarea
                value={personal[f.key]}
                onChange={(e) => updatePersonal(f.key, e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ) : (
            <div key={f.key} className={f.key === 'fullName' || f.key === 'title' ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {f.label}
              </label>
              <input
                type={f.type || 'text'}
                value={personal[f.key]}
                onChange={(e) => updatePersonal(f.key, e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )
        )}
      </div>
    </SectionCard>
  );
}
