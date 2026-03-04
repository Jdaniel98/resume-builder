import { useResumeStore } from '../../store/useResumeStore';
import { SectionCard } from './SectionCard';
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
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items
          .filter(Boolean)
          .map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addItem}
        placeholder="Type a skill and press Enter..."
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resumeData.skills);
  const addSkillGroup = useResumeStore((s) => s.addSkillGroup);
  const updateSkillGroup = useResumeStore((s) => s.updateSkillGroup);
  const removeSkillGroup = useResumeStore((s) => s.removeSkillGroup);

  return (
    <SectionCard title="Skills">
      <div className="space-y-4">
        {skills.map((group, index) => (
          <div
            key={group.id}
            className="border border-gray-100 rounded-md p-3 space-y-2 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Group {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeSkillGroup(group.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Category
              </label>
              <input
                type="text"
                value={group.category}
                onChange={(e) =>
                  updateSkillGroup(group.id, { category: e.target.value })
                }
                placeholder="e.g. Languages, Frameworks, Tools"
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Skills
              </label>
              <TagInput
                items={group.items}
                onChange={(items) => updateSkillGroup(group.id, { items })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addSkillGroup}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Skill Group
        </button>
      </div>
    </SectionCard>
  );
}
