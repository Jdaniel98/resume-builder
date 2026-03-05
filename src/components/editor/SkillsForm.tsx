import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';
import { SortableList, SortableItem, DragHandle } from './SortableList';
import { Plus, Trash2, X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

function TagInput({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
    if (e.key === 'Backspace' && input === '' && items.length > 0) {
      onChange(items.slice(0, -1));
    }
  };

  return (
    <div>
      {items.filter(Boolean).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {items
            .filter(Boolean)
            .map((item, i) => (
              <span
                key={i}
                className="group inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="text-blue-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addItem}
        placeholder="Type a skill and press Enter..."
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resumeData.skills);
  const addSkillGroup = useResumeStore((s) => s.addSkillGroup);
  const updateSkillGroup = useResumeStore((s) => s.updateSkillGroup);
  const removeSkillGroup = useResumeStore((s) => s.removeSkillGroup);
  const reorderSkills = useResumeStore((s) => s.reorderSkills);

  return (
    <SectionCard title="Skills">
      <div className="space-y-3">
        {skills.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No skill groups added yet. Click below to add your first group.
          </p>
        )}
        <SortableList items={skills} onReorder={reorderSkills}>
        {skills.map((group, index) => (
          <SortableItem key={group.id} id={group.id}>
          <div
            className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/80 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DragHandle id={group.id} />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Group {index + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeSkillGroup(group.id)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Category
              </label>
              <input
                type="text"
                value={group.category}
                onChange={(e) =>
                  updateSkillGroup(group.id, { category: e.target.value })
                }
                placeholder="e.g. Languages, Frameworks, Tools"
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Skills
              </label>
              <TagInput
                items={group.items}
                onChange={(items) => updateSkillGroup(group.id, { items })}
              />
            </div>
          </div>
          </SortableItem>
        ))}
        </SortableList>
        <button
          type="button"
          onClick={addSkillGroup}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-blue-500 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Skill Group
        </button>
      </div>
    </SectionCard>
  );
}
