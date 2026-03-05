import { useState, useRef, useEffect, type ReactNode } from 'react';
import {
  ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
} from 'lucide-react';

const sectionIcons: Record<string, typeof User> = {
  'Personal Information': User,
  Experience: Briefcase,
  Education: GraduationCap,
  Skills: Wrench,
  Projects: FolderOpen,
};

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  });

  const Icon = sectionIcons[title];

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-50/80 transition-colors"
      >
        {Icon && (
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 shrink-0">
            <Icon className="w-3.5 h-3.5 text-blue-500" />
          </div>
        )}
        <span className="flex-1 text-sm">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? '' : '-rotate-90'
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-200 ease-in-out"
        style={{
          maxHeight: open ? contentHeight : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
        }}
      >
        <div className="px-4 pb-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}
