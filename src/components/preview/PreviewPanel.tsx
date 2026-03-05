import { forwardRef } from 'react';
import { ResumePreview } from './ResumePreview';
import '../templates/ClassicTemplate.css';
import '../templates/ModernTemplate.css';
import '../templates/MinimalTemplate.css';
import '../templates/ProfessionalTemplate.css';
import '../templates/CreativeTemplate.css';
import '../templates/DarkMode.css';

export const PreviewPanel = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <div className="h-full overflow-y-auto bg-gray-100 preview-bg">
      <div
        ref={ref}
        className="bg-white shadow-lg mx-auto my-6 max-w-[850px] rounded-sm"
        style={{ minHeight: '29.7cm' }}
      >
        <ResumePreview />
      </div>
    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
