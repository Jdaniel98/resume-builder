import { Plus, X } from 'lucide-react';

interface BulletListInputProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

export function BulletListInput({ bullets, onChange }: BulletListInputProps) {
  const updateBullet = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    onChange(updated);
  };

  const addBullet = () => onChange([...bullets, '']);

  const removeBullet = (index: number) => {
    if (bullets.length <= 1) return;
    onChange(bullets.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">
        Bullet Points
      </label>
      {bullets.map((bullet, i) => (
        <div key={i} className="flex gap-2">
          <span className="mt-2 text-gray-400 text-sm">•</span>
          <input
            type="text"
            value={bullet}
            onChange={(e) => updateBullet(i, e.target.value)}
            placeholder="Describe an achievement or responsibility..."
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => removeBullet(i)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove bullet"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addBullet}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add bullet
      </button>
    </div>
  );
}
