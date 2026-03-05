import type { RefObject } from 'react';
import { TemplateSelector } from '../actions/TemplateSelector';
import { DarkModeToggle } from '../actions/DarkModeToggle';
import { SaveJsonButton } from '../actions/SaveJsonButton';
import { ImportJsonButton } from '../actions/ImportJsonButton';
import { ExportPdfButton } from '../actions/ExportPdfButton';
import { FileText } from 'lucide-react';

interface HeaderProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function Header({ previewRef }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-gray-200 bg-white shrink-0 gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <FileText className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800 hidden sm:block">
          Resume Builder
        </h1>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
        <TemplateSelector />
        <DarkModeToggle />
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />
        <ImportJsonButton />
        <SaveJsonButton />
        <ExportPdfButton contentRef={previewRef} />
      </div>
    </header>
  );
}
