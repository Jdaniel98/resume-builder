import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';

const fields: { key: keyof ReturnType<typeof useResumeStore.getState>['resumeData']['personal']; label: string; type?: string; multiline?: boolean; placeholder?: string }[] = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Jane Doe' },
  { key: 'title', label: 'Job Title', placeholder: 'Senior Software Engineer' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 123-4567' },
  { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
  { key: 'website', label: 'Website', type: 'url', placeholder: 'https://janedoe.dev' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/janedoe' },
  { key: 'summary', label: 'Professional Summary', multiline: true, placeholder: 'A brief overview of your experience and goals...' },
];

export function PersonalInfoForm() {
  const personal = useResumeStore((s) => s.resumeData.personal);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);

  return (
    <SectionCard title="Personal Information">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) =>
          f.multiline ? (
            <div key={f.key} className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {f.label}
              </label>
              <textarea
                value={personal[f.key]}
                onChange={(e) => updatePersonal(f.key, e.target.value)}
                rows={3}
                placeholder={f.placeholder}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ) : (
            <div key={f.key} className={f.key === 'fullName' || f.key === 'title' ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {f.label}
              </label>
              <input
                type={f.type || 'text'}
                value={personal[f.key]}
                onChange={(e) => updatePersonal(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )
        )}
      </div>
    </SectionCard>
  );
}
