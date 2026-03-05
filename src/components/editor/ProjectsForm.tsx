import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';
import { Plus, Trash2 } from 'lucide-react';

export function ProjectsForm() {
  const projects = useResumeStore((s) => s.resumeData.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  return (
    <SectionCard title="Projects">
      <div className="space-y-4">
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            className="border border-gray-100 rounded-md p-3 space-y-3 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Project {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeProject(proj.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, { name: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={proj.url}
                  onChange={(e) =>
                    updateProject(proj.id, { url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(proj.id, { description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies.join(', ')}
                  onChange={(e) =>
                    updateProject(proj.id, {
                      technologies: e.target.value
                        .split(',')
                        .map((t) => t.trim()),
                    })
                  }
                  placeholder="React, Node.js, PostgreSQL"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
    </SectionCard>
  );
}
