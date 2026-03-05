import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';
import { SortableList, SortableItem, DragHandle } from './SortableList';
import { Plus, Trash2 } from 'lucide-react';

export function EducationForm() {
  const education = useResumeStore((s) => s.resumeData.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const reorderEducation = useResumeStore((s) => s.reorderEducation);

  return (
    <SectionCard title="Education">
      <div className="space-y-3">
        {education.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No education added yet. Click below to add your first entry.
          </p>
        )}
        <SortableList items={education} onReorder={reorderEducation}>
        {education.map((edu, index) => (
          <SortableItem key={edu.id} id={edu.id}>
          <div
            className="border border-gray-100 rounded-lg p-3 space-y-3 bg-gray-50/80 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DragHandle id={edu.id} />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Education {index + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                  placeholder="B.S. Computer Science"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, { institution: e.target.value })
                  }
                  placeholder="MIT"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, { location: e.target.value })
                  }
                  placeholder="Cambridge, MA"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start Year
                </label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) =>
                    updateEducation(edu.id, { startDate: e.target.value })
                  }
                  placeholder="2015"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End Year
                </label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) =>
                    updateEducation(edu.id, { endDate: e.target.value })
                  }
                  placeholder="2019"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Additional Details
                </label>
                <input
                  type="text"
                  value={edu.details}
                  onChange={(e) =>
                    updateEducation(edu.id, { details: e.target.value })
                  }
                  placeholder="Honors, GPA, relevant coursework..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          </SortableItem>
        ))}
        </SortableList>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-blue-500 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>
    </SectionCard>
  );
}
