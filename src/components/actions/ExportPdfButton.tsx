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
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      title="Export as PDF"
    >
      <FileDown className="w-4 h-4" />
      <span className="hidden sm:inline">Export PDF</span>
    </button>
  );
}
