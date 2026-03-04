import type { RefObject } from 'react';
import { TemplateSelector } from '../actions/TemplateSelector';
import { SaveJsonButton } from '../actions/SaveJsonButton';
import { ImportJsonButton } from '../actions/ImportJsonButton';
import { ExportPdfButton } from '../actions/ExportPdfButton';
import { FileText } from 'lucide-react';

interface HeaderProps {
  previewRef: RefObject<HTMLDivElement | null>;
}

export function Header({ previewRef }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <h1 className="text-base font-semibold text-gray-800">
          Resume Builder
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <TemplateSelector />
        <div className="w-px h-6 bg-gray-200" />
        <ImportJsonButton />
        <SaveJsonButton />
        <ExportPdfButton contentRef={previewRef} />
      </div>
    </header>
  );
}
