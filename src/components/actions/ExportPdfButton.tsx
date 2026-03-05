import { FileDown } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import type { RefObject } from 'react';

interface ExportPdfButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

export function ExportPdfButton({ contentRef }: ExportPdfButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'Resume',
  });

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow transition-all"
      title="Export as PDF"
    >
      <FileDown className="w-4 h-4" />
      <span className="hidden sm:inline">Export PDF</span>
    </button>
  );
}
