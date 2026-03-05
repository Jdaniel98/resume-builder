import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';
import { BulletListInput } from './BulletListInput';
import { SortableList, SortableItem, DragHandle } from './SortableList';
import { Plus, Trash2 } from 'lucide-react';

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resumeData.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const reorderExperience = useResumeStore((s) => s.reorderExperience);

  return (
    <SectionCard title="Experience">
      <div className="space-y-3">
        {experience.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No experience added yet. Click below to add your first position.
          </p>
        )}
        <SortableList items={experience} onReorder={reorderExperience}>
        {experience.map((exp, index) => (
          <SortableItem key={exp.id} id={exp.id}>
          <div
            className="border border-gray-100 rounded-lg p-3 space-y-3 bg-gray-50/80 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DragHandle id={exp.id} />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Position {index + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) =>
                    updateExperience(exp.id, { role: e.target.value })
                  }
                  placeholder="Software Engineer"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                  placeholder="Acme Corp"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { startDate: e.target.value })
                    }
                    placeholder="Jan 2022"
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { endDate: e.target.value })
                    }
                    placeholder="Present"
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <BulletListInput
              bullets={exp.bullets}
              onChange={(bullets) => updateExperience(exp.id, { bullets })}
            />
          </div>
          </SortableItem>
        ))}
        </SortableList>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-blue-500 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
    </SectionCard>
  );
}
