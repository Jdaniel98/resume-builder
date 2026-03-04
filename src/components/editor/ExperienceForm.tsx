import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';
import { BulletListInput } from './BulletListInput';
import { Plus, Trash2 } from 'lucide-react';

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resumeData.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  return (
    <SectionCard title="Experience">
      <div className="space-y-4">
        {experience.map((exp, index) => (
          <div
            key={exp.id}
            className="border border-gray-100 rounded-md p-3 space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Position {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) =>
                    updateExperience(exp.id, { role: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { startDate: e.target.value })
                    }
                    placeholder="Jan 2022"
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { endDate: e.target.value })
                    }
                    placeholder="Present"
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <BulletListInput
              bullets={exp.bullets}
              onChange={(bullets) => updateExperience(exp.id, { bullets })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
    </SectionCard>
  );
}
