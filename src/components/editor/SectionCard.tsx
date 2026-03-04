import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SectionCard({
  title,
  children,
  defaultOpen = true,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        {title}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}
