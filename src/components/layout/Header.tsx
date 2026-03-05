import type { RefObject } from 'react';
import { TemplateSelector } from '../actions/TemplateSelector';
import { DarkModeToggle } from '../actions/DarkModeToggle';
import { SaveJsonButton } from '../actions/SaveJsonButton';
import { ImportJsonButton } from '../actions/ImportJsonButton';
import { ExportPdfButton } from '../actions/ExportPdfButton';
import { UndoRedoButtons } from '../actions/UndoRedoButtons';
import { ATSScoreButton } from '../actions/ATSScoreButton';
import { FileText } from 'lucide-react';

interface HeaderProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function Header({ previewRef }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-gray-200/80 bg-white/95 backdrop-blur-sm shadow-sm shrink-0 gap-3">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-gray-900 leading-tight tracking-tight">
            Resume Builder
          </h1>
          <p className="text-[10px] text-gray-400 leading-tight">
            Markdown-powered
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <UndoRedoButtons />
        <div className="w-px h-6 bg-gray-200 mx-0.5 hidden sm:block" />
        <TemplateSelector />
        <DarkModeToggle />
        <div className="w-px h-6 bg-gray-200 mx-0.5 hidden sm:block" />
        <ATSScoreButton />
        <ImportJsonButton />
        <SaveJsonButton />
        <ExportPdfButton contentRef={previewRef} />
      </div>
    </header>
  );
}
